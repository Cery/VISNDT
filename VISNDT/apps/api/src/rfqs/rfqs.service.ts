import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { RFQStatus, Prisma, NotificationType, WorkflowAction, WorkflowEntityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { SearchParamsDto } from '../common/dto/search-params.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';

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
    private readonly workflowEventsService: WorkflowEventsService,
  ) {}

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
        include: { demand: true, createdByUser: true },
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
        include: { demand: true, createdByUser: true },
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

  async findOne(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: { demand: true, createdByUser: true },
    });
    if (!rfq) throw new NotFoundException(`RFQ ${id} not found`);
    return rfq;
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

    // Ownership validation: user must be the creator or belong to the same org
    const isCreator = rfq.createdBy === user.id;
    const isSameOrg = user.organizationId && rfq.demand?.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to update this RFQ',
      );
    }

    if (dto.status) {
      const allowed = RFQ_TRANSITIONS[rfq.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Cannot transition RFQ from ${rfq.status} to ${dto.status}`,
        );
      }
    }

    const updated = await this.prisma.rFQ.update({ where: { id }, data: dto });

    // E2: RFQ Status Changed — notify the RFQ creator
    if (dto.status) {
      try {
        await this.notificationsService.create({
          userId: rfq.createdBy,
          type: NotificationType.RFQ_UPDATE,
          title: 'RFQ Status Updated',
          message: `RFQ status changed to "${dto.status}"`,
          referenceType: 'RFQ',
          referenceId: rfq.id,
        });
      } catch {
        // Notification failure should not affect the main flow
      }
    }

    return updated;
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

  async batchStatus(ids: string[], status: string) {
    return this.prisma.rFQ.updateMany({
      where: { id: { in: ids } },
      data: { status: status as RFQStatus },
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

    // Permission: must be creator or same org
    const isCreator = rfq.createdBy === user.id;
    const isSameOrg =
      user.organizationId &&
      rfq.demand?.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to publish this RFQ',
      );
    }

    // State validation: only DRAFT → OPEN
    if (rfq.status !== RFQStatus.DRAFT) {
      throw new BadRequestException(
        `Cannot publish RFQ with status "${rfq.status}". Only DRAFT RFQs can be published.`,
      );
    }

    const updated = await this.prisma.rFQ.update({
      where: { id },
      data: {
        status: RFQStatus.OPEN,
        publishedAt: new Date(),
      },
    });

    // Create WorkflowEvent
    try {
      await this.workflowEventsService.create(
        {
          entityType: WorkflowEntityType.RFQ,
          entityId: rfq.id,
          action: WorkflowAction.OPENED,
          metadata: { previousStatus: rfq.status, newStatus: RFQStatus.OPEN },
        },
        user,
      );
    } catch {
      // Workflow event failure should not affect the main flow
    }

    return updated;
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

    // Permission: must be creator or same org
    const isCreator = rfq.createdBy === user.id;
    const isSameOrg =
      user.organizationId &&
      rfq.demand?.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to close this RFQ',
      );
    }

    // State validation: only OPEN → CLOSED
    if (rfq.status !== RFQStatus.OPEN) {
      throw new BadRequestException(
        `Cannot close RFQ with status "${rfq.status}". Only OPEN RFQs can be closed.`,
      );
    }

    const updated = await this.prisma.rFQ.update({
      where: { id },
      data: {
        status: RFQStatus.CLOSED,
        closedAt: new Date(),
      },
    });

    // Create WorkflowEvent
    try {
      await this.workflowEventsService.create(
        {
          entityType: WorkflowEntityType.RFQ,
          entityId: rfq.id,
          action: WorkflowAction.CLOSED,
          metadata: { previousStatus: rfq.status, newStatus: RFQStatus.CLOSED },
        },
        user,
      );
    } catch {
      // Workflow event failure should not affect the main flow
    }

    return updated;
  }
}