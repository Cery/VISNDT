'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchDomain } from '@/services/search.service';
import { unifiedSearch } from '@/services/search.service';
import type { UnifiedSearchResults } from '@/services/search.service';
import { trackEvent, buildEvent } from '@/lib/analytics';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import SearchTypeTabs from '@/components/search/SearchTypeTabs';
import SearchFilter from '@/components/search/SearchFilter';
import type { SearchFilterState, ContentTypeFilter } from '@/components/search/SearchFilter';
import SearchResultSection from '@/components/search/SearchResultSection';
import SearchResultSummary from '@/components/search/SearchResultSummary';
import SearchEmptyState from '@/components/search/SearchEmptyState';
import SearchHero from '@/components/search/SearchHero';
import ErrorState from '@/components/common/ErrorState';
import ProductResultCard from '@/components/search/ProductResultCard';
import KnowledgeResultCard from '@/components/search/KnowledgeResultCard';
import SolutionResultCard from '@/components/search/SolutionResultCard';
import ProductSupplierContext from '@/components/search/ProductSupplierContext';
import type { SupplierModelCtx } from '@/components/search/ProductSupplierContext';
import { useSearchContext } from '@/hooks/useSearchContext';
import { useFacetFilterState } from '@/hooks/useFacetFilterState';
import type { FilterValues, FacetFilterState } from '@/hooks/useFacetFilterState';
import ParameterFacet from '@/components/search/ParameterFacet';
import EngineeringDiscoveryFraming from '@/components/search/EngineeringDiscoveryFraming';
import type { Product } from '@/types/product';

// 814 — Supplier / SupplierProduct are no longer active search types. Old URLs
// carrying type=supplier or type=supplier-product are gracefully ignored (→ all).
const VALID_TYPES: SearchDomain[] = ['all', 'product', 'knowledge', 'solution'];
const PAGE_SIZE = 20;

function parseType(raw: string | null): SearchDomain {
  if (raw && VALID_TYPES.includes(raw as SearchDomain)) {
    return raw as SearchDomain;
  }
  return 'all';
}

/** 814 — one Product-centered search entry: platform product + matching supplier-model context. */
interface SearchProductEntry {
  product: Product;
  /** true when the card is synthesized from a matching SupplierProduct's capability
   *  (products group was empty for a pure model / brand / series query). */
  derived: boolean;
  models: SupplierModelCtx[];
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

  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // M28.0 M661.6 — Unified Pagination: the page is URL-driven (deep-linkable),
  // a single `page` state derived from the URL search param. There is no second
  // local pagination state. Refresh / deep-link restore `page` from the URL.
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

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

  // M36 Engineering Discovery — query-level common technical parameters (the
  // intersection of the candidate capabilities' relevant parameter dimensions),
  // surfaced on Product / SupplierProduct result cards so the engineer sees
  // WHY each result is relevant. Sourced from the existing /search/context.
  const searchRelevantParams = useMemo(() => context?.commonFilters ?? [], [context]);

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

