import { apiClient } from './client';
import type { DashboardStats } from '../types/dashboard.types';

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
  timestamp: string;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = (await apiClient.get(
      '/admin/dashboard/stats',
    )) as unknown as DashboardStatsResponse;
    return response.data;
  },
};