import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQStatus, Prisma, NotificationType, WorkflowAction, WorkflowEntityType, DemandMatchStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { CreateRfqFromMatchDto } from './dto/create-rfq-from-match.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { PUBLIC_USER_SELECT } from '../common/projection/user.projection';
import { NotificationsService } from '../notifications/notifications.service';

const RFQ_TRANSITIONS: Record<RFQStatus, RFQStatus[]> = {
  DRAFT: [RFQStatus.OPEN],
  OPEN: [RFQStatus.RESPONDING, RFQStatus.CLOSED, RFQStatus.CANCELLED],
  RESPONDING: [RFQStatus.CLOSED, RFQStatus.CANCELLED],
  CLOSED: [],
  CANCELLED: [],
};

@Injectable()
export class RfqsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private assertRfqOwnership(
    rfq: {
      id: string;
      createdBy: string;
      demand?: { organizationId: string | null } | null;
    },
    user: { id: string; organizationId?: string | null },
  ) {
    const isCreator = rfq.createdBy === user.id;
    const isSameOrg =
      Boolean(user.organizationId) &&
      rfq.demand?.organizationId === user.organizationId;

    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to update this RFQ',
      );
    }
  }

  private getWorkflowActionForRfqStatus(status: RFQStatus) {
    const actionMap: Partial<Record<RFQStatus, WorkflowAction>> = {
      [RFQStatus.OPEN]: WorkflowAction.OPENED,
      [RFQStatus.RESPONDING]: WorkflowAction.RESPONDED,
      [RFQStatus.CLOSED]: WorkflowAction.CLOSED,
      [RFQStatus.CANCELLED]: WorkflowAction.WITHDRAWN,
    };

    const action = actionMap[status];
    if (!action) {
      throw new BadRequestException(
        `RFQ status ${status} is not supported by the lifecycle boundary`,
      );
    }

    return action;
  }

  private buildRfqStatusUpdateData(status: RFQStatus) {
    if (status === RFQStatus.OPEN) {
      return {
        status,
        publishedAt: new Date(),
        closedAt: null,
      };
    }

    if (status === RFQStatus.CLOSED) {
      return {
        status,
        closedAt: new Date(),
      };
    }

    return { status };
  }

  private async createRfqWorkflowEvent(
    event: {
      entityId: string;
      action: WorkflowAction;
      operatorId: string;
      metadata?: Record<string, unknown>;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    await client.workflowEvent.create({
      data: {
        entityType: WorkflowEntityType.RFQ,
        entityId: event.entityId,
        action: event.action,
        operatorId: event.operatorId,
        metadata: event.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  private async transitionRfqStatus(
    rfq: {
      id: string;
      status: RFQStatus;
      createdBy: string;
      demandId?: string;
      sourceMatchId?: string | null;
      targetOrganizationId?: string | null;
    },
    targetStatus: RFQStatus,
    operatorId: string,
    options?: {
      notifyCreator?: boolean;
      tx?: Prisma.TransactionClient;
    },
  ) {
    const allowed = RFQ_TRANSITIONS[rfq.status];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Cannot transition RFQ from ${rfq.status} to ${targetStatus}`,
      );
    }

    const client = options?.tx ?? this.prisma;
    const updated = await client.rFQ.update({
      where: { id: rfq.id },
      data: this.buildRfqStatusUpdateData(targetStatus),
    });

    await this.createRfqWorkflowEvent(
      {
        entityId: rfq.id,
        action: this.getWorkflowActionForRfqStatus(targetStatus),
        operatorId,
        metadata: {
          previousStatus: rfq.status,
          newStatus: targetStatus,
          ...(rfq.demandId ? { demandId: rfq.demandId } : {}),
          ...(rfq.sourceMatchId ? { sourceMatchId: rfq.sourceMatchId } : {}),
          ...(rfq.targetOrganizationId
            ? { targetOrganizationId: rfq.targetOrganizationId }
            : {}),
        },
      },
      options?.tx,
    );

    if (options?.notifyCreator) {
      try {
        await this.notificationsService.create({
          userId: rfq.createdBy,
          type: NotificationType.RFQ_UPDATE,
          title: 'RFQ Status Updated',
          message: `RFQ status changed to "${targetStatus}"`,
          referenceType: 'RFQ',
          referenceId: rfq.id,
        });
      } catch {
        // Notification failure should not affect the main flow
      }
    }

    return updated;
  }

  async findAll(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.RFQWhereInput = {};
    if (keyword) {
      where.demand = {
        title: { contains: keyword },
      };
    }
    if (status) {
      where.status = status as RFQStatus;
    }

    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { demand: true, createdByUser: { select: PUBLIC_USER_SELECT } },
      }),
      this.prisma.rFQ.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findMine(organizationId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where: {
          demand: {
            organizationId,
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { demand: true, createdByUser: { select: PUBLIC_USER_SELECT } },
      }),
      this.prisma.rFQ.count({
        where: {
          demand: {
            organizationId,
          },
        },
      }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findAvailable(params: SearchParamsDto) {
    const { page = 1, pageSize = 20, keyword, status } = params;
    const skip = (page - 1) * pageSize;

    const where: Prisma.RFQWhereInput = {
      status: {
        in: status
          ? ([status] as RFQStatus[])
          : [RFQStatus.OPEN, RFQStatus.RESPONDING],
      },
    };
    if (keyword) {
      where.demand = {
        title: { contains: keyword },
      };
    } else if (!where.demand) {
      where.demand = {};
    }

    const [data, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          demand: {
            select: {
              id: true,
              title: true,
              description: true,
              organizationId: true,
            },
          },
        },
      }),
      this.prisma.rFQ.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(
    id: string,
    user?: {
      id: string;
      organizationId?: string | null;
      organizationMember?: { role?: string } | null;
    },
  ) {
    const baseInclude = {
      createdByUser: { select: PUBLIC_USER_SELECT },
      demand: {
        include: {
          organization: true,
          parameters: {
            include: { parameterDefinition: { include: { options: true } } },
          },
        },
      },
    };

    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: baseInclude,
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);

    // 可见性裁剪：仅 buyer 组织 / 目标供应商组织 / 创建者 / 管理员
    // 可见补充交易上下文（sourceMatch / targetOrganization / responses）。
    // 其它请求者仅返回基础需求信息，保持既有报价能力且不扩大权限。
    const canViewFull =
      Boolean(user) &&
      (user!.id === rfq.createdBy ||
        (Boolean(user!.organizationId) &&
          user!.organizationId === rfq.demand?.organizationId) ||
        (Boolean(user!.organizationId) &&
          user!.organizationId === rfq.targetOrganizationId &&
          rfq.targetOrganizationId != null) ||
        user!.organizationMember?.role === 'ADMIN');

    if (!canViewFull) {
      return rfq;
    }

    return this.prisma.rFQ.findUnique({
      where: { id },
      include: {
        ...baseInclude,
        sourceMatch: {
          include: { product: true, offer: true },
        },
        targetOrganization: true,
        responses: {
          include: {
            organization: true,
            offer: {
              include: { supplierProduct: { include: { platformProduct: true } } },
            },
          },
        },
      },
    });
  }

  async create(
    dto: CreateRfqDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const rfq = await this.prisma.rFQ.create({
      data: {
        demandId: dto.demandId,
        createdBy: user.id,
      },
    });

    try {
      await this.createRfqWorkflowEvent({
        entityId: rfq.id,
        action: WorkflowAction.CREATED,
        operatorId: user.id,
        metadata: {
          demandId: dto.demandId,
        },
      });
    } catch {
      // Workflow event failure should not affect the main flow
    }

    // E1: RFQ Created — notify the demand creator
    try {
      const demand = await this.prisma.demand.findUnique({
        where: { id: dto.demandId },
        select: { createdBy: true, title: true },
      });
      if (demand) {
        await this.notificationsService.create({
          userId: demand.createdBy,
          type: NotificationType.RFQ_UPDATE,
          title: 'New RFQ Created',
          message: `RFQ for demand "${demand.title || 'Untitled'}" has been created`,
          referenceType: 'RFQ',
          referenceId: rfq.id,
        });
      }
    } catch {
      // Notification failure should not affect the main flow
    }

    return rfq;
  }

  async createFromMatch(
    dto: CreateRfqFromMatchDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to a buyer organization to create RFQ from match',
      );
    }

    const match = await this.prisma.demandMatch.findUnique({
      where: { id: dto.matchId },
      select: {
        id: true,
        demandId: true,
        matchStatus: true,
        demand: {
          select: {
            organizationId: true,
            title: true,
          },
        },
        offer: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(`DemandMatch ${dto.matchId} not found`);
    }

    if (match.demand.organizationId !== user.organizationId) {
      throw new BadRequestException(
        'You do not have permission to create RFQ from this match',
      );
    }

    if (match.matchStatus !== DemandMatchStatus.ACCEPTED) {
      throw new BadRequestException(
        `Cannot create RFQ from match with status "${match.matchStatus}". Only ACCEPTED matches are allowed.`,
      );
    }

    const targetOrganizationId = match.offer?.organizationId;
    if (!targetOrganizationId) {
      throw new BadRequestException(
        'Accepted match does not resolve to a target supplier organization',
      );
    }

    const existingRfq = await this.prisma.rFQ.findFirst({
      where: { sourceMatchId: match.id },
      select: { id: true },
    });
    if (existingRfq) {
      throw new BadRequestException(
        `RFQ ${existingRfq.id} already exists for match ${match.id}`,
      );
    }

    const rfq = await this.prisma.rFQ.create({
      data: {
        demandId: match.demandId,
        sourceMatchId: match.id,
        targetOrganizationId,
        createdBy: user.id,
      },
    });

    try {
      await this.notificationsService.createForOrganization(targetOrganizationId, {
        type: NotificationType.RFQ_UPDATE,
        title: 'New RFQ Assigned',
        message: `A new RFQ for demand "${match.demand.title || 'Untitled'}" has been assigned to your organization`,
        referenceType: 'RFQ',
        referenceId: rfq.id,
      });
    } catch {
      // Notification failure should not affect the main flow
    }

    try {
      await this.createRfqWorkflowEvent({
        entityId: rfq.id,
        action: WorkflowAction.CREATED,
        operatorId: user.id,
        metadata: {
          demandId: match.demandId,
          sourceMatchId: match.id,
          targetOrganizationId,
        },
      });
    } catch {
      // Workflow event failure should not affect the main flow
    }

    return rfq;
  }

  async update(
    id: string,
    dto: UpdateRfqDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: { select: { organizationId: true } } },
    });

    if (!rfq) {
      throw new NotFoundException(`RFQ ${id} not found`);
    }

    this.assertRfqOwnership(rfq, user);

    if (!dto.status || dto.status === rfq.status) {
      return rfq;
    }

    return this.transitionRfqStatus(
      {
        id: rfq.id,
        status: rfq.status,
        createdBy: rfq.createdBy,
        demandId: rfq.demandId,
        sourceMatchId: rfq.sourceMatchId,
        targetOrganizationId: rfq.targetOrganizationId,
      },
      dto.status,
      user.id,
      { notifyCreator: true },
    );
  }

  async remove(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { responses: true } 
        } 
      },
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);

    if (rfq._count.responses > 0) {
      throw new BadRequestException(
        `Cannot delete RFQ with ${rfq._count.responses} response(s). Remove responses first.`,
      );
    }

    await this.prisma.rFQ.delete({ where: { id } });
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

  async batchStatus(
    ids: string[],
    status: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const targetStatus = status as RFQStatus;
    const rfqs = await this.prisma.rFQ.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        status: true,
        createdBy: true,
        demandId: true,
        sourceMatchId: true,
        targetOrganizationId: true,
      },
    });

    if (rfqs.length !== ids.length) {
      const existingIds = new Set(rfqs.map((rfq) => rfq.id));
      const missingIds = ids.filter((id) => !existingIds.has(id));
      throw new NotFoundException(`RFQs not found: ${missingIds.join(', ')}`);
    }

    return this.prisma.$transaction(async (tx) => {
      for (const rfq of rfqs) {
        if (rfq.status === targetStatus) {
          continue;
        }

        await this.transitionRfqStatus(
          rfq,
          targetStatus,
          user.id,
          { tx },
        );
      }

      return { count: ids.length };
    });
  }

  /**
   * Publish an RFQ: transition from DRAFT → OPEN.
   * Only the creator or a user in the same organization can publish.
   */
  async publish(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: { select: { organizationId: true } } },
    });

    if (!rfq) {
      throw new NotFoundException(`RFQ ${id} not found`);
    }

    this.assertRfqOwnership(rfq, user);

    if (rfq.status !== RFQStatus.DRAFT) {
      throw new BadRequestException(
        `Cannot publish RFQ with status "${rfq.status}". Only DRAFT RFQs can be published.`,
      );
    }

    return this.transitionRfqStatus(
      {
        id: rfq.id,
        status: rfq.status,
        createdBy: rfq.createdBy,
        demandId: rfq.demandId,
        sourceMatchId: rfq.sourceMatchId,
        targetOrganizationId: rfq.targetOrganizationId,
      },
      RFQStatus.OPEN,
      user.id,
    );
  }

  /**
   * Close an RFQ: transition from OPEN → CLOSED.
   * Only the creator or a user in the same organization can close.
   */
  async close(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: { select: { organizationId: true } } },
    });

    if (!rfq) {
      throw new NotFoundException(`RFQ ${id} not found`);
    }

    this.assertRfqOwnership(rfq, user);

    if (rfq.status !== RFQStatus.OPEN && rfq.status !== RFQStatus.RESPONDING) {
      throw new BadRequestException(
        `Cannot close RFQ with status "${rfq.status}". Only OPEN or RESPONDING RFQs can be closed.`,
      );
    }

    return this.transitionRfqStatus(
      {
        id: rfq.id,
        status: rfq.status,
        createdBy: rfq.createdBy,
        demandId: rfq.demandId,
        sourceMatchId: rfq.sourceMatchId,
        targetOrganizationId: rfq.targetOrganizationId,
      },
      RFQStatus.CLOSED,
      user.id,
    );
  }
}
