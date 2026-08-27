import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';
import { SupplierProductsService } from '../supplier-products/supplier-products.service';
import { NotificationType, OfferStatus, WorkflowAction, WorkflowEntityType } from '@prisma/client';

/** CreateOfferDto extended with the optional Hybrid Model C commercial source. */
type CreateOfferWithSupplierInput = CreateOfferDto & { supplierProductId?: string };

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly workflowEventsService: WorkflowEventsService,
    private readonly supplierProductsService: SupplierProductsService,
  ) {}

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword, status, organizationId } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.OfferWhereInput = {};
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
      ];
    }
    if (status) {
      where.status = status as OfferStatus;
    }
    if (organizationId) {
      where.organizationId = organizationId;
    }

    // Projection extension (713/M30.5): surface the Offer ↔ SupplierProduct
    // binding so frontends can render Capability / Capability Model / Provider.
    const offerInclude: Prisma.OfferInclude = {
      organization: true,
      product: true,
      supplierProduct: {
        include: { platformProduct: true, organization: true },
      },
      createdByUser: { select: { id: true, email: true, name: true } },
    };

    const [data, total] = await Promise.all([
      this.prisma.offer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: offerInclude,
      }),
      this.prisma.offer.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(
    id: string,
    user?: { id: string; organizationId?: string | null; organizationMember?: { role: string } | null },
  ) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        organization: true,
        product: true,
        supplierProduct: {
          include: { platformProduct: true, organization: true },
        },
        createdByUser: { select: { id: true, email: true, name: true } },
      },
    });
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);

    // M31.1 role-boundary hardening: offer detail (commercial data) is only
    // readable by the owning organization or an ADMIN. Foreign orgs / guests
    // are denied with 404 (no existence leak). Public capability discovery
    // continues via the public offer list (findAll), not the detail.
    if (user) {
      const isAdmin = user.organizationMember?.role === 'ADMIN';
      const isOwner = Boolean(user.organizationId) && offer.organizationId === user.organizationId;
      if (!isAdmin && !isOwner) {
        throw new NotFoundException(`Offer ${id} not found`);
      }
    }

    return offer;
  }

  async create(
    dto: CreateOfferWithSupplierInput,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to create an offer',
      );
    }

    // Hybrid Model C — validate optional commercial source binding.
    // Rules:
    //   offer.organizationId     == supplierProduct.organizationId
    //   offer.productId          == supplierProduct.platformProductId
    await this.validateSupplierBinding(
      dto.supplierProductId,
      user.organizationId,
      dto.productId,
    );

    const offer = await this.prisma.offer.create({
      data: {
        ...dto,
        organizationId: user.organizationId,
        supplierProductId: dto.supplierProductId ?? null,
        createdBy: user.id,
      },
    });

    // E8: Offer Created — notify the organization's admin members
    try {
      await this.notificationsService.createForOrganization(
        user.organizationId,
        {
          type: NotificationType.RESPONSE_UPDATE,
          title: 'New Offer Created',
          message: `A new offer has been created in your organization`,
          referenceType: 'OFFER',
          referenceId: offer.id,
        },
      );
    } catch {
      // Notification failure should not affect the main flow
    }

    return offer;
  }

  async update(
    id: string,
    dto: UpdateOfferDto,
    user: { organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to update an offer',
      );
    }

    const offer = await this.prisma.offer.findFirst({
      where: { id, organizationId: user.organizationId },
    });

    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }

    return this.prisma.offer.update({ where: { id }, data: dto });
  }

  /**
   * Submit an offer: DRAFT → SUBMITTED.
   * Only the owning organization can submit.
   */
  async submit(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const offer = await this.getOfferOrFail(id);

    if (!user.organizationId || offer.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'Only the owning organization can submit this offer',
      );
    }

    if (offer.status !== OfferStatus.DRAFT) {
      throw new BadRequestException(
        `Cannot submit offer with status "${offer.status}". Only DRAFT offers can be submitted.`,
      );
    }

    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: OfferStatus.SUBMITTED },
    });

    await this.createWorkflowEvent(id, offer.status, WorkflowAction.SUBMITTED, user);

    return updated;
  }

  /**
   * Accept an offer: SUBMITTED → ACCEPTED.
   * Only the owning organization can accept.
   */
  async accept(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const offer = await this.getOfferOrFail(id);

    if (!user.organizationId || offer.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'Only the owning organization can accept this offer',
      );
    }

    if (offer.status !== OfferStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot accept offer with status "${offer.status}". Only SUBMITTED offers can be accepted.`,
      );
    }

    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: OfferStatus.ACCEPTED },
    });

    await this.createWorkflowEvent(id, offer.status, WorkflowAction.ACCEPTED, user);

    return updated;
  }

  /**
   * Reject an offer: SUBMITTED → REJECTED.
   * Only the owning organization can reject.
   */
  async reject(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const offer = await this.getOfferOrFail(id);

    if (!user.organizationId || offer.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'Only the owning organization can reject this offer',
      );
    }

    if (offer.status !== OfferStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot reject offer with status "${offer.status}". Only SUBMITTED offers can be rejected.`,
      );
    }

    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: OfferStatus.REJECTED },
    });

    await this.createWorkflowEvent(id, offer.status, WorkflowAction.REJECTED, user);

    return updated;
  }

  /**
   * Withdraw an offer: SUBMITTED → WITHDRAWN.
   * Only the owning organization can withdraw.
   */
  async withdraw(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const offer = await this.getOfferOrFail(id);

    if (!user.organizationId || offer.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'Only the owning organization can withdraw this offer',
      );
    }

    if (offer.status !== OfferStatus.SUBMITTED) {
      throw new BadRequestException(
        `Cannot withdraw offer with status "${offer.status}". Only SUBMITTED offers can be withdrawn.`,
      );
    }

    const updated = await this.prisma.offer.update({
      where: { id },
      data: { status: OfferStatus.WITHDRAWN },
    });

    await this.createWorkflowEvent(id, offer.status, WorkflowAction.WITHDRAWN, user);

    return updated;
  }

  async remove(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { demandMatches: true } 
        } 
      },
    });
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);

    if (offer._count.demandMatches > 0) {
      const reasons: string[] = [];
      if (offer._count.demandMatches > 0) reasons.push(`${offer._count.demandMatches} demand match(es)`);
      throw new BadRequestException(
        `Cannot delete offer with existing dependencies: ${reasons.join(', ')}. Remove dependencies first.`,
      );
    }

    await this.prisma.offer.delete({ where: { id } });
    return { id };
  }

  async batchDelete(ids: string[]) {
    const results = await Promise.allSettled(ids.map((id) => this.remove(id)));
    return results.map((r, i) => ({
      id: ids[i],
      success: r.status === 'fulfilled',
      ...(r.status === 'fulfilled' ? { data: r.value } : { error: r.reason?.message }),
    }));
  }

  async batchStatus(ids: string[], status: string) {
    return this.prisma.offer.updateMany({
      where: { id: { in: ids } },
      data: { status: status as OfferStatus },
    });
  }

  /**
   * Validate optional SupplierProduct binding for an Offer (Hybrid Model C).
   *
   * When `supplierProductId` is provided, enforces:
   *   offer.organizationId == supplierProduct.organizationId
   *   offer.productId      == supplierProduct.platformProductId
   * On mismatch the binding is rejected (BadRequest), never silently accepted.
   * When `supplierProductId` is absent (legacy / plain offer), no-op.
   */
  private async validateSupplierBinding(
    supplierProductId: string | undefined,
    offerOrganizationId: string,
    offerProductId: string,
  ): Promise<void> {
    if (!supplierProductId) return;

    const sp = await this.prisma.supplierProduct.findUnique({
      where: { id: supplierProductId },
      select: {
        organizationId: true,
        platformProductId: true,
        status: true,
      },
    });
    if (!sp) {
      throw new BadRequestException(
        `SupplierProduct ${supplierProductId} not found; cannot bind to offer`,
      );
    }

    if (sp.organizationId !== offerOrganizationId) {
      throw new BadRequestException(
        'SupplierProduct organization does not match offer organization',
      );
    }
    if (sp.platformProductId !== offerProductId) {
      throw new BadRequestException(
        'SupplierProduct platformProduct does not match offer productId (capability binding mismatch)',
      );
    }
  }

  /**
   * Fetch an offer by ID or throw NotFoundException.
   */
  private async getOfferOrFail(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      select: { id: true, organizationId: true, status: true },
    });
    if (!offer) {
      throw new NotFoundException(`Offer ${id} not found`);
    }
    return offer;
  }

  /**
   * Create a WorkflowEvent for an offer state change.
   * Failure is silently ignored to avoid breaking the main flow.
   */
  private async createWorkflowEvent(
    entityId: string,
    previousStatus: string,
    action: WorkflowAction,
    user: { id: string },
  ) {
    try {
      await this.workflowEventsService.create(
        {
          entityType: WorkflowEntityType.OFFER,
          entityId,
          action,
          metadata: { previousStatus },
        },
        user,
      );
    } catch {
      // Workflow event failure should not affect the main flow
    }
  }
}