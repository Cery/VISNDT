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
  ): Promise<InquiryListResponse> {
    const response = (await apiClient.get('/admin/inquiries', {
      params: { page, pageSize },
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
};