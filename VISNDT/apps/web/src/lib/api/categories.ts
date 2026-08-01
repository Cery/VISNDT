import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { ProductCategory } from '@/types/category';

/**
 * List all product categories.
 * GET /product-categories
 */
export async function getCategories(
  page = 1,
  pageSize = 100,
): Promise<PaginatedResponse<ProductCategory>> {
  const res = await apiClient<ApiResponse<PaginatedResponse<ProductCategory>>>(
    '/product-categories',
    { params: { page, pageSize } },
  );

  return res.data;
}

/**
 * Get a single category by ID.
 * GET /product-categories/:id
 */
export async function getCategory(id: string): Promise<ProductCategory> {
  const res = await apiClient<ApiResponse<ProductCategory>>(
    `/product-categories/${id}`,
  );
  return res.data;
}