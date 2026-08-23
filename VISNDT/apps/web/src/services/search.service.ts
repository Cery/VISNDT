/**
 * Search Service Layer — M22.4.1 Unified Search Foundation
 *
 * Calls the backend unified search API (GET /search) instead of
 * client-side fan-out across 4 separate endpoints.
 *
 * Architecture: 580_ADR-001/002/003
 *   - Single endpoint, unified response contract
 *   - KnowledgeEntry replaces Content(KNOWLEDGE) as primary knowledge source
 *   - Server-side aggregation (not client-side Promise.allSettled)
 */
import { searchUnified, searchSupplierModels } from '@/lib/api/search';
import type {
  ProductDiscoveryItem,
  KnowledgeDiscoveryItem,
  ContentDiscoveryItem,
  SupplierDiscoveryItem,
  SupplierProductDiscoveryItem,
  SupplierModelFacetSearchParams,
  SupplierModelFacetSearchResponse,
  SupplierProductFacetBundle,
} from '@/lib/api/search';
import type { Product } from '@/types/product';
import type { Content } from '@/types/content';

/** Search domain types */
export type SearchDomain =
  | 'all'
  | 'product'
  | 'knowledge'
  | 'solution'
  | 'supplier'
  | 'supplier-product';

/** Unified search params */
export interface UnifiedSearchParams {
  q: string;
  type: SearchDomain;
  page?: number;
  pageSize?: number;
  category?: string;
  filters?: Record<string, string[]>;
  /** M28.0 M661.5 — SupplierProduct dimension facet inputs */
  brand?: string;
  series?: string;
  hasOffer?: boolean;
}

/** Search result for a single domain */
export interface DomainSearchResult<T> {
  items: T[];
  total: number;
  searched: boolean;
}

/** Supplier result derived from aggregated offers */
export interface SupplierSearchResult {
  organizationId: string;
  organizationName: string;
  organizationType: string;
  offerCapabilities: string[];
  offerCount: number;
  matchingOfferIds: string[];
}

