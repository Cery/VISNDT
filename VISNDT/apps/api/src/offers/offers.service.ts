import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';
import { NotificationType, OfferStatus, WorkflowAction, WorkflowEntityType } from '@prisma/client';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly workflowEventsService: WorkflowEventsService,
  ) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.offer.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, product: true },
      }),
      this.prisma.offer.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
      include: { organization: true, product: true },
    });
    if (!offer) throw new NotFoundException(`Offer ${id} not found`);
    return offer;
  }

  async create(
    dto: CreateOfferDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to create an offer',
      );
    }

    const offer = await this.prisma.offer.create({
      data: {
        ...dto,
        organizationId: user.organizationId,
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