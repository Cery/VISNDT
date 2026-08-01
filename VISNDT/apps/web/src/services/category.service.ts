/**
 * Category Service Layer
 *
 * Encapsulates Category API calls for page-level consumption.
 */
import { getCategories as fetchCategories } from '@/lib/api/categories';
import type { PaginatedResponse } from '@/types/api';
import type { ProductCategory } from '@/types/category';

/**
 * List all product categories.
 * GET /product-categories
 */
export async function getCategories(
  page = 1,
  pageSize = 100,
): Promise<PaginatedResponse<ProductCategory>> {
  return fetchCategories(page, pageSize);
}