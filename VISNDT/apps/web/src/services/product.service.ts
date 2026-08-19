/**
 * Product Service Layer
 *
 * Encapsulates Product API calls for page-level consumption.
 * Underlying HTTP calls are delegated to lib/api/products.ts.
 */
import { getProducts as fetchProducts, getProduct as fetchProduct, getProductRelatedKnowledge as fetchProductRelatedKnowledge, getProductRelatedProducts as fetchProductRelatedProducts } from '@/lib/api/products';
import type { PaginatedResponse } from '@/types/api';
import type { Product, ProductDetail, ProductSearchParams } from '@/types/product';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';

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

/**
 * Get related published knowledge for a product by ID or slug.
 * GET /products/:id/related-knowledge
 */
export async function getProductRelatedKnowledge(
  id: string,
): Promise<RelatedKnowledgeItem[]> {
  return fetchProductRelatedKnowledge(id);
}

/**
 * Get related active products for a product by ID or slug.
 * GET /products/:id/related-products
 */
export async function getProductRelatedProducts(
  id: string,
): Promise<Product[]> {
  return fetchProductRelatedProducts(id);
}