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
};