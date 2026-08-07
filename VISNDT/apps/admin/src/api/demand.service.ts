import { apiClient } from './client';
import type {
  Demand,
  DemandListResponse,
  SearchDemandParams,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const demandService = {
  async getList(
    params: SearchDemandParams,
  ): Promise<DemandListResponse> {
    const response = (await apiClient.get('/demands', {
      params,
    })) as unknown as ApiResponseWrapper<DemandListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Demand> {
    const response = (await apiClient.get(
      `/demands/${id}`,
    )) as unknown as ApiResponseWrapper<Demand>;

    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/demands/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/demands/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const response = (await apiClient.patch('/demands/batch-status', { ids, status })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};