import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogEntry {
  entityType: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'LOGIN';
  operatorId: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry) {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: entry.entityType,
          entityId: entry.entityId,
          action: entry.action as any,
          operatorId: entry.operatorId,
          oldValue: (entry.oldValue ?? undefined) as any,
          newValue: (entry.newValue ?? undefined) as any,
          ipAddress: entry.ipAddress ?? undefined,
        },
      });
    } catch {
      // Audit log failure should not break the main flow
    }
  }
}