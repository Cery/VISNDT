import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogQuery {
  page?: number;
  pageSize?: number;
  entityType?: string;
  action?: string;
  operatorId?: string;
}

@Injectable()
export class AdminAuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AuditLogQuery) {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize || 20));
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query.entityType) where.entityType = query.entityType;
    if (query.action) where.action = query.action;
    if (query.operatorId) where.operatorId = query.operatorId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          operator: {
            select: { id: true, email: true, name: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: data.map((log) => this.mapAuditLog(log)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string) {
    const log = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        operator: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    if (!log) {
      throw new NotFoundException(`AuditLog ${id} not found`);
    }

    return this.mapAuditLog(log);
  }

  private mapAuditLog(log: any) {
    return {
      id: log.id,
      entityType: log.entityType,
      entityId: log.entityId,
      action: log.action,
      operatorId: log.operatorId,
      operator: log.operator,
      oldValue: log.oldValue,
      newValue: log.newValue,
      createdAt: log.createdAt.toISOString(),
    };
  }
}