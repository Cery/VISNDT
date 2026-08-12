import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma, WorkflowEntityType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowEventDto } from './dto/create-workflow-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

export interface WorkflowEventUser {
  id: string;
  organizationId?: string | null;
}

@Injectable()
export class WorkflowEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationDto) {
    const { page = 1, pageSize = 20 } = pagination;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.workflowEvent.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { operator: true },
      }),
      this.prisma.workflowEvent.count(),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const event = await this.prisma.workflowEvent.findUnique({
      where: { id },
      include: { operator: true },
    });
    if (!event) throw new NotFoundException(`Workflow Event ${id} not found`);
    return event;
  }

  /**
   * Approval timeline for a Content entity: business-process events ordered by
   * occurrence time. Only WorkflowEntityType.CONTENT is queried; operator is
   * joined via WorkflowEvent.operatorId → User (no separate Reviewer model).
   * Fields are projected to the safe public-of-admin set (id/action/operator/
   * metadata/createdAt). Created/updated audit fields are excluded.
   */
  async findContentTimeline(contentId: string) {
    return this.prisma.workflowEvent.findMany({
      where: {
        entityType: WorkflowEntityType.CONTENT,
        entityId: contentId,
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        action: true,
        operator: { select: { id: true, name: true } },
        metadata: true,
        createdAt: true,
      },
    });
  }

  async create(dto: CreateWorkflowEventDto, user: WorkflowEventUser) {
    // Organization requirement applies to organization-bound entities (Demand/RFQ/...).
    // CONTENT is author/user-bound (operator may have no organization), so it is exempt.
    const requiresOrganization = dto.entityType !== WorkflowEntityType.CONTENT;
    if (requiresOrganization && !user.organizationId) {
      throw new ForbiddenException('User must belong to an organization to create workflow events');
    }

    return this.prisma.workflowEvent.create({
      data: {
        entityType: dto.entityType,
        entityId: dto.entityId,
        action: dto.action,
        operatorId: user.id,
        metadata: dto.metadata as Prisma.InputJsonValue,
      },
    });
  }
}