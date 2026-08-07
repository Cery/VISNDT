import { apiClient } from './client';
import type {
  Notification,
  NotificationListResponse,
  NotificationQueryParams,
  UnreadCountResponse,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const notificationService = {
  async getList(params?: NotificationQueryParams): Promise<NotificationListResponse> {
    const response = (await apiClient.get('/notifications', {
      params,
    })) as unknown as ApiResponseWrapper<NotificationListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Notification> {
    const response = (await apiClient.get(
      `/notifications/${id}`,
    )) as unknown as ApiResponseWrapper<Notification>;

    return response.data;
  },

  async markRead(id: string): Promise<Notification> {
    const response = (await apiClient.patch(
      `/notifications/${id}/read`,
    )) as unknown as ApiResponseWrapper<Notification>;

    return response.data;
  },

  async markAllRead(): Promise<{ updatedCount: number }> {
    const response = (await apiClient.patch(
      '/notifications/read-all',
    )) as unknown as ApiResponseWrapper<{ updatedCount: number }>;

    return response.data;
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = (await apiClient.get(
      '/notifications/unread-count',
    )) as unknown as ApiResponseWrapper<UnreadCountResponse>;

    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/notifications/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};