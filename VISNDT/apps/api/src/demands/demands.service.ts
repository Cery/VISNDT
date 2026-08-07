import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DemandStatus, DemandMatchStatus, WorkflowEntityType, WorkflowAction, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';
import { CreateDemandParameterDto } from './dto/create-demand-parameter.dto';
import { UpdateDemandParameterDto } from './dto/update-demand-parameter.dto';
import { SearchDemandDto } from './dto/search-demand.dto';
import { QueryMatchDto } from './dto/query-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { WorkflowEventsService } from '../workflow-events/workflow-events.service';
import { MatchingService } from '../matching/matching.service';
import { NotificationsService } from '../notifications/notifications.service';

const TERMINAL_STATUSES: DemandStatus[] = [DemandStatus.CLOSED, DemandStatus.CANCELLED];

const PUBLISHABLE_STATUSES: DemandStatus[] = [DemandStatus.DRAFT];
const CLOSABLE_STATUSES: DemandStatus[] = [DemandStatus.PUBLISHED, DemandStatus.PROCESSING];

// DemandMatch status transition whitelist
const MATCH_TRANSITIONS: Record<DemandMatchStatus, DemandMatchStatus[]> = {
  [DemandMatchStatus.PENDING]: [DemandMatchStatus.MATCHED],
  [DemandMatchStatus.MATCHED]: [DemandMatchStatus.REVIEWED],
  [DemandMatchStatus.REVIEWED]: [DemandMatchStatus.ACCEPTED, DemandMatchStatus.REJECTED],
  [DemandMatchStatus.ACCEPTED]: [],
  [DemandMatchStatus.REJECTED]: [],
  [DemandMatchStatus.EXPIRED]: [],
};

