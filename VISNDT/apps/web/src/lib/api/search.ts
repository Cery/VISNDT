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

/** Capability (Platform Product = Capability Authority) projection in a supplier-product result */
export interface SupplierProductCapability {
  id: string;
  name: string;
  slug: string | null;
  categoryId: string | null;
}

/** SupplierProduct projection (recall: Product = Capability Authority) */
export interface SupplierProductDiscoveryItem {
  capability: SupplierProductCapability | null;
  supplierProduct: {
    id: string;
    brand: string;
    series: string | null;
    modelNumber: string;
    slug: string | null;
    status: string;
    platformProductId: string;
    organization: {
      id: string;
      name: string;
    } | null;
  };
  commercialSummary: {
    offerCount: number;
    activeOfferCount: number;
    priceFrom: number | null;
    priceTo: number | null;
    currency: string | null;
  };
  inquiryAvailable: boolean;
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
  supplierProducts: EntitySearchGroup<SupplierProductDiscoveryItem>;
  knowledge: EntitySearchGroup<KnowledgeDiscoveryItem>;
  content: EntitySearchGroup<ContentDiscoveryItem>;
  solutions: EntitySearchGroup<ContentDiscoveryItem>;
  /**
   * M28.0 M661.6 — SupplierProduct dimension facet bundle served directly by
   * the unified `/search` response (pagination-independent). SearchPage only
   * consumes `/search` and never the legacy `/search/supplier-models` endpoint.
   */
  supplierProductFacets?: SupplierProductFacetBundle;
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
  /** M28.0 M661.5 — SupplierProduct dimension facet inputs (brand / series / hasOffer) */
  brand?: string;
  series?: string;
  hasOffer?: boolean;
}): Promise<UnifiedDiscoveryResponse> {
  const queryParams: Record<string, string | number | undefined> = {
    q: params.q,
    page: params.page,
    pageSize: params.pageSize,
    category: params.category || undefined,
    filters: encodeProductFilters(params.filters),
    brand: params.brand || undefined,
    series: params.series || undefined,
    hasOffer: params.hasOffer ? 'true' : undefined,
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

// ============================================
// Supplier Model Facet Search — M28.0 M661.4
// ============================================

/** Capability (Platform Product) context in a supplier model result */
export interface SupplierModelSearchCapabilityItem {
  id: string;
  name: string;
  slug?: string | null;
  categoryId?: string | null;
}

/** SupplierProduct projection (recall: Product = Capability Authority) */
export interface SupplierModelSearchSupplierProductItem {
  id: string;
  brand: string;
  series?: string | null;
  modelNumber: string;
  slug?: string | null;
  status: string;
  platformProductId: string;
}

/** Facet summary for a supplier model result */
export interface SupplierModelSearchFacetSummary {
  parameterCount: number;
  primaryCategoryName?: string | null;
}

/** Commercial layer summary (Offer = Commercial Layer, summary only) */
export interface SupplierModelSearchCommercialSummary {
  offerCount: number;
  activeOfferCount: number;
  priceFrom?: number | null;
  priceTo?: number | null;
  currency?: string | null;
}

/** A single facet option */
export interface SupplierModelFacetOption {
  value: string;
  label: string;
  count: number;
}

/** A parameter-level facet with aggregated values */
export interface SupplierModelParameterFacet {
  parameterId: string;
  parameterName: string;
  parameterKey: string;
  unit?: string | null;
  values: SupplierModelFacetOption[];
}

/** Commercial availability facet */
export interface SupplierModelCommercialFacet {
  hasActiveOffer: number;
  inquiryAvailable: number;
}

/** Aggregated facet bundle */
export interface SupplierModelFacetBundle {
  capabilities: SupplierModelFacetOption[];
  brands: SupplierModelFacetOption[];
  series: SupplierModelFacetOption[];
  parameters: SupplierModelParameterFacet[];
  commercial: SupplierModelCommercialFacet;
}

/**
 * SupplierProduct dimension facet bundle — M28.0 M661.6.
 *
 * Served directly by the unified `/search` response (pagination-independent).
 * Brand / series / commercial availability only; capability + technical
 * parameter facets come from Search Context (shared ParameterFacet).
 */
export interface SupplierProductFacetBundle {
  brands: SupplierModelFacetOption[];
  series: SupplierModelFacetOption[];
  commercial: SupplierModelCommercialFacet;
}

/** A single supplier model discovery result */
export interface SupplierModelSearchResultItem {
  capability: SupplierModelSearchCapabilityItem;
  supplierProduct: SupplierModelSearchSupplierProductItem;
  facetSummary: SupplierModelSearchFacetSummary;
  commercialSummary: SupplierModelSearchCommercialSummary;
  inquiryAvailable: boolean;
}

/** Supplier model facet search response */
export interface SupplierModelFacetSearchResponse {
  query: string;
  items: SupplierModelSearchResultItem[];
  total: number;
  facets: SupplierModelFacetBundle;
}

/** Supplier model facet search params */
export interface SupplierModelFacetSearchParams {
  q?: string;
  categoryId?: string;
  brand?: string;
  series?: string;
  hasOffer?: boolean;
  filters?: Record<string, string[]>;
  page?: number;
  pageSize?: number;
}

/**
 * Execute supplier model facet search via GET /search/supplier-models.
 * Only PUBLISHED SupplierProduct is indexed server-side.
 */
export async function searchSupplierModels(
  params: SupplierModelFacetSearchParams,
): Promise<SupplierModelFacetSearchResponse> {
  const filters = encodeProductFilters(params.filters);
  return apiClient<SupplierModelFacetSearchResponse>('/search/supplier-models', {
    params: {
      q: params.q || undefined,
      categoryId: params.categoryId || undefined,
      brand: params.brand || undefined,
      series: params.series || undefined,
      hasOffer: params.hasOffer ? 'true' : undefined,
      filters,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}