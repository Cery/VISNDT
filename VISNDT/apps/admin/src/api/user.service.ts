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
};