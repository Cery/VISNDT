import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  FileEntityType,
  FileType,
  OrganizationStatus,
  Prisma,
  SupplierProductStatus,
} from '@prisma/client';
import { Express } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { FileAssetService } from '../file-asset/file-asset.service';
import { StorageService } from '../storage/storage.service';

/**
 * 816 — Supplier organization type recognition.
 * Mirrors AuthService.resolveWorkspaceRole supplier detection so a SupplierProduct
 * can ONLY be assigned to an organization that is operationally a supplier.
 * No new authority added — this is a server-side ownership validation.
 */
const SUPPLIER_ORG_TYPES: ReadonlySet<string> = new Set([
  'SUPPLIER',
  'MANUFACTURER',
  'DISTRIBUTOR',
  '供应商',
  '制造商',
  '经销商',
  '生产商',
]);

function isSupplierOrganizationType(type: string | null | undefined): boolean {
  if (!type) return false;
  return SUPPLIER_ORG_TYPES.has(type.trim().toUpperCase())
    || SUPPLIER_ORG_TYPES.has(type.trim());
}

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileAssetService: FileAssetService,
    private readonly storage: StorageService,
  ) {}

  /**
   * Create a SUPPLIER_PRODUCT DRAFT entity.
   * Enforces that the platform product exists (capability binding validation).
   * 816: validates the owning organization is an existing, ACTIVE SUPPLIER org.
   * All new supplier products start in DRAFT lifecycle state.
   */
  async createDraft(input: CreateSupplierProductInput) {
    await this.ensurePlatformProductExists(input.platformProductId);
    await this.ensureSupplierOrganization(input.organizationId);

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
   * 820 — Self-Service create of an OWN SupplierProduct DRAFT.
   *
   * organizationId is injected from the authenticated supplier context (never
   * accepted from the client). Ownership, capability binding (platform product
   * exists + ACTIVE SUPPLIER org) and duplicate model number are validated here.
   * Multiple distinct real modelNumber values are allowed under the same
   * (organization, platform product) — DB uniqueness is preserved.
   */
  async createOwn(
    organizationId: string,
    dto: {
      platformProductId: string;
      brand: string;
      series?: string | null;
      modelNumber: string;
      description?: string | null;
      technicalDescription?: string | null;
      applicationInfo?: string | null;
    },
  ) {
    const dup = await this.prisma.supplierProduct.findFirst({
      where: {
        organizationId,
        platformProductId: dto.platformProductId,
        modelNumber: dto.modelNumber,
      },
      select: { id: true },
    });
    if (dup) {
      throw new BadRequestException(
        `Model number "${dto.modelNumber}" already exists for this organization on the same platform product.`,
      );
    }

    const created = await this.createDraft({ organizationId, ...dto });
    // A self-service create always carries real supplier values — never a platform placeholder.
    return { ...created, isPlaceholder: false };
  }

  /**
   * Find one SupplierProduct scoped to an owning organization.
   * Ownership isolation — global / cross-organization reads are forbidden.
   * 820: the row is enriched with an `isPlaceholder` computed flag.
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
    return { ...supplierProduct, isPlaceholder: this.isPlaceholderModel(supplierProduct) };
  }

  /**
   * List SupplierProducts for an owning organization, with optional status filter,
   * keyword filter (own-model search) and pagination.
   * 820: each row is enriched with an `isPlaceholder` computed flag so attach-derived
   * (platform seed) models are clearly identified as NOT yet real supplier models.
   */
  async findAllByOrganization(
    organizationId: string,
    params: {
      status?: SupplierProductStatus;
      page?: number;
      pageSize?: number;
      keyword?: string;
    } = {},
  ) {
    const { status, page = 1, pageSize = 20, keyword } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.SupplierProductWhereInput = { organizationId };
    if (status) {
      where.status = status;
    }
    if (keyword && keyword.trim()) {
      const kw = keyword.trim();
      where.OR = [
        { brand: { contains: kw, mode: 'insensitive' } },
        { series: { contains: kw, mode: 'insensitive' } },
        { modelNumber: { contains: kw, mode: 'insensitive' } },
        { description: { contains: kw, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.supplierProduct.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          platformProduct: true,
          organization: true,
          _count: { select: { media: true, parameterValues: true } },
        },
      }),
      this.prisma.supplierProduct.count({ where }),
    ]);

    const enriched = data.map((item) => ({
      ...item,
      isPlaceholder: this.isPlaceholderModel(item),
    }));

    return {
      data: enriched,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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

  /**
   * 821 — Publish Gate (APPROVED → PUBLISHED).
   *
   * Minimum publication truthfulness conditions:
   *   - brand & modelNumber are REAL supplier values (NOT the platform-derived
   *     placeholders seeded by an Attach)
   *   - a basic product description is present and non-empty
   *
   * Placeholder detection uses the same validation contract as the self-service
   * `isPlaceholder` flag. Advertising a platform-name/slug placeholder as a real
   * supplier model to public discovery is rejected here.
   */
  async publish(id: string, operatorId: string) {
    const row = await this.prisma.supplierProduct.findUnique({
      where: { id },
      select: {
        id: true,
        brand: true,
        modelNumber: true,
        description: true,
        platformProduct: { select: { name: true, slug: true } },
      },
    });
    if (!row) {
      throw new NotFoundException(`SupplierProduct ${id} not found`);
    }
    const pp = row.platformProduct;
    const placeholderModel = `${pp?.slug ?? 'platform'}`;
    if (pp && row.brand === pp.name && row.modelNumber === placeholderModel) {
      throw new BadRequestException(
        `Cannot publish ${id}: it still carries platform-derived placeholder brand/model number. Complete the real supplier brand and model number before publishing.`,
      );
    }
    if (!row.brand?.trim() || !row.modelNumber?.trim()) {
      throw new BadRequestException('Cannot publish: brand and model number are required.');
    }
    if (!row.description?.trim()) {
      throw new BadRequestException(
        'Cannot publish: a basic (non-empty) product description is required.',
      );
    }
    return this.transition(
      id,
      SupplierProductStatus.APPROVED,
      SupplierProductStatus.PUBLISHED,
      { publishedAt: new Date() },
    );
  }

  /**
   * 820/821 — Self-Service submit of an OWN SupplierProduct (DRAFT → SUBMITTED).
   *
   * Scopes the submit to the authenticated organization before delegating to the
   * governance transition. A supplier may only submit their own SupplierProduct.
   */
  async submitOwn(id: string, organizationId: string, operatorId: string) {
    await this.validateForOrganization(id, organizationId);
    return this.submit(id, operatorId);
  }

  /**
   * 816 — Admin edit of supplier-owned content fields.
   *
   * Editable states: DRAFT (primary) and APPROVED (non-public governance state,
   * enables the controlled unpublish → edit → republish loop). Blocker states:
   * SUBMITTED / REVIEWING (mid-review), PUBLISHED (must unpublish first),
   * REJECTED (terminal without a re-open decision — preserved).
   *
   * Ownership anchors (organizationId, platformProductId) are immutable here.
   */
  async update(id: string, dto: {
    brand?: string;
    series?: string | null;
    modelNumber?: string;
    slug?: string | null;
    description?: string | null;
    technicalDescription?: string | null;
    applicationInfo?: string | null;
  }) {
    const current = await this.prisma.supplierProduct.findUnique({
      where: { id },
    });
    if (!current) {
      throw new NotFoundException(`SupplierProduct ${id} not found`);
    }
    if (current.status !== SupplierProductStatus.DRAFT
        && current.status !== SupplierProductStatus.APPROVED) {
      throw new BadRequestException(
        `SupplierProduct ${id} is in "${current.status}"; editing is only allowed in DRAFT or APPROVED (unpublish published records first).`,
      );
    }

    const data: Prisma.SupplierProductUncheckedUpdateInput = {};

    // Only apply provided fields — never overwrite with undefined.
    if (dto.brand !== undefined) data.brand = dto.brand;
    if (dto.series !== undefined) data.series = dto.series;
    if (dto.modelNumber !== undefined) data.modelNumber = dto.modelNumber;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.technicalDescription !== undefined) data.technicalDescription = dto.technicalDescription;
    if (dto.applicationInfo !== undefined) data.applicationInfo = dto.applicationInfo;

    // Uniqueness guard when modelNumber (or slug) changes within the same
    // (organizationId, platformProductId) scope. Exclude self.
    if (dto.modelNumber !== undefined && dto.modelNumber !== current.modelNumber) {
      const dup = await this.prisma.supplierProduct.findFirst({
        where: {
          organizationId: current.organizationId,
          platformProductId: current.platformProductId,
          modelNumber: dto.modelNumber,
          id: { not: id },
        },
        select: { id: true },
      });
      if (dup) {
        throw new BadRequestException(
          `Model number "${dto.modelNumber}" already exists for this organization on the same platform product.`,
        );
      }
    }

    if (dto.slug !== undefined && dto.slug !== current.slug) {
      const dupSlug = await this.prisma.supplierProduct.findFirst({
        where: { slug: dto.slug as string, id: { not: id } },
        select: { id: true },
      });
      if (dupSlug) {
        throw new BadRequestException(`Slug "${dto.slug}" is already in use.`);
      }
    }

    return this.prisma.supplierProduct.update({ where: { id }, data });
  }

  /**
   * 820 — Self-Service edit of an OWN SupplierProduct.
   *
   * Scopes the edit to the authenticated organization (ownership isolation)
   * before delegation. Editing is allowed only in DRAFT / APPROVED states.
   */
  async updateOwn(
    id: string,
    organizationId: string,
    dto: {
      brand?: string;
      series?: string | null;
      modelNumber?: string;
      description?: string | null;
      technicalDescription?: string | null;
      applicationInfo?: string | null;
    },
  ) {
    await this.validateForOrganization(id, organizationId);
    await this.update(id, dto);
    return this.findOne(id, organizationId);
  }

  // =============================================================
  // WP-5A — SupplierProduct Media Write (R1), org-scoped self-service
  // =============================================================

  /**
   * Atomic upload + create a SupplierProductMedia for an OWN SupplierProduct.
   * Uploads the file to storage, creates the FileAsset, then binds it as a
   * SupplierProductMedia. Mirrors the ProductMedia#createWithUpload pattern but
   * scoped to the authenticated organization + editable life-cycle state.
   */
  async createMediaWithUpload(
    supplierProductId: string,
    organizationId: string,
    file: Express.Multer.File,
    dto: {
      mediaType?: FileType;
      title?: string;
      altText?: string;
      isPrimary?: boolean;
      displayOrder?: number;
    },
    userId: string,
  ) {
    await this.requireOwnEditable(supplierProductId, organizationId);

    const fileAsset = await this.fileAssetService.upload(
      file,
      userId,
      FileEntityType.PRODUCT,
      dto.mediaType ?? FileType.IMAGE,
    );

    try {
      const media = await this.prisma.supplierProductMedia.create({
        data: {
          supplierProductId,
          fileAssetId: fileAsset.id,
          mediaType: dto.mediaType ?? FileType.IMAGE,
          title: dto.title,
          altText: dto.altText,
          isPrimary: dto.isPrimary ?? false,
          displayOrder:
            dto.displayOrder ?? (await this.nextDisplayOrder(supplierProductId)),
        },
        include: { fileAsset: true },
      });

      await this.linkFileAsset(fileAsset.id, media.id);
      if (media.isPrimary) {
        await this.demoteOtherPrimary(supplierProductId, media.id);
      }
      return media;
    } catch (err) {
      try {
        await this.fileAssetService.delete(fileAsset.id);
      } catch {
        // best-effort storage rollback on create failure
      }
      throw err;
    }
  }

  /**
   * Create a SupplierProductMedia bound to an already-uploaded FileAsset.
   */
  async createMedia(
    supplierProductId: string,
    organizationId: string,
    dto: {
      fileAssetId?: string;
      mediaType?: FileType;
      title?: string;
      altText?: string;
      isPrimary?: boolean;
      displayOrder?: number;
    },
  ) {
    await this.requireOwnEditable(supplierProductId, organizationId);
    if (!dto.fileAssetId) {
      throw new BadRequestException(
        'fileAssetId is required to create media from an existing asset.',
      );
    }
    const media = await this.prisma.supplierProductMedia.create({
      data: {
        supplierProductId,
        fileAssetId: dto.fileAssetId,
        mediaType: dto.mediaType ?? FileType.IMAGE,
        title: dto.title,
        altText: dto.altText,
        isPrimary: dto.isPrimary ?? false,
        displayOrder:
          dto.displayOrder ?? (await this.nextDisplayOrder(supplierProductId)),
      },
      include: { fileAsset: true },
    });
    await this.linkFileAsset(dto.fileAssetId, media.id);
    if (media.isPrimary) {
      await this.demoteOtherPrimary(supplierProductId, media.id);
    }
    return media;
  }

  /**
   * Update metadata / ordering / primary for one media of an OWN SupplierProduct.
   */
  async updateMedia(
    supplierProductId: string,
    organizationId: string,
    mediaId: string,
    dto: { title?: string; altText?: string; isPrimary?: boolean; displayOrder?: number },
  ) {
    await this.requireOwnEditable(supplierProductId, organizationId);
    await this.findOwnMedia(supplierProductId, mediaId);

    const data: Prisma.SupplierProductMediaUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.altText !== undefined) data.altText = dto.altText;
    if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder;
    if (dto.isPrimary !== undefined) {
      data.isPrimary = dto.isPrimary;
      if (dto.isPrimary) {
        await this.demoteOtherPrimary(supplierProductId, mediaId);
      }
    }

    return this.prisma.supplierProductMedia.update({
      where: { id: mediaId },
      data,
      include: { fileAsset: true },
    });
  }

  /**
   * Delete one media of an OWN SupplierProduct (persistence + storage cleanup).
   */
  async removeMedia(
    supplierProductId: string,
    organizationId: string,
    mediaId: string,
  ) {
    await this.requireOwnEditable(supplierProductId, organizationId);
    const media = await this.findOwnMedia(supplierProductId, mediaId);
    const fileAssetId = media.fileAssetId ?? null;

    await this.prisma.supplierProductMedia.delete({ where: { id: mediaId } });
    if (fileAssetId) {
      try {
        await this.fileAssetService.delete(fileAssetId);
      } catch {
        // best-effort storage cleanup after DB consistency
      }
    }
    return { id: mediaId };
  }

  // =============================================================
  // WP-5A — SupplierProduct Parameter Write (R2), org-scoped self-service
  // =============================================================

  /**
   * Full-set replace of SupplierProduct parameter overrides.
   * Upserts every provided item (unique supplierProductId + parameterDefinitionId);
   * removes any persisted override not present in the list. Parameter Definition
   * authority stays untouched (Platform Product holds definitions).
   */
  async setParameterOverrides(
    supplierProductId: string,
    organizationId: string,
    items: { parameterDefinitionId: string; value: string; valueNumber?: number }[],
  ) {
    await this.requireOwnEditable(supplierProductId, organizationId);

    await this.prisma.$transaction(async (tx) => {
      for (const it of items) {
        await tx.supplierProductParameterValue.upsert({
          where: {
            supplierProductId_parameterDefinitionId: {
              supplierProductId,
              parameterDefinitionId: it.parameterDefinitionId,
            },
          },
          create: {
            supplierProductId,
            parameterDefinitionId: it.parameterDefinitionId,
            value: it.value,
            valueNumber: it.valueNumber ?? null,
          },
          update: {
            value: it.value,
            valueNumber: it.valueNumber ?? null,
          },
        });
      }
      const wanted = new Set(items.map((i) => i.parameterDefinitionId));
      await tx.supplierProductParameterValue.deleteMany({
        where: {
          supplierProductId,
          parameterDefinitionId: { notIn: [...wanted] },
        },
      });
    });

    return this.findOne(supplierProductId, organizationId);
  }

  // ---- WP-5A media/parameter helper guards ----

  private async requireOwnEditable(
    supplierProductId: string,
    organizationId: string,
  ) {
    const row = await this.prisma.supplierProduct.findFirst({
      where: { id: supplierProductId, organizationId },
      select: { id: true, status: true },
    });
    if (!row) {
      throw new NotFoundException(
        `SupplierProduct ${supplierProductId} not found in organization ${organizationId}`,
      );
    }
    if (
      row.status !== SupplierProductStatus.DRAFT &&
      row.status !== SupplierProductStatus.APPROVED
    ) {
      throw new BadRequestException(
        `SupplierProduct is in "${row.status}"; media/parameter editing is only allowed in DRAFT or APPROVED (unpublish published records first).`,
      );
    }
    return row;
  }

  private async findOwnMedia(
    supplierProductId: string,
    mediaId: string,
  ): Promise<{
    id: string;
    fileAssetId: string | null;
    fileAsset?: unknown;
  }> {
    const media = await this.prisma.supplierProductMedia.findFirst({
      where: { id: mediaId, supplierProductId },
      include: { fileAsset: true },
    });
    if (!media) {
      throw new NotFoundException(
        `SupplierProductMedia ${mediaId} not found for SupplierProduct ${supplierProductId}`,
      );
    }
    return media;
  }

  private async nextDisplayOrder(supplierProductId: string): Promise<number> {
    const last = await this.prisma.supplierProductMedia.findFirst({
      where: { supplierProductId },
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });
    return (last?.displayOrder ?? -1) + 1;
  }

  private async demoteOtherPrimary(
    supplierProductId: string,
    keepMediaId: string,
  ) {
    await this.prisma.supplierProductMedia.updateMany({
      where: { supplierProductId, id: { not: keepMediaId }, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  private async linkFileAsset(fileAssetId: string, mediaId: string) {
    try {
      await this.prisma.fileAsset.update({
        where: { id: fileAssetId },
        data: { entityId: mediaId },
      });
    } catch {
      // best-effort: non-fatal when the FileAsset row is unavailable
    }
  }

  /**
   * 816 — Admin withdraw a published SupplierProduct from public discovery.
   *
   * PUBLISHED → APPROVED. APPROVED is a non-public state (per frozen visibility
   * semantics), so withdrawal is expressed through the EXISTING status enum.
   * NO new UNPUBLISHED enum and NO schema migration introduced.
   * Clears publishedAt so public "published since" timing is not stale.
   */
  async unpublish(id: string, operatorId: string) {
    return this.transition(
      id,
      SupplierProductStatus.PUBLISHED,
      SupplierProductStatus.APPROVED,
      { publishedAt: null },
    );
  }

  /**
   * 816 — Admin delete a SupplierProduct.
   *
   * Respects the schema dependency protection:
   *   Offer.supplierProductId → onDelete: Restrict
   * If any Offer references this SupplierProduct, delete MUST NOT silently
   * succeed — it throws a clear dependency failure and the record is preserved.
   * Media / parameter values cascade (onDelete: Cascade).
   */
  async remove(id: string) {
    const current = await this.prisma.supplierProduct.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!current) {
      throw new NotFoundException(`SupplierProduct ${id} not found`);
    }

    const offerDependency = await this.prisma.offer.count({
      where: { supplierProductId: id },
    });
    if (offerDependency > 0) {
      throw new BadRequestException(
        `SupplierProduct ${id} is referenced by ${offerDependency} Offer(s); delete is blocked by dependency protection. Unlink the Offer references first (requires separate authorization).`,
      );
    }

    await this.prisma.supplierProduct.delete({ where: { id } });
    return { id };
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
   * 820 — Placeholder model detection.
   *
   * An Attach-created SupplierProduct (817) seeds brand from the Platform Product
   * name and modelNumber from the Platform Product slug. Such a record carries
   * platform-derived placeholders, NOT real supplier model data. This validation
   * contract clearly flags those records (isPlaceholder=true). A self-service
   * create/edit replaces them with real supplier values → isPlaceholder=false.
   */
  private isPlaceholderModel(sp: {
    brand: string;
    modelNumber: string;
    platformProduct?: { name?: string; slug?: string | null } | null;
  }): boolean {
    const pp = sp.platformProduct;
    if (!pp) return false;
    const placeholderModel = `${pp.slug ?? 'platform'}`;
    return sp.brand === pp.name && sp.modelNumber === placeholderModel;
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

  /**
   * 816 — Validate the owning organization for a SupplierProduct.
   *
   * Server-side ownership validation. Rejects:
   *   - non-existent organization
   *   - non-ACTIVE organization (INACTIVE / SUSPENDED)
   *   - non-SUPPLIER organization (BUYER / INTERNAL / other types)
   *
   * Client-supplied organizationId is never trusted without this check.
   */
  private async ensureSupplierOrganization(organizationId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, status: true, type: true },
    });
    if (!org) {
      throw new BadRequestException(
        `Organization ${organizationId} does not exist; cannot assign SupplierProduct`,
      );
    }
    if (org.status !== OrganizationStatus.ACTIVE) {
      throw new BadRequestException(
        `Organization ${organizationId} is not ACTIVE (status=${org.status}); cannot assign SupplierProduct`,
      );
    }
    if (!isSupplierOrganizationType(org.type)) {
      throw new BadRequestException(
        `Organization ${organizationId} type="${org.type}" is not a Supplier organization; SupplierProduct assignment rejected`,
      );
    }
  }
}