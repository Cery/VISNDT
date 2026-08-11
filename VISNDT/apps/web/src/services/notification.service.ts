import {
  getNotifications as getNotificationsApi,
  getUnreadCount as getUnreadCountApi,
  markAllAsRead as markAllAsReadApi,
  markAsRead as markAsReadApi,
} from '@/lib/api/notifications';
export type { NotificationItem } from '@/lib/api/notifications';

export async function getNotifications(page = 1, pageSize = 20) {
  return getNotificationsApi(page, pageSize);
}

export async function getUnreadCount() {
  return getUnreadCountApi();
}

export async function markAsRead(id: string) {
  return markAsReadApi(id);
}

export async function markAllAsRead() {
  return markAllAsReadApi();
}