/** SupplierProduct (published supplier model) discovery result — capability-centric */
export interface SupplierProductSearchResult {
  capability: {
    id: string;
    name: string;
    slug: string | null;
    categoryId: string | null;
  } | null;
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

/** Aggregated unified search result */
export interface UnifiedSearchResults {
  query: string;
  activeType: SearchDomain;
  products: DomainSearchResult<Product>;
  supplierProducts: DomainSearchResult<SupplierProductSearchResult>;
  knowledge: DomainSearchResult<Content>;
  solutions: DomainSearchResult<Content>;
  suppliers: DomainSearchResult<SupplierSearchResult>;
  /** M28.0 M661.6 — SupplierProduct dimension facets from unified /search */
  supplierProductFacets?: SupplierProductFacetBundle;
}

// ============================================
// Response Mappers
// ============================================

/** Map backend ProductDiscoveryItem to frontend Product type */
function mapProduct(item: ProductDiscoveryItem): Product {
  return {
    id: item.id,
    categoryId: item.category?.id ?? '',
    name: item.name,
    model: item.model,
    description: item.description,
    status: 'ACTIVE',
    createdAt: '',
    updatedAt: '',
    category: (item.category ?? { id: '', name: '', slug: '' }) as Product['category'],
  };
}

/** Map backend KnowledgeDiscoveryItem to frontend Content type (for KnowledgeResultCard) */
function mapKnowledgeToContent(item: KnowledgeDiscoveryItem): Content {
  return {
    id: item.id,
    type: 'KNOWLEDGE' as Content['type'],
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    publishedAt: item.publishedAt,
    createdAt: '',
    updatedAt: '',
  } as Content;
}

/** Map backend ContentDiscoveryItem to frontend Content type */
function mapContent(item: ContentDiscoveryItem): Content {
  return {
    id: item.id,
    type: item.type as Content['type'],
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    publishedAt: item.publishedAt,
    estimatedReadTime: item.estimatedReadTime,
    coverImage: item.coverImage ? {
      id: item.coverImage.id,
      fileName: item.coverImage.fileName,
      mimeType: item.coverImage.mimeType,
    } : undefined,
    author: item.author ? {
      id: item.author.id,
      name: item.author.name,
    } : undefined,
    tags: item.tags?.map(t => ({
      tag: {
        id: t.tag.id,
        name: t.tag.name,
        slug: t.tag.slug,
        type: t.tag.type,
      },
    })),
    createdAt: '',
    updatedAt: '',
  } as Content;
}

/** Map backend SupplierDiscoveryItem to frontend SupplierSearchResult */
function mapSupplier(item: SupplierDiscoveryItem): SupplierSearchResult {
  return {
    organizationId: item.organizationId,
    organizationName: item.organizationName,
    organizationType: '',
    offerCapabilities: item.offerTitles,
    offerCount: item.offerCount,
    matchingOfferIds: [],
  };
}

/** Map backend SupplierProductDiscoveryItem to frontend SupplierProductSearchResult */
function mapSupplierProduct(item: SupplierProductDiscoveryItem): SupplierProductSearchResult {
  return {
    capability: item.capability,
    supplierProduct: {
      id: item.supplierProduct.id,
      brand: item.supplierProduct.brand,
      series: item.supplierProduct.series,
      modelNumber: item.supplierProduct.modelNumber,
      slug: item.supplierProduct.slug,
      status: item.supplierProduct.status,
      platformProductId: item.supplierProduct.platformProductId,
      organization: item.supplierProduct.organization
        ? {
            id: item.supplierProduct.organization.id,
            name: item.supplierProduct.organization.name,
          }
        : null,
    },
    commercialSummary: {
      offerCount: item.commercialSummary.offerCount,
      activeOfferCount: item.commercialSummary.activeOfferCount,
      priceFrom: item.commercialSummary.priceFrom,
      priceTo: item.commercialSummary.priceTo,
      currency: item.commercialSummary.currency,
    },
    inquiryAvailable: item.inquiryAvailable,
  };
}

// ============================================
// Unified Search
// ============================================

/**
 * Execute unified search via the backend unified discovery API.
 * Replaces the old client-side fan-out approach.
 */
export async function unifiedSearch(
  params: UnifiedSearchParams,
): Promise<UnifiedSearchResults> {
  const { q, type, page = 1, pageSize = 20, category, filters, brand, series, hasOffer } = params;

  // M24.1.5 — do NOT swallow search errors here. Rethrowing lets the caller
  // (SearchPageContent.executeSearch) surface the error UI + retry instead of
  // silently rendering an empty result set (defect in error state handling).
  const response = await searchUnified({ q, page, pageSize, category, filters, brand, series, hasOffer });

  return {
    query: response.query,
    activeType: type,
    products: {
      items: response.products.items.map(mapProduct),
      total: response.products.total,
      searched: true,
    },
    supplierProducts: {
      items: response.supplierProducts.items.map(mapSupplierProduct),
      total: response.supplierProducts.total,
      searched: true,
    },
    knowledge: {
      items: response.knowledge.items.map(mapKnowledgeToContent),
      total: response.knowledge.total,
      searched: true,
    },
    solutions: {
      items: response.solutions.items.map(mapContent),
      total: response.solutions.total,
      searched: true,
    },
    suppliers: {
      items: response.suppliers.items.map(mapSupplier),
      total: response.suppliers.total,
      searched: true,
    },
    // M28.0 M661.6 — pass through the SupplierProduct dimension facet bundle
    supplierProductFacets: response.supplierProductFacets,
  };
}

/**
 * Fetch product suggestions for autocomplete.
 * GET /products?keyword=&pageSize=5
 */
export async function getProductSuggestions(keyword: string): Promise<Product[]> {
  if (!keyword || keyword.length < 2) return [];
  try {
    const response = await searchUnified({ q: keyword, page: 1, pageSize: 5 });
    return response.products.items.map(mapProduct);
  } catch {
    return [];
  }
}

// ============================================
// Supplier Model Facet Search — M28.0 M661.4
// ============================================

/**
 * Execute supplier model facet discovery. Only PUBLISHED SupplierProduct is
 * indexed by the backend. Search = Discovery Acceleration Layer.
 */
export async function supplierModelSearch(
  params: SupplierModelFacetSearchParams,
): Promise<SupplierModelFacetSearchResponse> {
  return searchSupplierModels(params);
}

/** Lightweight alias for a single supplier model result type consumers. */
export type SupplierModelResultItem = SupplierModelFacetSearchResponse['items'][number];