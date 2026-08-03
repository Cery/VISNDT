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
  ): Promise<OfferListResponse> {
    const response = (await apiClient.get('/offers', {
      params: { page, pageSize },
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
};