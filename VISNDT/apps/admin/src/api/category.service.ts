import { apiClient } from './client';
import type {
  ProductCategory,
  ProductCategoryListResponse,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '../types/category.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const categoryService = {
  async getList(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<ProductCategoryListResponse> {
    const response = (await apiClient.get('/product-categories', {
      params,
    })) as unknown as ApiResponseWrapper<ProductCategoryListResponse>;
    return response.data;
  },

  async getById(id: string): Promise<ProductCategory> {
    const response = (await apiClient.get(
      `/product-categories/${id}`,
    )) as unknown as ApiResponseWrapper<ProductCategory>;
    return response.data;
  },

  async create(data: CreateProductCategoryDto): Promise<ProductCategory> {
    const response = (await apiClient.post(
      '/product-categories',
      data,
    )) as unknown as ApiResponseWrapper<ProductCategory>;
    return response.data;
  },

  async update(id: string, data: UpdateProductCategoryDto): Promise<ProductCategory> {
    const response = (await apiClient.patch(
      `/product-categories/${id}`,
      data,
    )) as unknown as ApiResponseWrapper<ProductCategory>;
    return response.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const response = (await apiClient.delete(
      `/product-categories/${id}`,
    )) as unknown as ApiResponseWrapper<{ id: string }>;
    return response.data;
  },

  async batchDelete(ids: string[]): Promise<{ succeeded: { id: string }[]; failed: { id: string; reason: string }[] }> {
    const response = (await apiClient.post('/product-categories/batch-delete', { ids })) as unknown as ApiResponseWrapper<{ succeeded: { id: string }[]; failed: { id: string; reason: string }[] }>;
    return response.data;
  },
};