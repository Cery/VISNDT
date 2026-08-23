'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { SearchDomain } from '@/services/search.service';
import { unifiedSearch } from '@/services/search.service';
import type { UnifiedSearchResults } from '@/services/search.service';
import type { SupplierProductFacetBundle } from '@/lib/api/search';
import { trackEvent, buildEvent } from '@/lib/analytics';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import SearchTypeTabs from '@/components/search/SearchTypeTabs';
import SearchFilter from '@/components/search/SearchFilter';
import type { SearchFilterState, ContentTypeFilter } from '@/components/search/SearchFilter';
import SearchResultSection from '@/components/search/SearchResultSection';
import SearchEmptyState from '@/components/search/SearchEmptyState';
import ErrorState from '@/components/common/ErrorState';
import ProductResultCard from '@/components/search/ProductResultCard';
import KnowledgeResultCard from '@/components/search/KnowledgeResultCard';
import SolutionResultCard from '@/components/search/SolutionResultCard';
import SupplierResultCard from '@/components/search/SupplierResultCard';
import SupplierProductResultCard from '@/components/search/SupplierProductResultCard';
import SupplierModelFacetPanel from '@/components/search/SupplierModelFacetPanel';
import { useSearchContext } from '@/hooks/useSearchContext';
import { useFacetFilterState } from '@/hooks/useFacetFilterState';
import type { FilterValues, FacetFilterState } from '@/hooks/useFacetFilterState';
import ParameterFacet from '@/components/search/ParameterFacet';

const VALID_TYPES: SearchDomain[] = ['all', 'product', 'knowledge', 'solution', 'supplier', 'supplier-product'];
const PAGE_SIZE = 20;

function parseType(raw: string | null): SearchDomain {
  if (raw && VALID_TYPES.includes(raw as SearchDomain)) {
    return raw as SearchDomain;
  }
  return 'all';
}

// ============================================
// M24.1.4 — URL Filter Encoding
// ============================================

/** Encode filter values to URL-safe string: paramId:val1,val2;paramId2:val3 */
function encodeFilterValues(fv: FilterValues): string {
  return Object.entries(fv)
    .filter(([, values]) => values.size > 0)
    .map(([key, values]) => `${key}:${Array.from(values).sort().join(',')}`)
    .join(';');
}

/** Decode URL filter string back to FilterValues */
function decodeFilterValues(encoded: string): FilterValues {
  if (!encoded) return {};
  const result: FilterValues = {};
  encoded.split(';').forEach((part) => {
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) return;
    const key = part.slice(0, colonIdx);
    const vals = part.slice(colonIdx + 1);
    if (key && vals) {
      result[key] = new Set(vals.split(',').filter(Boolean));
    }
  });
  return result;
}

/** Build initial facet state from URL params (used for lazy state init on mount). */
function buildInitialFacetState(searchParams: URLSearchParams): FacetFilterState {
  const urlCategory = searchParams.get('category') ?? undefined;
  const fcEncoded = searchParams.get('fc');
  const common = fcEncoded ? decodeFilterValues(fcEncoded) : {};
  const categorySpecific: Record<string, FilterValues> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('f_')) {
      const categoryId = key.slice(2);
      const decoded = decodeFilterValues(value);
      if (Object.keys(decoded).length > 0) {
        categorySpecific[categoryId] = decoded;
      }
    }
  });
  return {
    selectedCategoryTab: urlCategory,
    commonFilterValues: common,
    categorySpecificFilterValues: categorySpecific,
  };
}

