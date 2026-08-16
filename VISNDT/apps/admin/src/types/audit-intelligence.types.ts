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