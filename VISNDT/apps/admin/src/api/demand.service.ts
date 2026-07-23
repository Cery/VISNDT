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
};