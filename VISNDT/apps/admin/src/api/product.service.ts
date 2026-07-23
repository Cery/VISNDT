import { apiClient } from './client';
import type { Product, ProductDetail, ProductListResponse, SearchProductParams } from '../types/product.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const productService = {
  async getList(params?: SearchProductParams): Promise<ProductListResponse> {
    const response = (await apiClient.get('/products', {
      params,
    })) as unknown as ApiResponseWrapper<ProductListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<ProductDetail> {
    const response = (await apiClient.get(
      `/products/${id}`,
    )) as unknown as ApiResponseWrapper<ProductDetail>;
    return response.data;
  },

  async create(data: {
    categoryId: string;
    name: string;
    model?: string;
    description?: string;
  }): Promise<Product> {
    const response = (await apiClient.post(
      '/products',
      data,
    )) as unknown as ApiResponseWrapper<Product>;
    return response.data;
  },

  async update(
    id: string,
    data: {
      categoryId?: string;
      name?: string;
      model?: string;
      description?: string;
      status?: string;
    },
  ): Promise<Product> {
    const response = (await apiClient.patch(
      `/products/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<Product>;
    return response.data;
  },
};