import { apiClient } from './client';
import type { MonitoringOverview } from '../types/monitoring.types';

interface MonitoringOverviewResponse {
  success: boolean;
  data: MonitoringOverview;
  message: string;
  timestamp: string;
}

export const monitoringService = {
  async getOverview(): Promise<MonitoringOverview> {
    const response = (await apiClient.get(
      '/admin/monitoring/overview',
    )) as unknown as MonitoringOverviewResponse;
    return response.data;
  },
};