@Injectable()
export class DemandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly workflowEvents: WorkflowEventsService,
    private readonly matchingService: MatchingService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ==========================================
  // Ownership & Validation Helpers
  // ==========================================

  private async validateDemandOwnership(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization',
      );
    }

    const demand = await this.prisma.demand.findUnique({ where: { id } });

    if (!demand) {
      throw new NotFoundException(`Demand ${id} not found`);
    }

    const isCreator = demand.createdBy === user.id;
    const isSameOrg = demand.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to modify this demand',
      );
    }

    return demand;
  }

  private async validateParameterDefinition(paramDefId: string) {
    const def = await this.prisma.parameterDefinition.findUnique({
      where: { id: paramDefId },
    });
    if (!def) {
      throw new BadRequestException(
        `ParameterDefinition ${paramDefId} not found`,
      );
    }
    return def;
  }

  // ==========================================
  // Demand CRUD
  // ==========================================

  async findAll(query: SearchDemandDto) {
    const { page = 1, pageSize = 20, keyword, status, sort } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = {};
    const conditions: Array<Record<string, unknown>> = [];

    // Keyword search: title + description
    if (keyword) {
      conditions.push({
        OR: [
          { title: { contains: keyword } },
          { description: { contains: keyword } },
        ],
      });
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    // Sort whitelist
    const sortMap: Record<string, Record<string, string>> = {
      latest: { createdAt: 'desc' },
      updated: { updatedAt: 'desc' },
      published: { publishedAt: 'desc' },
    };
    const orderBy = sortMap[sort ?? 'latest'] ?? sortMap.latest;

    const [data, total] = await Promise.all([
      this.prisma.demand.findMany({
        where: where as any,
        skip,
        take: pageSize,
        orderBy,
        include: {
          organization: true,
          createdByUser: true,
          parameters: { include: { parameterDefinition: true } },
          matches: {
            include: { product: { include: { category: true } } },
          },
        },
      }),
      this.prisma.demand.count({ where: where as any }),
    ]);

    // Apply contact protection
    const protectedData = data.map((d) => this.protectContactInfo(d as any));

    return {
      data: protectedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findMy(
    pagination: PaginationDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to view demands',
      );
    }

    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const where = { organizationId: user.organizationId };

    const [data, total] = await Promise.all([
      this.prisma.demand.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: true,
          createdByUser: true,
          parameters: { include: { parameterDefinition: true } },
        },
      }),
      this.prisma.demand.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const demand = await this.prisma.demand.findUnique({
      where: { id },
      include: {
        organization: true,
        createdByUser: true,
        parameters: { include: { parameterDefinition: true } },
        matches: {
          include: { product: { include: { category: true } } },
        },
      },
    });
    if (!demand) throw new NotFoundException(`Demand ${id} not found`);

    return this.protectContactInfo(demand);
  }

  async create(
    dto: CreateDemandDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to create a demand',
      );
    }

    const demand = await this.prisma.demand.create({
      data: {
        title: dto.title,
        description: dto.description,
        budgetRange: dto.budgetRange,
        quantity: dto.quantity,
        quantityUnit: dto.quantityUnit,
        expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        contactVisible: dto.contactVisible ?? false,
        organizationId: user.organizationId,
        createdBy: user.id,
      },
    });

    await this.workflowEvents.create({
      entityType: WorkflowEntityType.DEMAND,
      entityId: demand.id,
      action: WorkflowAction.CREATED,
    }, user);

    return demand;
  }

  async update(
    id: string,
    dto: UpdateDemandDto,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to update a demand',
      );
    }

    const demand = await this.prisma.demand.findUnique({
      where: { id },
    });

    if (!demand) {
      throw new NotFoundException(`Demand ${id} not found`);
    }

    const isCreator = demand.createdBy === user.id;
    const isSameOrg = demand.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to update this demand',
      );
    }

    if (TERMINAL_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot update a demand with status ${demand.status}`,
      );
    }

    return this.prisma.demand.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        budgetRange: dto.budgetRange,
        quantity: dto.quantity,
        quantityUnit: dto.quantityUnit,
        expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        contactEmail: dto.contactEmail,
        contactVisible: dto.contactVisible,
      },
    });
  }

  async publish(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to publish a demand',
      );
    }

    const demand = await this.prisma.demand.findUnique({ where: { id } });

    if (!demand) {
      throw new NotFoundException(`Demand ${id} not found`);
    }

    const isCreator = demand.createdBy === user.id;
    const isSameOrg = demand.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to publish this demand',
      );
    }

    if (!PUBLISHABLE_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot publish demand with status ${demand.status}. Only ${PUBLISHABLE_STATUSES.join(', ')} can be published.`,
      );
    }

    const [updated] = await this.prisma.$transaction(async (tx) => {
      const updatedDemand = await tx.demand.update({
        where: { id },
        data: {
          status: DemandStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });

      await tx.workflowEvent.create({
        data: {
          entityType: WorkflowEntityType.DEMAND,
          entityId: id,
          action: WorkflowAction.OPENED,
          operatorId: user.id,
          metadata: {
            previousStatus: demand.status,
            newStatus: DemandStatus.PUBLISHED,
          },
        },
      });

      return [updatedDemand];
    });

    // 触发异步匹配（不阻塞 publish 返回）
    this.matchingService.match(id).catch((err) => {
      // 匹配失败不影响 publish 结果
      console.error(`Matching failed for demand ${id}:`, err);
    });

    return updated;
  }

  async close(
    id: string,
    reason: string | undefined,
    user: { id: string; organizationId?: string | null },
  ) {
    if (!user.organizationId) {
      throw new BadRequestException(
        'User must belong to an organization to close a demand',
      );
    }

    const demand = await this.prisma.demand.findUnique({ where: { id } });

    if (!demand) {
      throw new NotFoundException(`Demand ${id} not found`);
    }

    const isCreator = demand.createdBy === user.id;
    const isSameOrg = demand.organizationId === user.organizationId;
    if (!isCreator && !isSameOrg) {
      throw new BadRequestException(
        'You do not have permission to close this demand',
      );
    }

    if (!CLOSABLE_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot close demand with status ${demand.status}. Only ${CLOSABLE_STATUSES.join(', ')} can be closed.`,
      );
    }

    const [updated] = await this.prisma.$transaction(async (tx) => {
      const updatedDemand = await tx.demand.update({
        where: { id },
        data: {
          status: DemandStatus.CLOSED,
          closedAt: new Date(),
          closeReason: reason ?? null,
        },
      });

      await tx.workflowEvent.create({
        data: {
          entityType: WorkflowEntityType.DEMAND,
          entityId: id,
          action: WorkflowAction.CLOSED,
          operatorId: user.id,
          metadata: {
            previousStatus: demand.status,
            newStatus: DemandStatus.CLOSED,
            closeReason: reason ?? null,
          },
        },
      });

      return [updatedDemand];
    });

    return updated;
  }

  async rematch(
    id: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const demand = await this.validateDemandOwnership(id, user);

    // 删除旧 DemandMatch 记录
    await this.prisma.demandMatch.deleteMany({
      where: { demandId: id },
    });

    // 重新执行匹配
    const result = await this.matchingService.match(id);

    // E6: Match Completed — notify the demand creator
    try {
      await this.notificationsService.create({
        userId: demand.createdBy,
        type: NotificationType.DEMAND_UPDATE,
        title: 'Matching Completed',
        message: `${result.matched} out of ${result.totalCandidates} products matched for your demand`,
        referenceType: 'MATCH',
        referenceId: id,
      });
    } catch {
      // Notification failure should not affect the main flow
    }

    return {
      demandId: id,
      ...result,
    };
  }

  // ==========================================
  // DemandParameter CRUD
  // ==========================================

  async addParameter(
    demandId: string,
    dto: CreateDemandParameterDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const demand = await this.validateDemandOwnership(demandId, user);

    if (TERMINAL_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot add parameters to a demand with status ${demand.status}`,
      );
    }

    await this.validateParameterDefinition(dto.parameterDefinitionId);

    return this.prisma.demandParameter.create({
      data: {
        demandId,
        parameterDefinitionId: dto.parameterDefinitionId,
        value: dto.value,
        valueMin: dto.valueMin,
        valueMax: dto.valueMax,
        required: dto.required ?? true,
        priority: dto.priority ?? 0,
      },
      include: { parameterDefinition: true },
    });
  }

  async getParameters(
    demandId: string,
    user: { id: string; organizationId?: string | null },
  ) {
    await this.validateDemandOwnership(demandId, user);

    return this.prisma.demandParameter.findMany({
      where: { demandId },
      include: { parameterDefinition: true },
      orderBy: { priority: 'desc' },
    });
  }

  async updateParameter(
    demandId: string,
    paramId: string,
    dto: UpdateDemandParameterDto,
    user: { id: string; organizationId?: string | null },
  ) {
    const demand = await this.validateDemandOwnership(demandId, user);

    if (TERMINAL_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot update parameters on a demand with status ${demand.status}`,
      );
    }

    const param = await this.prisma.demandParameter.findFirst({
      where: { id: paramId, demandId },
    });

    if (!param) {
      throw new NotFoundException(
        `DemandParameter ${paramId} not found on demand ${demandId}`,
      );
    }

    return this.prisma.demandParameter.update({
      where: { id: paramId },
      data: {
        value: dto.value,
        valueMin: dto.valueMin,
        valueMax: dto.valueMax,
        required: dto.required,
        priority: dto.priority,
      },
      include: { parameterDefinition: true },
    });
  }

  async deleteParameter(
    demandId: string,
    paramId: string,
    user: { id: string; organizationId?: string | null },
  ) {
    const demand = await this.validateDemandOwnership(demandId, user);

    if (TERMINAL_STATUSES.includes(demand.status)) {
      throw new BadRequestException(
        `Cannot delete parameters from a demand with status ${demand.status}`,
      );
    }

    const param = await this.prisma.demandParameter.findFirst({
      where: { id: paramId, demandId },
    });

    if (!param) {
      throw new NotFoundException(
        `DemandParameter ${paramId} not found on demand ${demandId}`,
      );
    }

    await this.prisma.demandParameter.delete({ where: { id: paramId } });
    return { deleted: true };
  }

  // ==========================================
  // DemandMatch Queries
  // ==========================================

  async getDemandMatches(
    demandId: string,
    query: QueryMatchDto,
    user: { id: string; organizationId?: string | null },
  ) {
    // Verify demand ownership (org-scoped)
    await this.validateDemandOwnership(demandId, user);

    const { page = 1, pageSize = 20, status, sort } = query;
    const skip = (page - 1) * pageSize;

    const where: Record<string, unknown> = { demandId };
    if (status) {
      where.matchStatus = status;
    }

    // Sort whitelist
    const sortMap: Record<string, Record<string, string>> = {
      score: { matchScore: 'desc' },
      latest: { createdAt: 'desc' },
      updated: { updatedAt: 'desc' },
    };
    const orderBy = sortMap[sort ?? 'score'] ?? sortMap.score;

    const [data, total] = await Promise.all([
      this.prisma.demandMatch.findMany({
        where: where as any,
        skip,
        take: pageSize,
        orderBy,
        include: {
          product: { include: { category: true } },
          offer: true,
        },
      }),
      this.prisma.demandMatch.count({ where: where as any }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getDemandMatchDetail(
    demandId: string,
    matchId: string,
    user: { id: string; organizationId?: string | null },
  ) {
    // Verify demand ownership (org-scoped)
    await this.validateDemandOwnership(demandId, user);

    const match = await this.prisma.demandMatch.findFirst({
      where: { id: matchId, demandId },
      include: {
        product: { include: { category: true } },
        offer: true,
        demand: {
          include: {
            parameters: { include: { parameterDefinition: true } },
          },
        },
      },
    });

    if (!match) {
      throw new NotFoundException(
        `DemandMatch ${matchId} not found on demand ${demandId}`,
      );
    }

    return match;
  }

  async updateMatchStatus(
    demandId: string,
    matchId: string,
    dto: UpdateMatchStatusDto,
    user: { id: string; organizationId?: string | null },
  ) {
    // Verify demand ownership (org-scoped)
    await this.validateDemandOwnership(demandId, user);

    const match = await this.prisma.demandMatch.findFirst({
      where: { id: matchId, demandId },
    });

    if (!match) {
      throw new NotFoundException(
        `DemandMatch ${matchId} not found on demand ${demandId}`,
      );
    }

    // Validate status transition
    const allowed = MATCH_TRANSITIONS[match.matchStatus];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${match.matchStatus} to ${dto.status}. ` +
        `Allowed transitions: ${allowed.length > 0 ? allowed.join(', ') : 'none'}`,
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      matchStatus: dto.status,
    };

    // Set reviewedAt when transitioning to REVIEWED
    if (dto.status === DemandMatchStatus.REVIEWED) {
      updateData.reviewedAt = new Date();
    }

    // Map status to workflow action
    const actionMap: Partial<Record<DemandMatchStatus, WorkflowAction>> = {
      [DemandMatchStatus.MATCHED]: WorkflowAction.SUBMITTED,
      [DemandMatchStatus.REVIEWED]: WorkflowAction.RESPONDED,
      [DemandMatchStatus.ACCEPTED]: WorkflowAction.ACCEPTED,
      [DemandMatchStatus.REJECTED]: WorkflowAction.REJECTED,
    };

    const [updated] = await this.prisma.$transaction(async (tx) => {
      const updatedMatch = await tx.demandMatch.update({
        where: { id: matchId },
        data: updateData as any,
        include: {
          product: { include: { category: true } },
          offer: true,
        },
      });

      const action = actionMap[dto.status];
      if (action) {
        await tx.workflowEvent.create({
          data: {
            entityType: WorkflowEntityType.DEMAND,
            entityId: demandId,
            action,
            operatorId: user.id,
            metadata: {
              matchId,
              productId: match.productId,
              previousStatus: match.matchStatus,
              newStatus: dto.status,
              notes: dto.notes ?? null,
            },
          },
        });
      }

      return [updatedMatch];
    });

    // E7: Match Status Changed — notify the demand creator
    try {
      const demand = await this.prisma.demand.findUnique({
        where: { id: demandId },
        select: { createdBy: true, title: true },
      });
      if (demand) {
        await this.notificationsService.create({
          userId: demand.createdBy,
          type: NotificationType.DEMAND_UPDATE,
          title: 'Match Status Updated',
          message: `Match status changed to "${dto.status}" for demand "${demand.title || 'Untitled'}"`,
          referenceType: 'MATCH',
          referenceId: matchId,
        });
      }
    } catch {
      // Notification failure should not affect the main flow
    }

    return updated;
  }

  async remove(id: string) {
    const demand = await this.prisma.demand.findUnique({
      where: { id },
      include: { 
        _count: { 
          select: { matches: true, parameters: true } 
        },
        rfq: true,
      },
    });
    if (!demand) throw new NotFoundException(`Demand ${id} not found`);

    if (demand._count.matches > 0 || demand.rfq) {
      const reasons: string[] = [];
      if (demand._count.matches > 0) reasons.push(`${demand._count.matches} match(es)`);
      if (demand.rfq) reasons.push(`1 RFQ`);
      throw new BadRequestException(
        `Cannot delete demand with existing dependencies: ${reasons.join(', ')}. Remove dependencies first.`,
      );
    }

    await this.prisma.$transaction([
      this.prisma.demandParameter.deleteMany({ where: { demandId: id } }),
      this.prisma.demand.delete({ where: { id } }),
    ]);

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
    return this.prisma.demand.updateMany({
      where: { id: { in: ids } },
      data: { status: status as DemandStatus },
    });
  }

  // ==========================================
  // Contact Protection
  // ==========================================

  private protectContactInfo(demand: Record<string, unknown>) {
    if (!demand.contactVisible) {
      return {
        ...demand,
        contactPhone: demand.contactPhone ? '***' : null,
        contactEmail: demand.contactEmail ? '***' : null,
      };
    }
    return demand;
  }
}