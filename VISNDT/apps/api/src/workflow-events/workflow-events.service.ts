import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async create(dto: CreateWorkflowEventDto, user: WorkflowEventUser) {
    // Verify user is authenticated and has an organization
    if (!user.organizationId) {
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