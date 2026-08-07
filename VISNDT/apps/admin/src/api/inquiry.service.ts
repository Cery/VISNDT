import { apiClient } from './client';
import type { Inquiry, InquiryListResponse, InquiryStatus } from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const inquiryService = {
  async getList(
    page = 1,
    pageSize = 20,
    keyword?: string,
    status?: string,
  ): Promise<InquiryListResponse> {
    const params: Record<string, string | number> = { page, pageSize };
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    const response = (await apiClient.get('/admin/inquiries', {
      params,
    })) as unknown as ApiResponseWrapper<InquiryListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Inquiry> {
    const response = (await apiClient.get(
      `/admin/inquiries/${id}`,
    )) as unknown as ApiResponseWrapper<Inquiry>;

    return response.data;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    const response = (await apiClient.patch(
      `/admin/inquiries/${id}/status`,
      { status },
    )) as unknown as ApiResponseWrapper<Inquiry>;

    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/admin/inquiries/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/admin/inquiries/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const response = (await apiClient.patch('/admin/inquiries/batch/status', { ids, status })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};