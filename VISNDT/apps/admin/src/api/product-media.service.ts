import { apiClient } from './client';
import type {
  ProductMediaItem,
  ProductMediaListResponse,
  CreateProductMediaDto,
  UpdateProductMediaDto,
} from '../types/product-media.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const productMediaService = {
  async list(
    productId: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<ProductMediaListResponse> {
    const response = (await apiClient.get(`/products/${productId}/media`, {
      params,
    })) as unknown as ApiResponseWrapper<ProductMediaListResponse>;
    return response.data;
  },

  async getById(productId: string, id: string): Promise<ProductMediaItem> {
    const response = (await apiClient.get(
      `/products/${productId}/media/${id}`,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  async create(
    productId: string,
    data: CreateProductMediaDto,
  ): Promise<ProductMediaItem> {
    const response = (await apiClient.post(
      `/products/${productId}/media`,
      data,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  async update(
    productId: string,
    id: string,
    data: UpdateProductMediaDto,
  ): Promise<ProductMediaItem> {
    const response = (await apiClient.patch(
      `/products/${productId}/media/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ProductMediaItem>;
    return response.data;
  },

  async remove(productId: string, id: string): Promise<void> {
    await apiClient.delete(`/products/${productId}/media/${id}`);
  },
};