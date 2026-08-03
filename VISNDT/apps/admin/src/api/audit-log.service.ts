import { apiClient } from './client';
import type { AuditLog, AuditLogListResponse, AuditLogQueryParams } from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const auditLogService = {
  async getList(params: AuditLogQueryParams = {}): Promise<AuditLogListResponse> {
    const response = (await apiClient.get('/admin/audit-logs', {
      params,
    })) as unknown as ApiResponseWrapper<AuditLogListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<AuditLog> {
    const response = (await apiClient.get(
      `/admin/audit-logs/${id}`,
    )) as unknown as ApiResponseWrapper<AuditLog>;

    return response.data;
  },
};