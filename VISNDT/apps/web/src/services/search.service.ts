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
import { searchUnified } from '@/lib/api/search';
import type {
  ProductDiscoveryItem,
  KnowledgeDiscoveryItem,
  ContentDiscoveryItem,
  SupplierDiscoveryItem,
} from '@/lib/api/search';
import type { Product } from '@/types/product';
import type { Content } from '@/types/content';

/** Search domain types */
export type SearchDomain = 'all' | 'product' | 'knowledge' | 'solution' | 'supplier';

/** Unified search params */
export interface UnifiedSearchParams {
  q: string;
  type: SearchDomain;
  page?: number;
  pageSize?: number;
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

/** Aggregated unified search result */
export interface UnifiedSearchResults {
  query: string;
  activeType: SearchDomain;
  products: DomainSearchResult<Product>;
  knowledge: DomainSearchResult<Content>;
  solutions: DomainSearchResult<Content>;
  suppliers: DomainSearchResult<SupplierSearchResult>;
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

/** Empty result helper */
function emptyResult<T>(): DomainSearchResult<T> {
  return { items: [], total: 0, searched: false };
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
  const { q, type, page = 1, pageSize = 20 } = params;

  const empty = emptyResult;

  try {
    const response = await searchUnified({ q, page, pageSize });

    return {
      query: response.query,
      activeType: type,
      products: {
        items: response.products.items.map(mapProduct),
        total: response.products.total,
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
    };
  } catch {
    return {
      query: q,
      activeType: type,
      products: empty<Product>(),
      knowledge: empty<Content>(),
      solutions: empty<Content>(),
      suppliers: empty<SupplierSearchResult>(),
    };
  }
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