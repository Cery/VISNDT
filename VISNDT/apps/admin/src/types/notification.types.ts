export type NotificationType = 'SYSTEM' | 'DEMAND_UPDATE' | 'RFQ_UPDATE' | 'RESPONSE_UPDATE';

export type NotificationStatus = 'UNREAD' | 'READ';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: NotificationStatus;
  type?: NotificationType;
}

export interface UnreadCountResponse {
  count: number;
}