/**
 * Search Service Layer
 *
 * Encapsulates parallel API calls for unified search across
 * Products, Knowledge, Solutions, and Supplier Capability.
 * All API combination logic stays here; components must not
 * call fetch/axios/apiClient directly.
 */
import { getProducts } from '@/services/product.service';
import { getContentList } from '@/services/content.service';
import { getOffers } from '@/services/offer.service';
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
  /** Whether this domain was searched */
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

/**
 * Search products by keyword.
 * GET /products?keyword=
 */
async function searchProducts(
  keyword: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<DomainSearchResult<Product>> {
  try {
    const result = await getProducts({
      keyword,
      status: 'ACTIVE',
      page,
      pageSize,
    });
    return {
      items: result.data ?? [],
      total: result.total,
      searched: true,
    };
  } catch {
    return { items: [], total: 0, searched: true };
  }
}

/**
 * Search knowledge content by keyword.
 * GET /content/public?type=KNOWLEDGE&keyword=
 */
async function searchKnowledge(
  keyword: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<DomainSearchResult<Content>> {
  try {
    const result = await getContentList({
      type: 'KNOWLEDGE',
      keyword,
      page,
      pageSize,
    });
    return {
      items: result.data ?? [],
      total: result.total,
      searched: true,
    };
  } catch {
    return { items: [], total: 0, searched: true };
  }
}

/**
 * Search solution content by keyword.
 * GET /content/public?type=SOLUTION&keyword=
 */
async function searchSolutions(
  keyword: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<DomainSearchResult<Content>> {
  try {
    const result = await getContentList({
      type: 'SOLUTION',
      keyword,
      page,
      pageSize,
    });
    return {
      items: result.data ?? [],
      total: result.total,
      searched: true,
    };
  } catch {
    return { items: [], total: 0, searched: true };
  }
}

/**
 * Search supplier capability via offers.
 * GET /offers?keyword=
 * Aggregates offers by organizationId to build supplier-level results.
 */
async function searchSuppliers(
  keyword: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<DomainSearchResult<SupplierSearchResult>> {
  try {
    const result = await getOffers({
      keyword,
      pageSize: 50,
    });
    const offers = result.data ?? [];

    // Aggregate by organizationId
    const orgMap = new Map<string, SupplierSearchResult>();
    for (const offer of offers) {
      const orgId = offer.organizationId;
      if (!orgMap.has(orgId)) {
        orgMap.set(orgId, {
          organizationId: orgId,
          organizationName: offer.organization?.name ?? '未知供应商',
          organizationType: offer.organization?.type ?? '',
          offerCapabilities: [],
          offerCount: 0,
          matchingOfferIds: [],
        });
      }
      const entry = orgMap.get(orgId)!;
      if (offer.title && !entry.offerCapabilities.includes(offer.title)) {
        entry.offerCapabilities.push(offer.title);
      }
      entry.offerCount++;
      entry.matchingOfferIds.push(offer.id);
    }

    const suppliers = Array.from(orgMap.values());
    const paginated = suppliers.slice((page - 1) * pageSize, page * pageSize);
    return {
      items: paginated,
      total: suppliers.length,
      searched: true,
    };
  } catch {
    return { items: [], total: 0, searched: true };
  }
}

/**
 * Execute unified search across all domains.
 * For type=all, searches all domains in parallel.
 * For a specific type, only searches that domain.
 */
export async function unifiedSearch(
  params: UnifiedSearchParams,
): Promise<UnifiedSearchResults> {
  const { q, type, page = 1, pageSize = 20 } = params;

  const emptyResult = <T>(): DomainSearchResult<T> => ({
    items: [],
    total: 0,
    searched: false,
  });

  const shouldSearch = (domain: SearchDomain): boolean =>
    type === 'all' || type === domain;

  // Execute applicable searches in parallel with partial failure tolerance (P1-5)
  const settled = await Promise.allSettled([
    shouldSearch('product')
      ? searchProducts(q, page, pageSize)
      : Promise.resolve(emptyResult<Product>()),
    shouldSearch('knowledge')
      ? searchKnowledge(q, page, pageSize)
      : Promise.resolve(emptyResult<Content>()),
    shouldSearch('solution')
      ? searchSolutions(q, page, pageSize)
      : Promise.resolve(emptyResult<Content>()),
    shouldSearch('supplier')
      ? searchSuppliers(q, page, pageSize)
      : Promise.resolve(emptyResult<SupplierSearchResult>()),
  ]);

  const products = settled[0].status === 'fulfilled' ? settled[0].value : { ...emptyResult<Product>(), searched: true };
  const knowledge = settled[1].status === 'fulfilled' ? settled[1].value : { ...emptyResult<Content>(), searched: true };
  const solutions = settled[2].status === 'fulfilled' ? settled[2].value : { ...emptyResult<Content>(), searched: true };
  const suppliers = settled[3].status === 'fulfilled' ? settled[3].value : { ...emptyResult<SupplierSearchResult>(), searched: true };

  return {
    query: q,
    activeType: type,
    products,
    knowledge,
    solutions,
    suppliers,
  };
}

/**
 * Fetch product suggestions for autocomplete.
 * GET /products?keyword=&pageSize=5
 */
export async function getProductSuggestions(keyword: string): Promise<Product[]> {
  if (!keyword || keyword.length < 2) return [];
  try {
    const result = await getProducts({
      keyword,
      status: 'ACTIVE',
      page: 1,
      pageSize: 5,
    });
    return result.data ?? [];
  } catch {
    return [];
  }
}