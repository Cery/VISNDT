import { apiClient } from './client';
import type { Offer, OfferListResponse } from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const offerService = {
  async getList(
    page = 1,
    pageSize = 20,
    keyword?: string,
    status?: string,
  ): Promise<OfferListResponse> {
    const params: Record<string, string | number> = { page, pageSize };
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    const response = (await apiClient.get('/offers', {
      params,
    })) as unknown as ApiResponseWrapper<OfferListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<Offer> {
    const response = (await apiClient.get(
      `/offers/${id}`,
    )) as unknown as ApiResponseWrapper<Offer>;

    return response.data;
  },

  async submit(id: string): Promise<Offer> {
    const response = (await apiClient.post(
      `/offers/${id}/submit`,
    )) as unknown as ApiResponseWrapper<Offer>;

    return response.data;
  },

  async accept(id: string): Promise<Offer> {
    const response = (await apiClient.post(
      `/offers/${id}/accept`,
    )) as unknown as ApiResponseWrapper<Offer>;

    return response.data;
  },

  async reject(id: string): Promise<Offer> {
    const response = (await apiClient.post(
      `/offers/${id}/reject`,
    )) as unknown as ApiResponseWrapper<Offer>;

    return response.data;
  },

  async withdraw(id: string): Promise<Offer> {
    const response = (await apiClient.post(
      `/offers/${id}/withdraw`,
    )) as unknown as ApiResponseWrapper<Offer>;

    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/offers/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ count: number }> {
    const response = (await apiClient.post('/offers/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },

  async batchStatus(ids: string[], status: string): Promise<{ count: number }> {
    const response = (await apiClient.patch('/offers/batch-status', { ids, status })) as unknown as ApiResponseWrapper<{ count: number }>;
    return response.data;
  },
};