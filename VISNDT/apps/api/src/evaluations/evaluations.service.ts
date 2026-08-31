import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  EvaluationState,
  EvaluationTargetType,
  Prisma,
  SupplierProductStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

interface RequestUser {
  id: string;
  email: string;
  name?: string | null;
  organizationId?: string | null;
  workspaceRole?: 'SUPPLIER' | 'BUYER' | null;
}

/**
 * M34.6 Evaluation Service (ADR-M34-13 Option B — Persistent Buyer Evaluation State).
 *
 * Boundary: Buyer user × (Product | SupplierProduct) evaluation snapshot.
 *  - Evaluations are User-owned and isolated between Buyers.
 *  - One current evaluation per (userId, targetType, targetId) via unique constraint.
 *  - Authority is NOT re-created here: it stays with the referenced target.
 *  - Connection reuses the existing Inquiry authority.
 */
@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve the evaluation target (Product or SupplierProduct) to guarantee it
   * genuinely exists before persisting an evaluation state. Only PUBLISHED
   * SupplierProducts may be evaluated by a Buyer; a Draft/Reviewing model must
   * never enter a Buyer evaluation snapshot.
   */
  private async resolveTarget(
    targetType: EvaluationTargetType,
    targetId: string,
  ): Promise<{ label: string; organizationId: string | null }> {
    if (targetType === EvaluationTargetType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: targetId },
        select: { id: true, name: true },
      });
      if (!product) {
        throw new NotFoundException(`Product ${targetId} not found`);
      }
      return { label: product.name, organizationId: null };
    }

    if (targetType === EvaluationTargetType.SUPPLIER_PRODUCT) {
      const supplierProduct = await this.prisma.supplierProduct.findUnique({
        where: { id: targetId },
        select: {
          id: true,
          brand: true,
          modelNumber: true,
          status: true,
          organizationId: true,
        },
      });
      if (!supplierProduct) {
        throw new NotFoundException(`SupplierProduct ${targetId} not found`);
      }
      if (supplierProduct.status !== SupplierProductStatus.PUBLISHED) {
        throw new BadRequestException(
          `SupplierProduct ${targetId} is not published (status=${supplierProduct.status}) and cannot be evaluated`,
        );
      }
      return {
        label: `${supplierProduct.brand} ${supplierProduct.modelNumber}`.trim(),
        organizationId: supplierProduct.organizationId,
      };
    }

    throw new BadRequestException(`Unsupported targetType: ${targetType}`);
  }

  /** List the BUYER's own evaluation states (paginated). */
  async getMine(user: RequestUser, page: number, pageSize: number) {
    if (!user.id) {
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const where: Prisma.BuyerEvaluationWhereInput = { userId: user.id };
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.buyerEvaluation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.buyerEvaluation.count({ where }),
    ]);

    return {
      data: data.map((e) => ({
        id: e.id,
        targetType: e.targetType,
        targetId: e.targetId,
        state: e.state,
        note: e.note,
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /** Get a single evaluation by id, enforcing Buyer ownership isolation. */
  async getById(id: string, user: RequestUser) {
    const evaluation = await this.prisma.buyerEvaluation.findUnique({
      where: { id },
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${id} not found`);
    }
    if (evaluation.userId !== user.id) {
      throw new ForbiddenException('You do not own this evaluation');
    }
    return this.toResponse(evaluation);
  }

  /** Create a persistent evaluation state, de-duplicated per (user, target). */
  async create(dto: CreateEvaluationDto, user: RequestUser) {
    if (!user.id) {
      throw new ForbiddenException('Authentication required');
    }

    const target = await this.resolveTarget(dto.targetType, dto.targetId);
    const state = dto.state ?? EvaluationState.INTERESTED;

    try {
      const created = await this.prisma.buyerEvaluation.create({
        data: {
          userId: user.id,
          targetType: dto.targetType,
          targetId: dto.targetId,
          state,
          note: dto.note,
        },
      });
      return this.toResponse(created);
    } catch (error) {
      // P2002 = unique violation on (userId, targetType, targetId).
      // Enforce one current evaluation per Buyer+Target at the DB layer.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Evaluation already exists for target ${dto.targetType}/${dto.targetId}. Use PATCH to update its state.`,
        );
      }
      throw error;
    }
  }

  /** Update state / note for an owned evaluation. */
  async update(id: string, dto: UpdateEvaluationDto, user: RequestUser) {
    const existing = await this.prisma.buyerEvaluation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Evaluation ${id} not found`);
    }
    if (existing.userId !== user.id) {
      throw new ForbiddenException('You do not own this evaluation');
    }

    const updated = await this.prisma.buyerEvaluation.update({
      where: { id },
      data: {
        ...(dto.state !== undefined ? { state: dto.state } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
      },
    });
    return this.toResponse(updated);
  }

  /** Delete an owned evaluation. */
  async remove(id: string, user: RequestUser) {
    const existing = await this.prisma.buyerEvaluation.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Evaluation ${id} not found`);
    }
    if (existing.userId !== user.id) {
      throw new ForbiddenException('You do not own this evaluation');
    }
    await this.prisma.buyerEvaluation.delete({ where: { id } });
    return { deleted: true, id };
  }

  /**
   * Connection support: given an evaluation, resolve the canonical Connection
   * context (productId / organizationId) so the Buyer can continue into the
   * existing Inquiry authority. SupplierProduct resolves to its bound
   * platform Product + owning Organization.
   */
  async connectionContext(id: string, user: RequestUser) {
    const evaluation = await this.prisma.buyerEvaluation.findUnique({
      where: { id },
    });
    if (!evaluation) {
      throw new NotFoundException(`Evaluation ${id} not found`);
    }
    if (evaluation.userId !== user.id) {
      throw new ForbiddenException('You do not own this evaluation');
    }

    if (evaluation.targetType === EvaluationTargetType.PRODUCT) {
      const product = await this.prisma.product.findUnique({
        where: { id: evaluation.targetId },
        select: {
          id: true,
          name: true,
          // Connection authority source per M34 Contract §1.5 / §16.1 / §10:
          //   Supplier = Organization(type=SUPPLIER) derived from PUBLISHED
          //   SupplierProduct → Organization (SupplierProduct.platformProductId
          //   → Product). Offer is OPTIONAL / COMMERCIAL CONTEXT / LEGACY and is
          //   NOT a core connection authority.
          supplierProducts: {
            where: { status: SupplierProductStatus.PUBLISHED },
            select: { id: true, organizationId: true },
            orderBy: { createdAt: 'asc' },
            take: 1,
          },
          offers: { select: { id: true, organizationId: true } },
        },
      });
      if (!product) {
        throw new NotFoundException(
          `Evaluated Product ${evaluation.targetId} no longer exists`,
        );
      }
      // Prefer the SUPPLIER Organization bound via a PUBLISHED SupplierProduct
      // (canonical connection authority); fall back to an Offer only if no
      // published SupplierProduct bound to this Product exists.
      const primarySupplier = product.supplierProducts[0];
      const primaryOffer = product.offers[0];
      return {
        evaluationId: evaluation.id,
        targetType: evaluation.targetType,
        productId: product.id,
        productName: product.name,
        organizationId:
          primarySupplier?.organizationId ?? primaryOffer?.organizationId ?? null,
        supplierProductId: primarySupplier?.id ?? null,
        offerId: primaryOffer?.id ?? null,
      };
    }

    // SUPPLIER_PRODUCT -> bound platform product + owning organization
    const sp = await this.prisma.supplierProduct.findUnique({
      where: { id: evaluation.targetId },
      select: {
        id: true,
        platformProductId: true,
        organizationId: true,
        brand: true,
        modelNumber: true,
      },
    });
    if (!sp) {
      throw new NotFoundException(
        `Evaluated SupplierProduct ${evaluation.targetId} no longer exists`,
      );
    }
    return {
      evaluationId: evaluation.id,
      targetType: evaluation.targetType,
      supplierProductId: sp.id,
      supplierModelLabel: `${sp.brand} ${sp.modelNumber}`.trim(),
      productId: sp.platformProductId,
      organizationId: sp.organizationId,
    };
  }

  private toResponse(evaluation: {
    id: string;
    userId: string;
    targetType: EvaluationTargetType;
    targetId: string;
    state: EvaluationState;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: evaluation.id,
      targetType: evaluation.targetType,
      targetId: evaluation.targetId,
      state: evaluation.state,
      note: evaluation.note,
      createdAt: evaluation.createdAt.toISOString(),
      updatedAt: evaluation.updatedAt.toISOString(),
    };
  }
}