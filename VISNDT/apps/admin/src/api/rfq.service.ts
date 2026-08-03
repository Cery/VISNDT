import { apiClient } from './client';
import type {
  Rfq,
  RfqListResponse,
  CreateRfqParams,
  UpdateRfqParams,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const rfqService = {
  async getList(
    page = 1,
    pageSize = 20,
  ): Promise<RfqListResponse> {
    const response = (await apiClient.get('/rfqs', {
      params: { page, pageSize },
    })) as unknown as ApiResponseWrapper<RfqListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Rfq> {
    const response = (await apiClient.get(
      `/rfqs/${id}`,
    )) as unknown as ApiResponseWrapper<Rfq>;

    return response.data;
  },

  async create(params: CreateRfqParams): Promise<Rfq> {
    const response = (await apiClient.post(
      '/rfqs',
      params,
    )) as unknown as ApiResponseWrapper<Rfq>;

    return response.data;
  },

  async update(id: string, params: UpdateRfqParams): Promise<Rfq> {
    const response = (await apiClient.patch(
      `/rfqs/${id}`,
      params,
    )) as unknown as ApiResponseWrapper<Rfq>;

    return response.data;
  },

  async publish(id: string): Promise<Rfq> {
    const response = (await apiClient.post(
      `/rfqs/${id}/publish`,
    )) as unknown as ApiResponseWrapper<Rfq>;

    return response.data;
  },

  async close(id: string): Promise<Rfq> {
    const response = (await apiClient.post(
      `/rfqs/${id}/close`,
    )) as unknown as ApiResponseWrapper<Rfq>;

    return response.data;
  },
};