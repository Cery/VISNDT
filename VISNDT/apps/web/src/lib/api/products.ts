import { apiClient } from '../api-client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Product, ProductDetail, ProductSearchParams } from '@/types/product';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';

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

/**
 * Get related published knowledge for a product.
 * GET /products/:id/related-knowledge
 * Deterministic mapping: Product → Category → ProductCategoryKnowledgeMapping
 * → KnowledgeCategory → KnowledgeEntry (PUBLISHED only).
 */
export async function getProductRelatedKnowledge(
  id: string,
): Promise<RelatedKnowledgeItem[]> {
  const res = await apiClient<ApiResponse<RelatedKnowledgeItem[]>>(
    `/products/${id}/related-knowledge`,
  );
  return res.data;
}

/**
 * Get related active products for a product.
 * GET /products/:id/related-products
 * Deterministic: same ProductCategory, ACTIVE only, excluding the current product.
 * Returns public product-card fields only (no supplier / organization leakage).
 */
export async function getProductRelatedProducts(
  id: string,
): Promise<Product[]> {
  const res = await apiClient<ApiResponse<Product[]>>(
    `/products/${id}/related-products`,
  );
  return res.data;
}