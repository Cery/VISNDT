import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma, SupplierProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Data contract for creating a SupplierProduct draft entity.
 * Service-layer only; no DTO / controller exposure in this task.
 */
export interface CreateSupplierProductInput {
  organizationId: string;
  platformProductId: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  slug?: string | null;
  description?: string | null;
  technicalDescription?: string | null;
  applicationInfo?: string | null;
}

/**
 * SupplierProductsService — M28.0 Hybrid Model C.
 *
 * Domain boundary:
 *   SupplierProduct = Supplier Owned Model Entity.
 *     belongsTo Organization (ownership isolation enforced on every query)
 *     binds to platformProductId (Platform Capability Node, NOT owned)
 *
 * Responsibility (service layer only):
 *   - Create draft entity
 *   - Query SupplierProducts with organization ownership isolation
 *   - Validate ownership
 *   - Validate capability binding against the Platform Product
 *   - Manage approval data-access boundary (no runtime approval workflow here)
 *
 * No transport, no API exposure, no global supplier mutation.
 */
@Injectable()
export class SupplierProductsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a SUPPLIER_PRODUCT DRAFT entity.
   * Enforces that the platform product exists (capability binding validation).
   * All new supplier products start in DRAFT lifecycle state.
   */
  async createDraft(input: CreateSupplierProductInput) {
    await this.ensurePlatformProductExists(input.platformProductId);

    const supplierProduct = await this.prisma.supplierProduct.create({
      data: {
        organizationId: input.organizationId,
        platformProductId: input.platformProductId,
        brand: input.brand,
        series: input.series ?? null,
        modelNumber: input.modelNumber,
        slug: input.slug ?? null,
        description: input.description ?? null,
        technicalDescription: input.technicalDescription ?? null,
        applicationInfo: input.applicationInfo ?? null,
        status: SupplierProductStatus.DRAFT,
      },
    });

    return supplierProduct;
  }

  /**
   * Find one SupplierProduct scoped to an owning organization.
   * Ownership isolation — global / cross-organization reads are forbidden.
   */
  async findOne(id: string, organizationId: string) {
    const supplierProduct = await this.prisma.supplierProduct.findFirst({
      where: { id, organizationId },
      include: {
        organization: true,
        platformProduct: true,
        media: true,
        parameterValues: { include: { parameterDefinition: true } },
      },
    });
    if (!supplierProduct) {
      throw new NotFoundException(
        `SupplierProduct ${id} not found in organization ${organizationId}`,
      );
    }
    return supplierProduct;
  }

  /**
   * List SupplierProducts for an owning organization, with optional status filter.
   */
  async findAllByOrganization(
    organizationId: string,
    params: { status?: SupplierProductStatus; page?: number; pageSize?: number } = {},
  ) {
    const { status, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.SupplierProductWhereInput = { organizationId };
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { platformProduct: true, organization: true },
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * Admin Governance Pool — list SupplierProducts ACROSS all organizations.
   *
   * This is the platform-level Admin review pool read (660.9 Admin GET /admin/supplier-products).
   * Admin governs supplier models platform-wide; ownership isolation is NOT applied here
   * (it is enforced on the Supplier-workspace / public reads instead).
   */
  async findAllAdmin(
    params: { status?: SupplierProductStatus; page?: number; pageSize?: number } = {},
  ) {
    const { status, page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.SupplierProductWhereInput = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { platformProduct: true, organization: true },
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * Admin Governance Pool — fetch a single SupplierProduct by id ACROSS organizations.
   * Includes Platform Capability binding, owning organization, media and parameter values.
   */
  async findOneAdmin(id: string) {
    const supplierProduct = await this.prisma.supplierProduct.findUnique({
      where: { id },
      include: {
        organization: true,
        platformProduct: true,
        media: true,
        parameterValues: { include: { parameterDefinition: true } },
      },
    });
    if (!supplierProduct) {
      throw new NotFoundException(`SupplierProduct ${id} not found`);
    }
    return supplierProduct;
  }

  /**
   * Validate that the SupplierProduct belongs to the given organization
   * AND binds to the correct platform capability. Throws if inconsistent.
   */
  async validateForOrganization(id: string, organizationId: string) {
    const supplierProduct = await this.prisma.supplierProduct.findFirst({
      where: { id, organizationId },
      select: { id: true, organizationId: true, platformProductId: true, status: true },
    });
    if (!supplierProduct) {
      throw new NotFoundException(
        `SupplierProduct ${id} does not belong to organization ${organizationId}`,
      );
    }
    await this.ensurePlatformProductExists(supplierProduct.platformProductId);
    return supplierProduct;
  }

  /**
   * Governance state machine for SupplierProduct lifecycle.
   *   DRAFT → SUBMITTED (submit) → REVIEWING (review) → APPROVED (approve) → PUBLISHED (publish)
   *                                              ↘ REJECTED (reject, requires note)
   *
   * These are Admin-governance transitions (660.9). No Role.SUPPLIER self-service here.
   */

  async submit(id: string, operatorId: string) {
    return this.transition(
      id,
      SupplierProductStatus.DRAFT,
      SupplierProductStatus.SUBMITTED,
      { submittedAt: new Date() },
    );
  }

  async beginReview(id: string, operatorId: string) {
    return this.transition(
      id,
      SupplierProductStatus.SUBMITTED,
      SupplierProductStatus.REVIEWING,
      { reviewedAt: new Date(), reviewedBy: operatorId },
    );
  }

  async approve(id: string, operatorId: string) {
    return this.transition(
      id,
      SupplierProductStatus.REVIEWING,
      SupplierProductStatus.APPROVED,
      { reviewedAt: new Date(), reviewedBy: operatorId },
    );
  }

  async reject(id: string, operatorId: string, reviewedNote: string) {
    if (!reviewedNote?.trim()) {
      throw new BadRequestException('reviewedNote is required to reject a supplier product');
    }
    return this.transition(
      id,
      SupplierProductStatus.REVIEWING,
      SupplierProductStatus.REJECTED,
      { reviewedAt: new Date(), reviewedBy: operatorId, reviewedNote },
    );
  }

  async publish(id: string, operatorId: string) {
    return this.transition(
      id,
      SupplierProductStatus.APPROVED,
      SupplierProductStatus.PUBLISHED,
      { publishedAt: new Date() },
    );
  }

  /**
   * Apply a single-step lifecycle transition with guard on the source state.
   */
  private async transition(
    id: string,
    from: SupplierProductStatus,
    to: SupplierProductStatus,
    extra: Prisma.SupplierProductUncheckedUpdateInput,
  ) {
    const current = await this.prisma.supplierProduct.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!current) {
      throw new NotFoundException(`SupplierProduct ${id} not found`);
    }
    if (current.status !== from) {
      throw new BadRequestException(
        `Cannot transition SupplierProduct ${id} from "${current.status}" to "${to}"; expected "${from}"`,
      );
    }
    return this.prisma.supplierProduct.update({
      where: { id },
      data: { status: to, ...extra },
    });
  }

  /**
   * Validate capability binding of a platform product id.
   * Guarantees the SupplierProduct is always anchored on a real Platform Capability Node.
   */
  private async ensurePlatformProductExists(platformProductId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: platformProductId },
      select: { id: true },
    });
    if (!product) {
      throw new BadRequestException(
        `Platform Product ${platformProductId} does not exist; capability binding rejected`,
      );
    }
  }
}