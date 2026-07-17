import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowEventDto } from './dto/create-workflow-event.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

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

  async create(dto: CreateWorkflowEventDto) {
    return this.prisma.workflowEvent.create({
      data: {
        ...dto,
        metadata: dto.metadata as Prisma.InputJsonValue,
      },
    });
  }
}