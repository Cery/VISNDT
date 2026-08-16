import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ============================================
// Audit Intelligence Types (contract only)
// ============================================

export type RiskLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface AuditOverview {
  totalEvents: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  statusChangeCount: number;
  loginCount: number;
}

export interface AuditTrendItem {
  date: string;
  total: number;
  create: number;
  update: number;
  delete: number;
  statusChange: number;
  login: number;
}

export interface EntityDistribution {
  entityType: string;
  label: string;
  count: number;
}

export interface ActorActivity {
  operatorId: string;
  operatorName: string;
  operatorEmail: string;
  totalEvents: number;
  createCount: number;
  updateCount: number;
  deleteCount: number;
  statusChangeCount: number;
  loginCount: number;
  lastActivity: string;
}

export interface RiskIndicator {
  label: string;
  metric: string;
  value: number | string;
  level: RiskLevel;
  detail: string;
}

export interface AuditIntelligenceOverview {
  overview: AuditOverview;
  trend: AuditTrendItem[];
  entityDistribution: EntityDistribution[];
  topActors: ActorActivity[];
  riskIndicators: RiskIndicator[];
}

// ============================================
// Risk Threshold Constants (code-level only)
// ============================================

const RISK_THRESHOLDS = {
  // DELETE activity per day
  DELETE_WARNING: 10,
  DELETE_CRITICAL: 30,

  // STATUS_CHANGE activity per day
  STATUS_CHANGE_WARNING: 20,
  STATUS_CHANGE_CRITICAL: 50,

  // Actor activity per hour
  ACTOR_WARNING: 50,
  ACTOR_CRITICAL: 100,

  // Actor DELETE per day
  ACTOR_DELETE_WARNING: 5,
  ACTOR_DELETE_CRITICAL: 15,
};

function evaluateRisk(value: number, warning: number, critical: number): RiskLevel {
  if (value > critical) return 'CRITICAL';
  if (value > warning) return 'WARNING';
  return 'NORMAL';
}

// Entity type label mapping
const ENTITY_LABELS: Record<string, string> = {
  PRODUCT: '产品',
  CONTENT: '内容',
  USER: '用户',
  ORGANIZATION: '组织',
  DEMAND: '需求',
  INQUIRY: '询价',
  RFQ: 'RFQ',
  OFFER: '报价',
  DEMAND_MATCH: '匹配',
  CONTENT_TAG: '内容标签',
  PARAMETER_GROUP: '参数组',
  PARAMETER_DEFINITION: '参数定义',
  PRODUCT_CATEGORY: '产品分类',
  PRODUCT_MEDIA: '产品媒体',
  NOTIFICATION: '通知',
  WORKFLOW_EVENT: '工作流',
};

