import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private currentUserId: string | null = null;

  /**
   * Set the current user ID for audit logging context.
   * Called from auth guard/controller.
   */
  setAuditUser(userId: string | null): void {
    this.currentUserId = userId;
  }

  getAuditUser(): string | null {
    return this.currentUserId;
  }

  async onModuleInit() {
    await this.$connect();

    // Prisma middleware for automatic audit logging
    // @ts-ignore: $use is deprecated in Prisma 5 but functional
    this.$use(async (params, next) => {
      const result = await next(params);

      // Only log mutating operations, skip audit_log itself to avoid infinite recursion
      if (this.isMutatingAction(params.action) && params.model && params.model !== 'AuditLog') {
        try {
          const entityId = this.extractEntityId(params, result);
          if (entityId && entityId !== 'unknown') {
            await this.auditLog.create({
              data: {
                entityType: params.model,
                entityId: entityId,
                action: this.mapAction(params.action),
                operatorId: this.currentUserId || '00000000-0000-0000-0000-000000000000',
                newValue: params.action === 'create' ? (params.args?.data || undefined) : undefined,
                oldValue: params.action === 'update' ? (params.args?.data || undefined) : undefined,
              },
            });
          }
        } catch {
          // Audit log failure should not break the main flow
        }
      }

      return result;
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private isMutatingAction(action: string): boolean {
    return ['create', 'update', 'delete', 'upsert'].includes(action);
  }

  private mapAction(action: string): 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' {
    if (action === 'create') return 'CREATE';
    if (action === 'delete') return 'DELETE';
    return 'UPDATE';
  }

  private extractEntityId(params: any, result: any): string | null {
    // Try from where clause
    if (params.args?.where?.id) return params.args.where.id;
    // Try from result object
    if (result?.id) return result.id;
    // Try from data
    if (params.args?.data?.id) return params.args.data.id;
    return null;
  }
}