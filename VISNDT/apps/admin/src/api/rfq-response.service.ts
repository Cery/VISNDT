import { apiClient } from './client';
import type {
  RfqResponse,
  RfqResponseListResponse,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const rfqResponseService = {
  async getByRfqId(
    rfqId: string,
    page = 1,
    pageSize = 20,
  ): Promise<RfqResponseListResponse> {
    const response = (await apiClient.get(`/rfqs/${rfqId}/responses`, {
      params: { page, pageSize },
    })) as unknown as ApiResponseWrapper<RfqResponseListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<RfqResponse> {
    const response = (await apiClient.get(
      `/rfq-responses/${id}`,
    )) as unknown as ApiResponseWrapper<RfqResponse>;

    return response.data;
  },

  async update(
    id: string,
    params: { status?: string },
  ): Promise<RfqResponse> {
    const response = (await apiClient.patch(
      `/rfq-responses/${id}`,
      params,
    )) as unknown as ApiResponseWrapper<RfqResponse>;

    return response.data;
  },
};