    const newSearch = params.toString();
    const newUrl = `/search${newSearch ? `?${newSearch}` : ''}`;
    if (newUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [filterState, query, type]);

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
        });

        if (!append) {
          // 814 — Supplier / SupplierProduct are supporting context, not top-level
          // result authorities. Total reflects Product + Knowledge + Solution only.
          const productLikeCount = data.products.items.length + data.supplierProducts.items.length;
          trackEvent(buildEvent('search', {
            source: '/search',
            metadata: { query: query.trim(), type, totalResults: productLikeCount + data.knowledge.total + data.solutions.total },
          }));
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
            suppliers: {
              ...data.suppliers,
              items: [...results.suppliers.items, ...data.suppliers.items],
            },
            knowledge: {
              ...data.knowledge,
              items: [...results.knowledge.items, ...data.knowledge.items],
            },
            solutions: {
              ...data.solutions,
              items: [...results.solutions.items, ...data.solutions.items],
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
    [query, type, results, activeFacet, hasActiveFacetFilter],
  );

  // M28.0 M661.6 — Unified Search State: the search context key captures
  // query / type / facet. A context change resets page to 1; a pure `page`
  // change (deep-link / refresh / load-more) restores that page.
  const searchContextKey = `${query}|${type}|${facetKey}`;

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
  }, [query, type, facetKey, page, searchContextKey, router]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // 814 — Product-centered aggregation. SupplierProduct matching models are folded
  // into the Platform Product as supporting context (WHICH MODEL / WHO), never as
  // independent primary results. Order preserves Product ranking; models from the
  // supplierProducts group attach to the matching capability id when present.
  const productEntries = useMemo<SearchProductEntry[]>(() => {
    if (!results) return [];
    const entries: SearchProductEntry[] = [];
    const entryById = new Map<string, SearchProductEntry>();
    const pushEntry = (p: Product, derived: boolean) => {
      const entry: SearchProductEntry = { product: p, derived, models: [] };
      entries.push(entry);
      entryById.set(p.id, entry);
    };
    for (const p of results.products.items) pushEntry(p, false);

    for (const item of results.supplierProducts.items ?? []) {
      const sp = item.supplierProduct;
      if (!sp) continue;
      const capId = item.capability?.id || sp.platformProductId;
      let entry = capId ? entryById.get(capId) : undefined;
      if (!entry) {
        // Products group had no match for this query (pure model / brand / series).
        // Derive the Platform Product card from the matching capability so the
        // model stays discoverable without SupplierProduct becoming an authority.
        const cap = item.capability;
        const pseudo: Product = {
          id: cap?.id || sp.platformProductId,
          categoryId: cap?.categoryId ?? '',
          name: cap?.name || sp.modelNumber || '产品型号',
          model: null,
          description: null,
          status: 'ACTIVE',
          createdAt: '',
          updatedAt: '',
          category: {
            id: cap?.categoryId ?? '',
            name: '',
            slug: '',
            parentId: null,
            createdAt: '',
            updatedAt: '',
          },
        };
        pushEntry(pseudo, true);
        entry = entryById.get(pseudo.id)!;
      }
      entry.models.push({
        organization: sp.organization ?? null,
        brand: sp.brand,
        series: sp.series,
        modelNumber: sp.modelNumber,
      });
    }
    return entries;
  }, [results]);

  const counts = results
    ? {
        product: productEntries.length,
        knowledge: results.knowledge.total,
        solution: results.solutions.total,
      }
    : undefined;

  const hasAnyResults = results
    ? productEntries.length > 0 ||
      results.knowledge.total > 0 ||
      results.solutions.total > 0
    : false;

  const hasKeyword = query.trim().length > 0;

  const hasMore = results
    ? results.products.items.length < results.products.total ||
      // SupplierProducts still drive pagination of the supporting model context.
      results.supplierProducts.items.length < results.supplierProducts.total ||
      results.knowledge.items.length < results.knowledge.total ||
      results.solutions.items.length < results.solutions.total
    : false;

  const shouldRenderSection = (domainType: SearchDomain, count: number): boolean => {
    if (type === 'all') return count > 0;
    return type === domainType;
  };

  const displayResults = filteredResults ?? results;

  // M24.1.4: Show facet when product results are visible and context is available
  const showFacet =
    hasKeyword && (type === 'product' || type === 'all') && !error;

  // 702_M29.2 — Search Hero: when no keyword is present, the first screen is the
  // Hero (the core capability-discovery entry). Results render only after a query.
  if (!hasKeyword) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <SearchHero />
      </div>
    );
  }

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
                    {productEntries.length +
                      results.knowledge.total +
                      results.solutions.total}
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
        {/* 842 WP-7 Discoverability — 页面级唯一 H1（P2-841-01 收口）：
            统一检索 Authority 的机器可读页面标题。作为稳定页面意图标题，
            始终渲染（query / loading / empty 状态共用一个 H1），不做重复关键词填充。 */}
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
          工业检测能力搜索
        </h1>

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

            {/* 703_M29.3 — Result Summary: immediately communicate discovered
                capability counts, grounded in existing /search response counts. */}
            {!loading && !error && results && hasAnyResults && (
              <SearchResultSummary
                total={productEntries.length + results.knowledge.total + results.solutions.total}
                counts={[
                  { label: '产品', value: productEntries.length },
                  { label: '检测方案', value: results.solutions.total },
                  { label: '知识', value: results.knowledge.total },
                ]}
              />
            )}

            {/* M36 Engineering Discovery IA framing — answers the discoverer's
                questions: what capability are you inspecting / which technical
                constraints matter. Derived from the existing /search/context. */}
            {!loading && !error && results && hasAnyResults && context && (
              <EngineeringDiscoveryFraming
                categories={context.relevantCategories}
                paramCount={context.commonFilters.length}
                totalParamValues={context.commonFilters.reduce(
                  (acc, p) => acc + p.availableValues.length,
                  0,
                )}
              />
            )}

            {/* 846 §20 Search Result Density — 移除装饰性大横幅，仅保留单行轻量工程连接入口
                （评估对比 / 发起检测需求 / 能力分类 从黑色 WORKBENCH 横幅降级到此） */}
            {!loading && !error && results && hasAnyResults && (
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 px-0.5">
                <span className="font-mono uppercase tracking-widest text-[10px] text-slate-400">
                  NEXT →
                </span>
                <Link href="/products/compare" className="hover:text-primary transition-colors">
                  评估对比
                </Link>
                <Link href="/workspace/demands/create" className="hover:text-primary transition-colors">
                  发起检测需求
                </Link>
                <Link href="/categories" className="hover:text-primary transition-colors">
                  能力分类
                </Link>
              </div>
            )}

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

                {/* 703_M29.3 — Capability Discovery IA ordering (814 aligned):
                    Product (Capability) primary → Solution → Knowledge.
                    SupplierProduct / Supplier appear only as context under Product. */}

                {/* Product Capability Section — 814 primary result authority.
                    SupplierProducts fold in as matching-model context; Suppliers
                    as contextual providers. Never rendered as independent cards. */}
                {shouldRenderSection('product', productEntries.length) && (
                  <SearchResultSection
                    title="产品"
                    count={productEntries.length}
                    loading={loading}
                    error={error}
                  >
                    {productEntries.map((entry) => (
                      <div key={entry.product.id} className="space-y-3">
                        <ProductResultCard
                          product={entry.product}
                          highlight={query}
                          relevantParams={searchRelevantParams}
                          activeParamFilters={activeFacet.filters}
                          supplierModelCount={entry.models.length}
                        />
                        <ProductSupplierContext models={entry.models} />
                      </div>
                    ))}
                  </SearchResultSection>
                )}

                {/* Solution Section — elevated to 检测方案 */}
                {shouldRenderSection('solution', results?.solutions.total ?? 0) && (
                  <SearchResultSection
                    title="检测方案"
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

                {/* Knowledge Section — auxiliary layer, below core capability */}
                {shouldRenderSection('knowledge', results?.knowledge.total ?? 0) && (
                  <SearchResultSection
                    title="相关知识"
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
      </div>
    </div>
  );
}