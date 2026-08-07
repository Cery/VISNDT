import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message?: string | null;
  isRead: boolean;
  referenceId?: string | null;
  referenceType?: string | null;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * Get unread notification count.
 * GET /notifications/unread-count (JWT)
 */
export async function getUnreadCount(): Promise<number> {
  const res = await apiClient<ApiResponse<UnreadCountResponse>>(
    '/notifications/unread-count',
  );
  return res.data.count;
}

/**
 * List notifications (paginated).
 * GET /notifications (JWT)
 */
export async function getNotifications(
  page = 1,
  pageSize = 20,
): Promise<{ data: NotificationItem[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const res = await apiClient<
    ApiResponse<{
      data: NotificationItem[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    }>
  >('/notifications', { params: { page, pageSize } });
  return res.data;
}

/**
 * Mark notification as read.
 * PATCH /notifications/:id/read (JWT)
 */
export async function markAsRead(id: string): Promise<void> {
  await apiClient(`/notifications/${id}/read`, { method: 'PATCH' });
}

/**
 * Mark all notifications as read.
 * PATCH /notifications/read-all (JWT)
 */
export async function markAllAsRead(): Promise<void> {
  await apiClient('/notifications/read-all', { method: 'PATCH' });
}