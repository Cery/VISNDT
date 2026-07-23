import { apiClient } from './client';

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const categoriesService = {
  async getList(): Promise<ProductCategory[]> {
    const response = (await apiClient.get(
      '/product-categories',
    )) as unknown as ApiResponseWrapper<{ data: ProductCategory[] }>;
    return response.data.data;
  },
};