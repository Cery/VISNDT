import { apiClient } from './client';
import type { DashboardStats, DashboardActivities, DashboardPending, DashboardStatus } from '../types/dashboard.types';
import type { MatchingStats } from '../types/match.types';

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  message: string;
  timestamp: string;
}

interface DashboardActivitiesResponse {
  success: boolean;
  data: DashboardActivities;
  message: string;
  timestamp: string;
}

interface DashboardPendingResponse {
  success: boolean;
  data: DashboardPending;
  message: string;
  timestamp: string;
}

interface DashboardStatusResponse {
  success: boolean;
  data: DashboardStatus;
  message: string;
  timestamp: string;
}

interface MatchingStatsResponse {
  success: boolean;
  data: MatchingStats;
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

  async getActivities(): Promise<DashboardActivities> {
    const response = (await apiClient.get(
      '/admin/dashboard/activities',
    )) as unknown as DashboardActivitiesResponse;
    return response.data;
  },

  async getPending(): Promise<DashboardPending> {
    const response = (await apiClient.get(
      '/admin/dashboard/pending',
    )) as unknown as DashboardPendingResponse;
    return response.data;
  },

  async getStatus(): Promise<DashboardStatus> {
    const response = (await apiClient.get(
      '/admin/dashboard/status',
    )) as unknown as DashboardStatusResponse;
    return response.data;
  },

  async getMatchingStats(): Promise<MatchingStats> {
    const response = (await apiClient.get(
      '/admin/matching/stats',
    )) as unknown as MatchingStatsResponse;
    return response.data;
  },
};