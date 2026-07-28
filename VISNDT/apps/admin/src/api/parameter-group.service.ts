import { apiClient } from './client';
import type {
  ParameterGroup,
  ParameterGroupListResponse,
  CreateParameterGroupDto,
  UpdateParameterGroupDto,
} from '../types/parameter.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const parameterGroupService = {
  async list(params?: { page?: number; pageSize?: number }): Promise<ParameterGroupListResponse> {
    const response = (await apiClient.get('/parameter-groups', {
      params,
    })) as unknown as ApiResponseWrapper<ParameterGroupListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<ParameterGroup> {
    const response = (await apiClient.get(
      `/parameter-groups/${id}`,
    )) as unknown as ApiResponseWrapper<ParameterGroup>;
    return response.data;
  },

  async create(data: CreateParameterGroupDto): Promise<ParameterGroup> {
    const response = (await apiClient.post(
      '/parameter-groups',
      data,
    )) as unknown as ApiResponseWrapper<ParameterGroup>;
    return response.data;
  },

  async update(id: string, data: UpdateParameterGroupDto): Promise<ParameterGroup> {
    const response = (await apiClient.patch(
      `/parameter-groups/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ParameterGroup>;
    return response.data;
  },
};