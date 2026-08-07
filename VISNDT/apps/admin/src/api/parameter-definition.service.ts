import { apiClient } from './client';
import type {
  ParameterDefinition,
  ParameterDefinitionListResponse,
  CreateParameterDefinitionDto,
  UpdateParameterDefinitionDto,
} from '../types/parameter-definition.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const parameterDefinitionService = {
  async getList(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<ParameterDefinitionListResponse> {
    const response = (await apiClient.get('/parameter-definitions', {
      params,
    })) as unknown as ApiResponseWrapper<ParameterDefinitionListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<ParameterDefinition> {
    const response = (await apiClient.get(
      `/parameter-definitions/${id}`,
    )) as unknown as ApiResponseWrapper<ParameterDefinition>;
    return response.data;
  },

  async create(data: CreateParameterDefinitionDto): Promise<ParameterDefinition> {
    const response = (await apiClient.post(
      '/parameter-definitions',
      data,
    )) as unknown as ApiResponseWrapper<ParameterDefinition>;
    return response.data;
  },

  async update(id: string, data: UpdateParameterDefinitionDto): Promise<ParameterDefinition> {
    const response = (await apiClient.patch(
      `/parameter-definitions/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ParameterDefinition>;
    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/parameter-definitions/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ succeeded: { id: string }[]; failed: { id: string; reason: string }[] }> {
    const response = (await apiClient.post('/parameter-definitions/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ succeeded: { id: string }[]; failed: { id: string; reason: string }[] }>;
    return response.data;
  },
};