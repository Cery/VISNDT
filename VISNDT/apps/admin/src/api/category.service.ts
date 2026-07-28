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
  async list(params?: { page?: number; pageSize?: number }): Promise<ProductCategoryListResponse> {
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
};