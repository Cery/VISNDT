import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Product, ProductDetail, ProductSearchParams } from '@/types/product';

/**
 * Search products with filtering, sorting, and pagination.
 * GET /products
 */
export async function getProducts(
  params: ProductSearchParams = {},
): Promise<PaginatedResponse<Product>> {
  const queryParams: Record<string, string | number | undefined> = {
    page: params.page,
    pageSize: params.pageSize,
    keyword: params.keyword,
    categoryId: params.categoryId,
    status: params.status,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  };

  const res = await apiClient<ApiResponse<PaginatedResponse<Product>>>(
    '/products',
    { params: queryParams },
  );

  return res.data;
}

/**
 * Get a single product by ID with full details.
 * GET /products/:id
 */
export async function getProduct(id: string): Promise<ProductDetail> {
  const res = await apiClient<ApiResponse<ProductDetail>>(`/products/${id}`);
  return res.data;
}