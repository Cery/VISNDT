import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Product, ProductDetail, ProductSearchParams } from '@/types/product';

/**
 * Build a GET /products query string.
 * The backend parses `parameterFilters` as a nested array (qs bracket notation),
 * e.g. `parameterFilters[0][parameterDefinitionId]=uuid&parameterFilters[0][valueMin]=2`.
 * Brackets must stay literal (not URL-encoded), so we serialize manually and pass
 * the whole query via the endpoint (apiClient appends flat params otherwise).
 */
function buildProductsQuery(params: ProductSearchParams): string {
  const parts: string[] = [];
  const append = (key: string, value: string | number | undefined) => {
    if (value !== undefined) {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  };

  append('page', params.page);
  append('pageSize', params.pageSize);
  append('keyword', params.keyword);
  append('categoryId', params.categoryId);
  append('status', params.status);
  append('sortBy', params.sortBy);
  append('sortOrder', params.sortOrder);

  (params.parameterFilters ?? []).forEach((f, i) => {
    append(`parameterFilters[${i}][parameterDefinitionId]`, f.parameterDefinitionId);
    append(`parameterFilters[${i}][value]`, f.value);
    append(`parameterFilters[${i}][valueMin]`, f.valueMin);
    append(`parameterFilters[${i}][valueMax]`, f.valueMax);
  });

  return parts.join('&');
}

/**
 * Search products with filtering, sorting, and pagination.
 * GET /products
 */
export async function getProducts(
  params: ProductSearchParams = {},
): Promise<PaginatedResponse<Product>> {
  const query = buildProductsQuery(params);
  const res = await apiClient<ApiResponse<PaginatedResponse<Product>>>(
    query ? `/products?${query}` : '/products',
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