export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'LOGIN';

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  operatorId: string;
  oldValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
  createdAt: string;

  operator?: {
    id: string;
    email: string;
    name?: string | null;
  };
}

export interface AuditLogListResponse {
  data: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AuditLogQueryParams {
  page?: number;
  pageSize?: number;
  entityType?: string;
  action?: string;
  operatorId?: string;
}