// ============================================
// SearchPageContent — M24.1.4 Integrated
// ============================================

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') ?? '';
  const type = parseType(searchParams.get('type'));

  // M28.0 M661.5 — SupplierProduct dimension facet inputs (brand / series / hasOffer).
  // Kept on the URL so deep-links and back/forward work; derived from searchParams.
  const spBrand = searchParams.get('sb') ?? undefined;
  const spSeries = searchParams.get('ss') ?? undefined;
  const spHasOffer = searchParams.get('sh') === 'true';

  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // M28.0 M661.6 — Unified Pagination: the page is URL-driven (deep-linkable),
  // a single `page` state derived from the URL search param. There is no second
  // local pagination state. Refresh / deep-link restore `page` from the URL.
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  // M28.0 M661.6 — SupplierProduct dimension facet bundle (brand / series /
  // commercial) served by the unified `/search` response. SearchPage never calls
  // the legacy `/search/supplier-models` endpoint.
  const [spFacets, setSpFacets] = useState<SupplierProductFacetBundle | null>(null);
  const [spFacetLoading, setSpFacetLoading] = useState(false);

  // Guards: skip the effect-triggered replace right after a load-more page bump.
  const skipNextPageEffect = useRef(false);
  // Tracks the last search context so a context change resets page to 1.
  // null = first mount (deep-link page restore must be preserved).
  const prevContextKey = useRef<string | null>(null);

  // Filter state — client-side only
  const [filter, setFilter] = useState<SearchFilterState>({ contentType: undefined, active: false });

  // Cache all-results for tab switching
  const cachedAllResults = useRef<UnifiedSearchResults | null>(null);
  const lastQuery = useRef<string>('');

  // ─── M24.1.4: Search Context + Facet Filter State ───

  const { context, loading: contextLoading } = useSearchContext(query);

  const {
    state: filterState,
    getActiveFilters,
    selectCategoryTab,
    toggleFilter,
    clearCategorySpecificFilters,
    clearAllFilters,
    resetAll,
  } = useFacetFilterState(buildInitialFacetState(searchParams));

  // Reset facet state when query changes
  const searchKey = query.trim();
  const filtersVersion = useRef(searchKey);
  useEffect(() => {
    if (filtersVersion.current !== searchKey) {
      filtersVersion.current = searchKey;
      resetAll();
    }
  }, [searchKey, resetAll]);

  // Derived active facet contract for the current query.
  // Zeroed until the filter state has been reset for the current query key
  // (prevents the previous query's filters from leaking into a new search).
  const activeFacet = useMemo<{ category: string | undefined; filters: Record<string, string[]> }>(() => {
    if (filtersVersion.current !== searchKey) {
      return { category: undefined, filters: {} };
    }
    const category = filterState.selectedCategoryTab;
    const merged = getActiveFilters(filterState);
    const filters: Record<string, string[]> = {};
    for (const [paramId, values] of Object.entries(merged)) {
      filters[paramId] = Array.from(values);
    }
    return { category, filters };
  }, [searchKey, filterState, getActiveFilters]);

  const hasActiveFacetFilter =
    activeFacet.category !== undefined || Object.keys(activeFacet.filters).length > 0;

  // Stable string key of the active facet. Used as the search effect dependency
  // instead of the `activeFacet` object so a *semantic* filter change triggers a
  // re-search, while identity churn (e.g. resetAll producing a fresh empty state
  // on query change) does NOT fire a duplicate search request.
  const facetKey = useMemo(() => {
    const filterStr = Object.entries(activeFacet.filters)
      .map(([pid, vals]) => `${pid}:${[...vals].sort().join(',')}`)
      .sort()
      .join(';');
    return `${activeFacet.category ?? ''}|${filterStr}`;
  }, [activeFacet]);

  // Sync facet filter state to URL (no React re-render)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Preserve q and type
    if (query) params.set('q', query);
    if (type !== 'all') params.set('type', type);
    else params.delete('type');

    // Category
    if (filterState.selectedCategoryTab) {
      params.set('category', filterState.selectedCategoryTab);
    } else {
      params.delete('category');
    }

    // Common filters
    const fcEncoded = encodeFilterValues(filterState.commonFilterValues);
    if (fcEncoded) {
      params.set('fc', fcEncoded);
    } else {
      params.delete('fc');
    }

    // Category-specific filters: f_<categoryId>
    // Remove all existing f_ params first
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith('f_')) params.delete(key);
    });
    Object.entries(filterState.categorySpecificFilterValues).forEach(([catId, fv]) => {
      const encoded = encodeFilterValues(fv);
      if (encoded) {
        params.set(`f_${catId}`, encoded);
      }
    });

    // SupplierProduct dimension facets (brand / series / hasOffer)
    if (spBrand) params.set('sb', spBrand);
    else params.delete('sb');
    if (spSeries) params.set('ss', spSeries);
    else params.delete('ss');
    if (spHasOffer) params.set('sh', 'true');
    else params.delete('sh');

    const newSearch = params.toString();
    const newUrl = `/search${newSearch ? `?${newSearch}` : ''}`;
    if (newUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [filterState, query, type, spBrand, spSeries, spHasOffer]);

  // M28.0 M661.5 — SupplierProduct facet toggle handlers (URL-driven, deep-linkable)
  const updateSpFacet = useCallback(
    (patch: { brand?: string; series?: string; hasOffer?: boolean }) => {
      const params = new URLSearchParams(window.location.search);
      if (patch.brand !== undefined) {
        if (patch.brand) params.set('sb', patch.brand);
        else params.delete('sb');
      }
      if (patch.series !== undefined) {
        if (patch.series) params.set('ss', patch.series);
        else params.delete('ss');
      }
      if (patch.hasOffer !== undefined) {
        if (patch.hasOffer) params.set('sh', 'true');
        else params.delete('sh');
      }
      const qs = params.toString();
      const url = `/search${qs ? `?${qs}` : ''}`;
      if (url !== `${window.location.pathname}${window.location.search}`) {
        router.replace(url, { scroll: false });
      }
    },
    [router],
  );

  const toggleSpBrand = useCallback(
    (value: string) => updateSpFacet({ brand: spBrand === value ? undefined : value }),
    [spBrand, updateSpFacet],
  );
  const toggleSpSeries = useCallback(
    (value: string) => updateSpFacet({ series: spSeries === value ? undefined : value }),
    [spSeries, updateSpFacet],
  );
  const toggleSpHasOffer = useCallback(
    () => updateSpFacet({ hasOffer: spHasOffer ? false : true }),
    [spHasOffer, updateSpFacet],
  );
  const clearSpFacet = useCallback(
    () => updateSpFacet({ brand: undefined, series: undefined, hasOffer: false }),
    [updateSpFacet],
  );

  // M28.0 M661.6 — SupplierProduct dimension facets are served by the unified
  // `/search` response (pagination-independent). No legacy `/search/supplier-models`
  // call: the facet bundle is captured inside executeSearch below.

  const executeSearch = useCallback(
    async (currentPage: number, append: boolean = false) => {
      if (!query.trim()) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(false);

      try {
        const data = await unifiedSearch({
          q: query.trim(),
          type,
          page: currentPage,
          pageSize: PAGE_SIZE,
          category: activeFacet.category,
          filters: activeFacet.filters,
          brand: spBrand,
          series: spSeries,
          hasOffer: spHasOffer,
        });

        if (!append) {
          trackEvent(buildEvent('search', {
            source: '/search',
            metadata: { query: query.trim(), type, totalResults: data.products.total + data.supplierProducts.total + data.knowledge.total + data.solutions.total + data.suppliers.total },
          }));
        }

        // M28.0 M661.6 — SupplierProduct dimension facets come from the unified
        // `/search` response (pagination-independent), not a legacy endpoint.
        if (data.supplierProductFacets) {
          setSpFacets(data.supplierProductFacets);
          setSpFacetLoading(false);
        }

        if (append && results) {
          setResults({
            ...data,
            products: {
              ...data.products,
              items: [...results.products.items, ...data.products.items],
            },
            supplierProducts: {
              ...data.supplierProducts,
              items: [...results.supplierProducts.items, ...data.supplierProducts.items],
            },
            knowledge: {
              ...data.knowledge,
              items: [...results.knowledge.items, ...data.knowledge.items],
            },
            solutions: {
              ...data.solutions,
              items: [...results.solutions.items, ...data.solutions.items],
            },
            suppliers: {
              ...data.suppliers,
              items: [...results.suppliers.items, ...data.suppliers.items],
            },
          });
        } else {
          setResults(data);
          if (type === 'all' && !hasActiveFacetFilter) {
            cachedAllResults.current = data;
            lastQuery.current = query.trim();
          }
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, type, results, activeFacet, hasActiveFacetFilter, spBrand, spSeries, spHasOffer],
  );

  // M28.0 M661.6 — Unified Search State: the search context key captures
  // query / type / facet / supplier facets. A context change resets page to 1;
  // a pure `page` change (deep-link / refresh / load-more) restores that page.
  const searchContextKey = `${query}|${type}|${facetKey}|${spBrand}|${spSeries}|${spHasOffer}`;

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      setError(false);
      setFilter({ contentType: undefined, active: false });
      return;
    }

    // A load-more page bump already appended results; skip the replace so the
    // appended list is not overwritten by a page-N-only fetch.
    if (skipNextPageEffect.current) {
      skipNextPageEffect.current = false;
      return;
    }

    // Reset page to 1 whenever the search context changes (type switch / facet
    // change / new query). First mount preserves the deep-linked `page`.
    if (prevContextKey.current === null) {
      prevContextKey.current = searchContextKey;
    } else if (prevContextKey.current !== searchContextKey) {
      prevContextKey.current = searchContextKey;
      if (page > 1) {
        const params = new URLSearchParams(window.location.search);
        params.delete('page');
        const qs = params.toString();
        router.replace(`/search${qs ? `?${qs}` : ''}`, { scroll: false });
        return;
      }
    }

    if (!hasActiveFacetFilter && type !== 'all' && cachedAllResults.current && lastQuery.current === query.trim()) {
      setResults({
        ...cachedAllResults.current,
        activeType: type,
      });
      setLoading(false);
      setError(false);
      return;
    }

    executeSearch(page, false);
  }, [query, type, facetKey, spBrand, spSeries, spHasOffer, page, searchContextKey, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    // Reflect the appended page in the URL so refresh / deep-link restore it.
    skipNextPageEffect.current = true;
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(nextPage));
    router.replace(`/search?${params.toString()}`, { scroll: false });
    executeSearch(nextPage, true);
  }, [page, executeSearch, router]);

  const handleRetry = useCallback(() => {
    setError(false);
    executeSearch(page, false);
  }, [page, executeSearch]);

  // Client-side content type filter logic
  const filteredResults = useMemo(() => {
    if (!results) return null;
    if (!filter.active) return results;

    const applyContentFilter = <T extends { type?: string }>(items: T[]): T[] => {
      if (!filter.contentType) return items;
      return items.filter(item => {
        const itemType = item.type as ContentTypeFilter;
        return itemType === filter.contentType;
      });
    };

    return {
      ...results,
      knowledge: {
        ...results.knowledge,
        items: applyContentFilter(results.knowledge.items),
      },
      solutions: {
        ...results.solutions,
        items: applyContentFilter(results.solutions.items),
      },
    };
  }, [results, filter]);

  const counts = results
    ? {
        product: results.products.total,
        'supplier-product': results.supplierProducts.total,
        knowledge: results.knowledge.total,
        solution: results.solutions.total,
        supplier: results.suppliers.total,
      }
    : undefined;

  const hasAnyResults = results
    ? results.products.total > 0 ||
      results.supplierProducts.total > 0 ||
      results.knowledge.total > 0 ||
      results.solutions.total > 0 ||
      results.suppliers.total > 0
    : false;

  const hasKeyword = query.trim().length > 0;

  const hasMore = results
    ? results.products.items.length < results.products.total ||
      results.supplierProducts.items.length < results.supplierProducts.total ||
      results.knowledge.items.length < results.knowledge.total ||
      results.solutions.items.length < results.solutions.total ||
      results.suppliers.items.length < results.suppliers.total
    : false;

  const shouldRenderSection = (domainType: SearchDomain, count: number): boolean => {
    if (type === 'all') return count > 0;
    return type === domainType;
  };

  const displayResults = filteredResults ?? results;

  // M24.1.4: Show facet when product results are visible and context is available
  // M28.0 M661.5: also show the parameter facet + supplier-model facet panel on
  // the supplier-product tab (capability category + tech params + brand/series).
  const showFacet =
    hasKeyword && (type === 'product' || type === 'supplier-product' || type === 'all') && !error;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Search Header — sticky */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile: compact search bar */}
          <div className="md:max-w-2xl md:mx-auto">
            <GlobalSearchBar
              initialKeyword={query}
              initialType={type}
              placeholder="搜索工业检测设备、知识、方案..."
            />
          </div>

          {hasKeyword && (
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500 md:max-w-2xl md:mx-auto">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                  正在搜索 &ldquo;{query}&rdquo;...
                </span>
              ) : error ? (
                <span className="text-red-500">搜索失败，请稍后重试</span>
              ) : results ? (
                <span>
                  搜索 &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
                  &nbsp;共找到{' '}
                  <strong className="text-foreground">
                    {results.products.total +
                      results.supplierProducts.total +
                      results.knowledge.total +
                      results.solutions.total +
                      results.suppliers.total}
                  </strong>{' '}
                  条结果
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Search Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {!hasKeyword ? (
          <SearchEmptyState type="no-keyword" />
        ) : (
          <>
            {/* Tabs + Filter Area */}
            <div className="space-y-3">
              <SearchTypeTabs
                activeType={type}
                query={query}
                counts={counts}
              />

              {/* Filter Bar — desktop beside tabs, mobile below */}
              <SearchFilter
                activeType={type}
                filter={filter}
                onChange={setFilter}
              />
            </div>

            {/* M24.1.4: Two-column layout — Facet Sidebar + Results */}
            <div className={`mt-4 sm:mt-6 ${showFacet ? 'lg:flex lg:gap-6' : ''}`}>
              {/* Parameter Facet Sidebar */}
              {showFacet && (
                <div className="lg:w-64 lg:flex-shrink-0 mb-4 lg:mb-0">
                  <div className="lg:sticky lg:top-36 space-y-4">
                    <ParameterFacet
                      context={context}
                      loading={contextLoading}
                      filterState={filterState}
                      onSelectCategoryTab={selectCategoryTab}
                      onToggleFilter={toggleFilter}
                      onClearCategorySpecific={clearCategorySpecificFilters}
                      onClearAll={clearAllFilters}
                    />

                    {/* M28.0 M661.5 — SupplierProduct dimension (brand / series / commercial) */}
                    {type === 'supplier-product' && (
                      <SupplierModelFacetPanel
                        facets={spFacets}
                        loading={spFacetLoading}
                        selected={{ brand: spBrand, series: spSeries, hasOffer: spHasOffer }}
                        onToggleBrand={toggleSpBrand}
                        onToggleSeries={toggleSpSeries}
                        onToggleHasOffer={toggleSpHasOffer}
                        onClear={clearSpFacet}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Results Area */}
              <div className={showFacet ? 'lg:flex-1 lg:min-w-0' : ''}>
                {!loading && !error && results && !hasAnyResults && (
                  <SearchEmptyState type="no-results" keyword={query} />
                )}

                {error && (
                  <ErrorState
                    message="搜索服务暂不可用，请稍后重试。"
                    onRetry={handleRetry}
                    action={{ label: '浏览产品分类', href: '/products' }}
                  />
                )}

                {/* Product Section */}
                {shouldRenderSection('product', results?.products.total ?? 0) && (
                  <SearchResultSection
                    title="产品"
                    count={displayResults?.products.total ?? 0}
                    loading={loading}
                    error={error}
                  >
                    {displayResults?.products.items.map((product) => (
                      <ProductResultCard
                        key={product.id}
                        product={product}
                        highlight={query}
                      />
                    ))}
                  </SearchResultSection>
                )}

                {/* SupplierProduct Section — M28.0 M661.5 unified discovery */}
                {shouldRenderSection('supplier-product', results?.supplierProducts.total ?? 0) && (
                  <SearchResultSection
                    title="供应商型号"
                    count={displayResults?.supplierProducts.total ?? 0}
                    loading={loading}
                    error={error}
                  >
                    {displayResults?.supplierProducts.items.map((item) => (
                      <SupplierProductResultCard
                        key={item.supplierProduct.id}
                        item={item}
                      />
                    ))}
                  </SearchResultSection>
                )}

                {/* Knowledge Section */}
                {shouldRenderSection('knowledge', results?.knowledge.total ?? 0) && (
                  <SearchResultSection
                    title="知识"
                    count={displayResults?.knowledge.total ?? 0}
                    loading={loading}
                    error={error}
                  >
                    {displayResults?.knowledge.items.map((content) => (
                      <KnowledgeResultCard
                        key={content.id}
                        content={content}
                        highlight={query}
                      />
                    ))}
                  </SearchResultSection>
                )}

                {/* Solution Section */}
                {shouldRenderSection('solution', results?.solutions.total ?? 0) && (
                  <SearchResultSection
                    title="解决方案"
                    count={displayResults?.solutions.total ?? 0}
                    loading={loading}
                    error={error}
                  >
                    {displayResults?.solutions.items.map((content) => (
                      <SolutionResultCard
                        key={content.id}
                        content={content}
                        highlight={query}
                      />
                    ))}
                  </SearchResultSection>
                )}

                {/* Supplier Section */}
                {shouldRenderSection('supplier', results?.suppliers.total ?? 0) && (
                  <SearchResultSection
                    title="供应商"
                    count={displayResults?.suppliers.total ?? 0}
                    loading={loading}
                    error={error}
                  >
                    {displayResults?.suppliers.items.map((supplier) => (
                      <SupplierResultCard
                        key={supplier.organizationId}
                        supplier={supplier}
                        highlight={query}
                      />
                    ))}
                  </SearchResultSection>
                )}

                {!loading && !error && results && !hasAnyResults && type !== 'all' && (
                  <SearchEmptyState
                    type="no-results-type"
                    keyword={query}
                    domain={type}
                  />
                )}

                {/* Load More */}
                {!loading && !loadingMore && !error && results && hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-industrial-sm transition-all"
                    >
                      加载更多结果
                    </button>
                  </div>
                )}

                {loadingMore && (
                  <div className="text-center mt-8">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                      <span className="w-3 h-3 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                      加载中...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}