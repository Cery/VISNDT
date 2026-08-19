import { apiClient } from '../api-client';

// ============================================
// Unified Search API Types — M22.4.1
// ============================================

/** Product discovery item from backend */
export interface ProductDiscoveryItem {
  id: string;
  name: string;
  model: string | null;
  slug: string | null;
  description: string | null;
  category: { id: string; name: string; slug: string } | null;
}

/** Knowledge entry discovery item from backend */
export interface KnowledgeDiscoveryItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  domain: { id: string; name: string; slug: string } | null;
  category: { id: string; name: string; slug: string } | null;
  publishedAt: string | null;
}

/** Content discovery item from backend */
export interface ContentDiscoveryItem {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: string | null;
  estimatedReadTime: number | null;
  coverImage: { id: string; fileName: string; mimeType: string } | null;
  author: { id: string; name: string } | null;
  tags: Array<{ tag: { id: string; name: string; slug: string; type: string } }>;
}

/** Supplier discovery item from backend */
export interface SupplierDiscoveryItem {
  organizationId: string;
  organizationName: string;
  offerCount: number;
  offerTitles: string[];
  productNames: string[];
}

/** Per-entity search group */
export interface EntitySearchGroup<T> {
  items: T[];
  total: number;
}

/** Unified discovery response from backend */
export interface UnifiedDiscoveryResponse {
  query: string;
  products: EntitySearchGroup<ProductDiscoveryItem>;
  knowledge: EntitySearchGroup<KnowledgeDiscoveryItem>;
  content: EntitySearchGroup<ContentDiscoveryItem>;
  solutions: EntitySearchGroup<ContentDiscoveryItem>;
  suppliers: EntitySearchGroup<SupplierDiscoveryItem>;
}

// ============================================
// Search Context API Types — M24.1.3
// ============================================

/** A single available value for a parameter facet */
export interface FacetValue {
  value: string;
  label: string;
  count: number;
}

/** Facet metadata for a parameter definition */
export interface ParameterFacet {
  parameterId: string;
  parameterName: string;
  parameterKey: string;
  parameterType: string;
  unit: string | null;
  sortOrder: number;
  availableValues: FacetValue[];
}

/** A product category relevant to the search query */
export interface RelevantCategoryContext {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

/** Search context response from backend */
export interface SearchContextResponse {
  query: string;
  candidateCount: number;
  relevantCategories: RelevantCategoryContext[];
  commonFilters: ParameterFacet[];
  categorySpecificFilters: Record<string, ParameterFacet[]>;
}

// ============================================
// API Client
// ============================================

/**
 * Execute unified search via GET /search.
 * Single endpoint replaces client-side fan-out across 4 separate APIs.
 *
 * M24.1.4 — minimal filter contract:
 *   - `category`: selected ProductCategory id (selectedCategoryTab).
 *   - `filters`: merged parameter filters (parameterId → values[]).
 *     Serialized as `parameterId:value1,value2;parameterId2:value3`.
 *     Same parameter = OR, different parameters = AND (server-side).
 */
export async function searchUnified(params: {
  q: string;
  page?: number;
  pageSize?: number;
  category?: string;
  filters?: Record<string, string[]>;
}): Promise<UnifiedDiscoveryResponse> {
  const queryParams: Record<string, string | number | undefined> = {
    q: params.q,
    page: params.page,
    pageSize: params.pageSize,
    category: params.category || undefined,
    filters: encodeProductFilters(params.filters),
  };

  // Backend returns the unified discovery payload directly (no `{ data }` wrapper),
  // unlike the generic ApiResponse<T> used by other endpoints.
  return apiClient<UnifiedDiscoveryResponse>('/search', {
    params: queryParams,
  });
}

/**
 * Encode merged filter map into the wire format:
 *   `parameterId:value1,value2;parameterId2:value3`
 */
export function encodeProductFilters(
  filters?: Record<string, string[]>,
): string | undefined {
  if (!filters) return undefined;

  const parts = Object.entries(filters)
    .filter(([, values]) => values.length > 0)
    .map(([parameterId, values]) => `${parameterId}:${values.join(',')}`);

  return parts.length > 0 ? parts.join(';') : undefined;
}

/**
 * Get search context via GET /search/context.
 * Pagination-independent query-level context for categories and parameter facets.
 *
 * M24.1.3 — ADR-M24-009
 */
export async function getSearchContext(q: string): Promise<SearchContextResponse> {
  // Backend returns the search context payload directly (no `{ data }` wrapper).
  return apiClient<SearchContextResponse>('/search/context', {
    params: { q },
  });
}