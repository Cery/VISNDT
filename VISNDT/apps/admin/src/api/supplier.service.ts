import { apiClient } from './client';
import type {
  SupplierListResponse,
  SupplierDetail,
  SupplierProductListResponse,
} from '../types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const supplierService = {
  async getList(
    page = 1,
    pageSize = 20,
    keyword?: string,
  ): Promise<SupplierListResponse> {
    const params: Record<string, unknown> = { page, pageSize };
    if (keyword) {
      params.keyword = keyword;
    }
    const response = (await apiClient.get('/suppliers', {
      params,
    })) as unknown as ApiResponseWrapper<SupplierListResponse>;

    return response.data;
  },

  async getById(id: string): Promise<SupplierDetail> {
    const response = (await apiClient.get(
      `/suppliers/${id}`,
    )) as unknown as ApiResponseWrapper<SupplierDetail>;

    return response.data;
  },

  async getProducts(
    id: string,
    page = 1,
    pageSize = 20,
  ): Promise<SupplierProductListResponse> {
    const response = (await apiClient.get(`/suppliers/${id}/products`, {
      params: { page, pageSize },
    })) as unknown as ApiResponseWrapper<SupplierProductListResponse>;

    return response.data;
  },
};