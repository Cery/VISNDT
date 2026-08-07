import { apiClient } from './client';
import type { User, UserListResponse, SearchUserParams } from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const userService = {
  async getList(params: SearchUserParams): Promise<UserListResponse> {
    const response = (await apiClient.get('/users', {
      params,
    })) as unknown as ApiResponseWrapper<UserListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = (await apiClient.get(
      `/users/${id}`,
    )) as unknown as ApiResponseWrapper<User>;

    return response.data;
  },

  async create(data: {
    email: string;
    passwordHash: string;
    organizationId?: string;
  }): Promise<User> {
    const response = (await apiClient.post('/users', data)) as unknown as ApiResponseWrapper<User>;
    return response.data;
  },

  async update(
    id: string,
    data: {
      email?: string;
      passwordHash?: string;
      status?: string;
      organizationId?: string;
    },
  ): Promise<User> {
    const response = (await apiClient.patch(
      `/users/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<User>;
    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/users/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/users/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const response = (await apiClient.patch('/users/batch-status', { ids, status })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};