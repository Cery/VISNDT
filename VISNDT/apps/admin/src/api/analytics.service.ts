import { apiClient } from './client';
import type { DashboardResponse, StatisticsResponse, EventsListResponse } from '../types/analytics.types';

export const analyticsService = {
  async getDashboard(params?: {
    from?: string;
    to?: string;
  }): Promise<DashboardResponse> {
    return (await apiClient.get('/analytics/dashboard', { params })) as unknown as DashboardResponse;
  },

  async getStatistics(params?: {
    event?: string;
    from?: string;
    to?: string;
    groupBy?: string;
    entityType?: string;
    limit?: number;
  }): Promise<StatisticsResponse> {
    return (await apiClient.get('/analytics/statistics', { params })) as unknown as StatisticsResponse;
  },

  async getEvents(params?: {
    page?: number;
    pageSize?: number;
    event?: string;
    from?: string;
    to?: string;
  }): Promise<EventsListResponse> {
    return (await apiClient.get('/analytics/events', { params })) as unknown as EventsListResponse;
  },
};