@Injectable()
export class AdminAuditIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // Unified Overview
  // ============================================

  async getOverview(days: number = 7): Promise<AuditIntelligenceOverview> {
    const [overview, trend, entityDistribution, topActors, riskIndicators] = await Promise.all([
      this.getAuditOverview(),
      this.getAuditTrend(days),
      this.getEntityDistribution(),
      this.getActorActivity(),
      this.getRiskIndicators(days),
    ]);

    return { overview, trend, entityDistribution, topActors, riskIndicators };
  }

  // ============================================
  // 1. Audit Overview
  // ============================================

  private async getAuditOverview(): Promise<AuditOverview> {
    const [total, create, update, del, statusChange, login] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.count({ where: { action: 'CREATE' } }),
      this.prisma.auditLog.count({ where: { action: 'UPDATE' } }),
      this.prisma.auditLog.count({ where: { action: 'DELETE' } }),
      this.prisma.auditLog.count({ where: { action: 'STATUS_CHANGE' } }),
      this.prisma.auditLog.count({ where: { action: 'LOGIN' } }),
    ]);

    return {
      totalEvents: total,
      createCount: create,
      updateCount: update,
      deleteCount: del,
      statusChangeCount: statusChange,
      loginCount: login,
    };
  }

  // ============================================
  // 2. Audit Trend (daily)
  // ============================================

  private async getAuditTrend(days: number): Promise<AuditTrendItem[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const logs = await this.prisma.auditLog.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, action: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const dateMap = new Map<string, AuditTrendItem>();

    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      dateMap.set(key, {
        date: key,
        total: 0,
        create: 0,
        update: 0,
        delete: 0,
        statusChange: 0,
        login: 0,
      });
    }

    for (const log of logs) {
      const key = log.createdAt.toISOString().slice(0, 10);
      const item = dateMap.get(key);
      if (item) {
        item.total++;
        switch (log.action) {
          case 'CREATE': item.create++; break;
          case 'UPDATE': item.update++; break;
          case 'DELETE': item.delete++; break;
          case 'STATUS_CHANGE': item.statusChange++; break;
          case 'LOGIN': item.login++; break;
        }
      }
    }

    return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  // ============================================
  // 3. Entity Distribution
  // ============================================

  private async getEntityDistribution(): Promise<EntityDistribution[]> {
    const results = await this.prisma.auditLog.groupBy({
      by: ['entityType'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    return results.map((r) => ({
      entityType: r.entityType,
      label: ENTITY_LABELS[r.entityType] || r.entityType,
      count: r._count.id,
    }));
  }

  // ============================================
  // 4. Actor Activity
  // ============================================

  private async getActorActivity(): Promise<ActorActivity[]> {
    const results = await this.prisma.auditLog.groupBy({
      by: ['operatorId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const actors = await Promise.all(
      results.map(async (r) => {
        const [create, update, del, statusChange, login, lastLog, user] = await Promise.all([
          this.prisma.auditLog.count({ where: { operatorId: r.operatorId, action: 'CREATE' } }),
          this.prisma.auditLog.count({ where: { operatorId: r.operatorId, action: 'UPDATE' } }),
          this.prisma.auditLog.count({ where: { operatorId: r.operatorId, action: 'DELETE' } }),
          this.prisma.auditLog.count({ where: { operatorId: r.operatorId, action: 'STATUS_CHANGE' } }),
          this.prisma.auditLog.count({ where: { operatorId: r.operatorId, action: 'LOGIN' } }),
          this.prisma.auditLog.findFirst({
            where: { operatorId: r.operatorId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
          }),
          this.prisma.user.findUnique({
            where: { id: r.operatorId },
            select: { id: true, email: true, name: true },
          }),
        ]);

        return {
          operatorId: r.operatorId,
          operatorName: user?.name || 'Unknown',
          operatorEmail: user?.email || 'Unknown',
          totalEvents: r._count.id,
          createCount: create,
          updateCount: update,
          deleteCount: del,
          statusChangeCount: statusChange,
          loginCount: login,
          lastActivity: lastLog?.createdAt?.toISOString() || '',
        };
      }),
    );

    return actors;
  }

  // ============================================
  // 5. Risk Indicators
  // ============================================

  private async getRiskIndicators(days: number): Promise<RiskIndicator[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const hours = days * 24;

    const [deleteCount24h, statusChangeCount24h, totalEvents24h, totalActors, loginCount24h] =
      await Promise.all([
        this.prisma.auditLog.count({
          where: { action: 'DELETE', createdAt: { gte: since } },
        }),
        this.prisma.auditLog.count({
          where: { action: 'STATUS_CHANGE', createdAt: { gte: since } },
        }),
        this.prisma.auditLog.count({
          where: { createdAt: { gte: since } },
        }),
        this.prisma.auditLog.groupBy({
          by: ['operatorId'],
          where: { createdAt: { gte: since } },
          _count: { id: true },
        }),
        this.prisma.auditLog.count({
          where: { action: 'LOGIN', createdAt: { gte: since } },
        }),
      ]);

    const dailyDeleteAvg = deleteCount24h / Math.max(1, days);
    const dailyStatusChangeAvg = statusChangeCount24h / Math.max(1, days);
    const hourlyEventRate = totalEvents24h / Math.max(1, hours);
    const hourlyLoginRate = loginCount24h / Math.max(1, hours);

    // Find max actor activity
    const maxActorEvents = totalActors.length > 0
      ? Math.max(...totalActors.map((a) => a._count.id))
      : 0;

    const maxActorDelete = totalActors.length > 0
      ? totalActors.reduce((max, a) => Math.max(max, a._count.id), 0)
      : 0;
    const avgActorEvents = totalActors.length > 0
      ? totalEvents24h / totalActors.length
      : 0;

    const indicators: RiskIndicator[] = [];

    // DELETE activity
    indicators.push({
      label: 'DELETE 操作',
      metric: 'delete_activity',
      value: Math.round(dailyDeleteAvg),
      level: evaluateRisk(dailyDeleteAvg, RISK_THRESHOLDS.DELETE_WARNING, RISK_THRESHOLDS.DELETE_CRITICAL),
      detail: `日均 ${Math.round(dailyDeleteAvg)} 次 DELETE（${days}天）`,
    });

    // STATUS_CHANGE activity
    indicators.push({
      label: '状态变更',
      metric: 'status_change_activity',
      value: Math.round(dailyStatusChangeAvg),
      level: evaluateRisk(dailyStatusChangeAvg, RISK_THRESHOLDS.STATUS_CHANGE_WARNING, RISK_THRESHOLDS.STATUS_CHANGE_CRITICAL),
      detail: `日均 ${Math.round(dailyStatusChangeAvg)} 次状态变更（${days}天）`,
    });

    // Event rate
    indicators.push({
      label: '事件频率',
      metric: 'event_rate',
      value: `${Math.round(hourlyEventRate)}/h`,
      level: hourlyEventRate > 100 ? 'WARNING' : hourlyEventRate > 200 ? 'CRITICAL' : 'NORMAL',
      detail: `每小时 ${Math.round(hourlyEventRate)} 个事件`,
    });

    // Login rate
    indicators.push({
      label: '登录频率',
      metric: 'login_rate',
      value: `${Math.round(hourlyLoginRate)}/h`,
      level: hourlyLoginRate > 50 ? 'WARNING' : hourlyLoginRate > 100 ? 'CRITICAL' : 'NORMAL',
      detail: `每小时 ${Math.round(hourlyLoginRate)} 次登录`,
    });

    // Max actor activity
    const maxActorHourly = maxActorEvents / Math.max(1, hours);
    indicators.push({
      label: '单用户活跃度',
      metric: 'max_actor_activity',
      value: `${Math.round(maxActorHourly)}/h`,
      level: evaluateRisk(maxActorHourly, RISK_THRESHOLDS.ACTOR_WARNING, RISK_THRESHOLDS.ACTOR_CRITICAL),
      detail: `最活跃用户 ${Math.round(maxActorHourly)} 事件/小时`,
    });

    // Actor concentration
    const concentration = totalActors.length > 0 && maxActorEvents > 0
      ? Math.round((maxActorEvents / totalEvents24h) * 100)
      : 0;
    indicators.push({
      label: '操作集中度',
      metric: 'actor_concentration',
      value: `${concentration}%`,
      level: concentration > 50 ? 'WARNING' : concentration > 80 ? 'CRITICAL' : 'NORMAL',
      detail: `最活跃用户占比 ${concentration}%`,
    });

    return indicators;
  }
}