import { apiClient } from '../api-client';
import type { ApiResponse } from '@/types/api';
import type {
  KnowledgeDomain,
  KnowledgeDomainDetail,
  KnowledgeCategory,
  KnowledgeEntryDetail,
  KnowledgeEntriesResult,
  RelatedProductItem,
} from '@/types/knowledge-base';

/**
 * Public Knowledge Base API wrapper.
 * Consumes the public read endpoints (GET /knowledge/public/*),
 * which return PUBLISHED entries only.
 */

/** List all knowledge domains */
export async function getPublicDomains(): Promise<KnowledgeDomain[]> {
  const res = await apiClient<ApiResponse<KnowledgeDomain[]>>('/knowledge/public/domains');
  return res.data;
}

/** Get a knowledge domain by slug */
export async function getPublicDomainBySlug(slug: string): Promise<KnowledgeDomainDetail> {
  const res = await apiClient<ApiResponse<KnowledgeDomainDetail>>(`/knowledge/public/domains/${slug}`);
  return res.data;
}

/** List knowledge categories, optionally filtered by domain */
export async function getPublicCategories(domainId?: string): Promise<KnowledgeCategory[]> {
  const res = await apiClient<ApiResponse<KnowledgeCategory[]>>('/knowledge/public/categories', {
    params: domainId ? { domainId } : undefined,
  });
  return res.data;
}

/** List published knowledge entries */
export async function getPublicEntries(params: {
  domainId?: string;
  categoryId?: string;
  domainSlug?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<KnowledgeEntriesResult> {
  const queryParams: Record<string, string | number | undefined> = {};
  if (params.domainId) queryParams.domainId = params.domainId;
  if (params.categoryId) queryParams.categoryId = params.categoryId;
  if (params.domainSlug) queryParams.domainSlug = params.domainSlug;
  if (params.search) queryParams.search = params.search;
  if (params.page) queryParams.page = params.page;
  if (params.pageSize) queryParams.pageSize = params.pageSize;

  const res = await apiClient<ApiResponse<KnowledgeEntriesResult>>('/knowledge/public/entries', {
    params: queryParams,
  });
  return res.data;
}

/** Get a single published knowledge entry by slug */
export async function getPublicEntryBySlug(slug: string): Promise<KnowledgeEntryDetail> {
  const res = await apiClient<ApiResponse<KnowledgeEntryDetail>>(`/knowledge/public/entries/${slug}`);
  return res.data;
}

/**
 * Get related active products for a published knowledge entry.
 * GET /knowledge/public/entries/:slug/related-products
 * Deterministic mapping: KnowledgeEntry → KnowledgeCategory
 * → ProductCategoryKnowledgeMapping → ProductCategory → Product (ACTIVE only).
 */
export async function getEntryRelatedProducts(slug: string): Promise<RelatedProductItem[]> {
  const res = await apiClient<ApiResponse<RelatedProductItem[]>>(
    `/knowledge/public/entries/${slug}/related-products`,
  );
  return res.data;
}