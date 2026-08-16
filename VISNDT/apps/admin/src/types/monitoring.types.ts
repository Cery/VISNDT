export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface MonitoringItem {
  label: string;
  metric: string;
  value: number | string;
  status: HealthStatus;
  detail?: string;
}

export interface MonitoringResult {
  health: HealthStatus;
  items: MonitoringItem[];
}

export interface MonitoringOverview {
  system: MonitoringResult;
  business: MonitoringResult;
  matching: MonitoringResult;
  embedding: MonitoringResult;
  analytics: MonitoringResult;
}