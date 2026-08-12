import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import {
  RFQResponseStatus,
  NotificationType,
  RFQStatus,
  OrganizationStatus,
  UserStatus,
  Prisma,
  WorkflowAction,
  WorkflowEntityType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqResponseDto } from './dto/create-rfq-response.dto';
import { UpdateRfqResponseDto } from './dto/update-rfq-response.dto';
import { DecideRfqResponseDto } from './dto/decide-rfq-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';

const RESPONSE_TRANSITIONS: Record<RFQResponseStatus, RFQResponseStatus[]> = {
  SUBMITTED: [RFQResponseStatus.VIEWED],
  VIEWED: [RFQResponseStatus.ACCEPTED, RFQResponseStatus.REJECTED],
  ACCEPTED: [],
  REJECTED: [],
};

type ResponseActor = {
  id: string;
  organizationId?: string | null;
  workspaceRole?: 'SUPPLIER' | 'BUYER' | null;
};

type DecisionResponse = Prisma.RFQResponseGetPayload<{
  include: {
    organization: {
      select: {
        id: true;
        name: true;
      };
    };
    rfq: {
      select: {
        id: true;
        demandId: true;
        targetOrganizationId: true;
        demand: {
          select: {
            id: true;
            title: true;
            organizationId: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class RfqResponsesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly workflowEventsService: WorkflowEventsService,
  ) {}

  async findByRfq(rfqId: string, pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.rFQResponse.findMany({
        where: { rfqId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { organization: true, offer: true },
      }),
      this.prisma.rFQResponse.count({ where: { rfqId } }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const response = await this.prisma.rFQResponse.findUnique({
      where: { id },
      include: { rfq: true, organization: true, offer: true },
    });
    if (!response) throw new NotFoundException(`RFQ Response ${id} not found`);
    return response;
  }

  async findMine(organizationId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.rFQResponse.findMany({
        where: { organizationId },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          rfq: {
            include: {
              demand: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          organization: true,
          offer: true,
        },
      }),
      this.prisma.rFQResponse.count({ where: { organizationId } }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async create(
    rfqId: string,
    dto: CreateRfqResponseDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to respond to an RFQ',
      );
    }
    const organizationId = user.organizationId;

    const membership = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id,
        },
      },
      include: {
        user: {
          select: {
            status: true,
          },
        },
        organization: {
          select: {
            status: true,
          },
        },
      },
    });

    if (
      !membership ||
      membership.user.status !== UserStatus.ACTIVE ||
      membership.organization.status !== OrganizationStatus.ACTIVE
    ) {
      throw new BadRequestException(
        'Current user must be an active organization member to respond to an RFQ',
      );
    }

    const [rfq, existingResponse, offer] = await Promise.all([
      this.prisma.rFQ.findUnique({
        where: { id: rfqId },
        select: {
          id: true,
          demandId: true,
          status: true,
          publishedAt: true,
          createdBy: true,
        },
      }),
      this.prisma.rFQResponse.findUnique({
        where: {
          rfqId_organizationId: {
            rfqId,
            organizationId,
          },
        },
        select: { id: true },
      }),
      dto.offerId
        ? this.prisma.offer.findUnique({
            where: { id: dto.offerId },
            select: {
              id: true,
              organizationId: true,
            },
          })
        : Promise.resolve(null),
    ]);

    if (!rfq) {
      throw new NotFoundException(`RFQ ${rfqId} not found`);
    }

    // In the current RFQ workflow, OPEN is the published state exposed to suppliers.
    if (rfq.status !== RFQStatus.OPEN || !rfq.publishedAt) {
      throw new BadRequestException(
        'Only published RFQs can receive responses',
      );
    }

    if (existingResponse) {
      throw new ConflictException(
        'Your organization has already submitted a response to this RFQ',
      );
    }

    if (dto.offerId && !offer) {
      throw new NotFoundException(`Offer ${dto.offerId} not found`);
    }

    if (offer && offer.organizationId !== organizationId) {
      throw new BadRequestException(
        'Offer must belong to the current user organization',
      );
    }

    const response = await (async () => {
      try {
        return await this.prisma.rFQResponse.create({
          data: {
            rfqId,
            organizationId,
            offerId: dto.offerId,
            message: dto.message,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new ConflictException(
            'Your organization has already submitted a response to this RFQ',
          );
        }
        throw error;
      }
    })();

    try {
      await this.workflowEventsService.create(
        {
          entityType: WorkflowEntityType.RFQ_RESPONSE,
          entityId: response.id,
          action: WorkflowAction.CREATED,
          metadata: {
            rfqId,
            demandId: rfq.demandId,
            organizationId,
            ...(dto.offerId ? { offerId: dto.offerId } : {}),
          },
        },
        user,
      );
    } catch {
      // Workflow event failure should not affect the main flow
    }

    // E3: RFQ Response Submitted — notify the RFQ creator
    try {
      if (rfq) {
        await this.notificationsService.create({
          userId: rfq.createdBy,
          type: NotificationType.RESPONSE_UPDATE,
          title: 'New RFQ Response',
          message: `A supplier has submitted a response to your RFQ`,
          referenceType: 'RFQ_RESPONSE',
          referenceId: response.id,
        });
      }
    } catch {
      // Notification failure should not affect the main flow
    }

    return response;
  }

  async update(
    id: string,
    dto: UpdateRfqResponseDto,
    user: ResponseActor,
  ) {
    if (dto.status === RFQResponseStatus.VIEWED) {
      return this.view(id, user);
    }

    if (dto.status === RFQResponseStatus.ACCEPTED) {
      return this.accept(id, {}, user);
    }

    if (dto.status === RFQResponseStatus.REJECTED) {
      return this.reject(id, {}, user);
    }

    throw new BadRequestException(
      'RFQ response updates must use the buyer decision endpoints',
    );
  }

  async view(id: string, user: ResponseActor) {
    return this.transitionDecision(
      id,
      RFQResponseStatus.VIEWED,
      WorkflowAction.REVIEWED,
      'view',
      user,
    );
  }

  async accept(
    id: string,
    dto: DecideRfqResponseDto,
    user: ResponseActor,
  ) {
    return this.transitionDecision(
      id,
      RFQResponseStatus.ACCEPTED,
      WorkflowAction.ACCEPTED,
      'accept',
      user,
      dto,
    );
  }

  async reject(
    id: string,
    dto: DecideRfqResponseDto,
    user: ResponseActor,
  ) {
    return this.transitionDecision(
      id,
      RFQResponseStatus.REJECTED,
      WorkflowAction.REJECTED,
      'reject',
      user,
      dto,
    );
  }

  private async transitionDecision(
    id: string,
    targetStatus: RFQResponseStatus,
    workflowAction: WorkflowAction,
    actionLabel: 'view' | 'accept' | 'reject',
    user: ResponseActor,
    dto?: DecideRfqResponseDto,
  ) {
    const response = await this.getDecisionResponseOrFail(id);
    this.assertBuyerDecisionAccess(response, user, actionLabel);

    const allowed = RESPONSE_TRANSITIONS[response.status] ?? [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Cannot ${actionLabel} RFQ Response with status "${response.status}"`,
      );
    }

    const reviewedAt = new Date();
    const decisionNote = this.normalizeDecisionNote(dto?.decisionNote);
    const updated = await this.prisma.rFQResponse.update({
      where: { id },
      data: {
        status: targetStatus,
        reviewedBy: user.id,
        reviewedAt,
        ...(targetStatus === RFQResponseStatus.VIEWED
          ? {}
          : { decisionNote }),
      },
    });

    await this.createDecisionWorkflowEvent(
      response,
      workflowAction,
      response.status,
      user,
      decisionNote,
    );

    if (
      targetStatus === RFQResponseStatus.ACCEPTED ||
      targetStatus === RFQResponseStatus.REJECTED
    ) {
      await this.notifyDecision(response, targetStatus, decisionNote);
    }

    return updated;
  }

  private async getDecisionResponseOrFail(id: string): Promise<DecisionResponse> {
    const response = await this.prisma.rFQResponse.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        rfq: {
          select: {
            id: true,
            demandId: true,
            targetOrganizationId: true,
            demand: {
              select: {
                id: true,
                title: true,
                organizationId: true,
              },
            },
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException(`RFQ Response ${id} not found`);
    }

    return response;
  }

  private assertBuyerDecisionAccess(
    response: DecisionResponse,
    user: ResponseActor,
    actionLabel: 'view' | 'accept' | 'reject',
  ) {
    if (!user.organizationId || user.workspaceRole !== 'BUYER') {
      throw new ForbiddenException(
        'Only buyer organization members can process RFQ responses',
      );
    }

    if (response.rfq.demand.organizationId !== user.organizationId) {
      throw new ForbiddenException(
        `You do not have permission to ${actionLabel} this RFQ response`,
      );
    }
  }

  private normalizeDecisionNote(decisionNote?: string) {
    const normalized = decisionNote?.trim();
    return normalized ? normalized : null;
  }

  private async notifyDecision(
    response: DecisionResponse,
    status: RFQResponseStatus,
    decisionNote: string | null,
  ) {
    try {
      const decisionLabel = status === RFQResponseStatus.ACCEPTED ? 'accepted' : 'rejected';
      const demandTitle = response.rfq.demand.title || 'Untitled';
      const noteSuffix = decisionNote ? ` Note: ${decisionNote}` : '';

      await this.notificationsService.createForOrganization(response.organizationId, {
        type: NotificationType.RESPONSE_UPDATE,
        title: `Response ${decisionLabel.charAt(0).toUpperCase() + decisionLabel.slice(1)}`,
        message: `Your RFQ response for demand "${demandTitle}" has been ${decisionLabel}.${noteSuffix}`,
        referenceType: 'RFQ_RESPONSE',
        referenceId: response.id,
      });
    } catch {
      // Notification failure should not affect the main flow
    }
  }

  private async createDecisionWorkflowEvent(
    response: DecisionResponse,
    action: WorkflowAction,
    previousStatus: RFQResponseStatus,
    user: ResponseActor,
    decisionNote?: string | null,
  ) {
    try {
      await this.workflowEventsService.create(
        {
          entityType: WorkflowEntityType.RFQ_RESPONSE,
          entityId: response.id,
          action,
          metadata: {
            previousStatus,
            rfqId: response.rfq.id,
            demandId: response.rfq.demandId,
            buyerOrganizationId: response.rfq.demand.organizationId,
            supplierOrganizationId: response.organizationId,
            ...(response.rfq.targetOrganizationId
              ? { targetOrganizationId: response.rfq.targetOrganizationId }
              : {}),
            ...(decisionNote ? { decisionNote } : {}),
          },
        },
        user,
      );
    } catch {
      // Workflow event failure should not affect the main flow
    }
  }
}
