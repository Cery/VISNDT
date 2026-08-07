import { apiClient } from './client';
import type {
  Organization,
  OrganizationFormData,
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

  async create(data: OrganizationFormData): Promise<Organization> {
    const response = (await apiClient.post('/organizations', data)) as unknown as ApiResponseWrapper<Organization>;

    return response.data;
  },

  async update(id: string, data: Partial<OrganizationFormData>): Promise<Organization> {
    const response = (await apiClient.patch(
      `/organizations/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<Organization>;

    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/organizations/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/organizations/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const response = (await apiClient.patch('/organizations/batch-status', { ids, status })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};