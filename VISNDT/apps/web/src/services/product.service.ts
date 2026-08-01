/**
 * Product Service Layer
 *
 * Encapsulates Product API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/products.ts.
 */
import { getProducts as fetchProducts, getProduct as fetchProduct } from '@/lib/api/products';
import type { PaginatedResponse } from '@/types/api';
import type { Product, ProductDetail, ProductSearchParams } from '@/types/product';

/**
 * Search products with filtering, sorting, and pagination.
 * GET /products
 */
export async function getProducts(
  params: ProductSearchParams = {},
): Promise<PaginatedResponse<Product>> {
  return fetchProducts(params);
}

/**
 * Get a single product by ID with full details.
 * GET /products/:id
 */
export async function getProduct(id: string): Promise<ProductDetail> {
  return fetchProduct(id);
}