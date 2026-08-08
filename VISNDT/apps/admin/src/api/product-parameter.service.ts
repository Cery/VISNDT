import { apiClient } from './client';
import type { ProductParameterValue } from '../types/product.types';

interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

export const productParameterService = {
  async list(productId: string): Promise<ProductParameterValue[]> {
    const response = (await apiClient.get(
      `/products/${productId}/parameters`,
    )) as unknown as ApiResponseWrapper<ProductParameterValue[]>;
    return response.data;
  },

  async set(
    productId: string,
    dto: { parameterDefinitionId: string; value: string; valueNumber?: number },
  ): Promise<ProductParameterValue> {
    const response = (await apiClient.post(
      `/products/${productId}/parameters`,
      dto,
    )) as unknown as ApiResponseWrapper<ProductParameterValue>;
    return response.data;
  },
};