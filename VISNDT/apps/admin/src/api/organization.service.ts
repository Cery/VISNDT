import { apiClient } from './client';
import type {
  Organization,
  OrganizationListResponse,
  SearchOrganizationParams,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const organizationService = {
  async getList(
    params: SearchOrganizationParams,
  ): Promise<OrganizationListResponse> {
    const response = (await apiClient.get('/organizations', {
      params,
    })) as unknown as ApiResponseWrapper<OrganizationListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Organization> {
    const response = (await apiClient.get(
      `/organizations/${id}`,
    )) as unknown as ApiResponseWrapper<Organization>;

    return response.data;
  },
};