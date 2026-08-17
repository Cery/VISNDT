'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { SearchDomain } from '@/services/search.service';
import { unifiedSearch } from '@/services/search.service';
import type { UnifiedSearchResults } from '@/services/search.service';
import { trackEvent, buildEvent } from '@/lib/analytics';
import GlobalSearchBar from '@/components/search/GlobalSearchBar';
import SearchTypeTabs from '@/components/search/SearchTypeTabs';
import SearchFilter from '@/components/search/SearchFilter';
import type { SearchFilterState, ContentTypeFilter } from '@/components/search/SearchFilter';
import SearchResultSection from '@/components/search/SearchResultSection';
import SearchEmptyState from '@/components/search/SearchEmptyState';
import ProductResultCard from '@/components/search/ProductResultCard';
import KnowledgeResultCard from '@/components/search/KnowledgeResultCard';
import SolutionResultCard from '@/components/search/SolutionResultCard';
import SupplierResultCard from '@/components/search/SupplierResultCard';

const VALID_TYPES: SearchDomain[] = ['all', 'product', 'knowledge', 'solution', 'supplier'];
const PAGE_SIZE = 20;

function parseType(raw: string | null): SearchDomain {
  if (raw && VALID_TYPES.includes(raw as SearchDomain)) {
    return raw as SearchDomain;
  }
  return 'all';
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const type = parseType(searchParams.get('type'));

  const [results, setResults] = useState<UnifiedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  // Filter state — client-side only
  const [filter, setFilter] = useState<SearchFilterState>({ contentType: undefined, active: false });

  // Cache all-results for tab switching
  const cachedAllResults = useRef<UnifiedSearchResults | null>(null);
  const lastQuery = useRef<string>('');

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
        const data = await unifiedSearch({ q: query.trim(), type, page: currentPage, pageSize: PAGE_SIZE });

        if (!append) {
          trackEvent(buildEvent('search', {
            source: '/search',
            metadata: { query: query.trim(), type, totalResults: data.products.total + data.knowledge.total + data.solutions.total + data.suppliers.total },
          }));
        }

        if (append && results) {
          setResults({
            ...data,
            products: {
              ...data.products,
              items: [...results.products.items, ...data.products.items],
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
          setPage(currentPage);
          if (type === 'all') {
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
    [query, type, results],
  );

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      setError(false);
      setPage(1);
      setFilter({ contentType: undefined, active: false });
      return;
    }

    if (type !== 'all' && cachedAllResults.current && lastQuery.current === query.trim()) {
      setResults({
        ...cachedAllResults.current,
        activeType: type,
      });
      setLoading(false);
      setError(false);
      return;
    }

    executeSearch(1, false);
  }, [query, type]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    executeSearch(nextPage, true);
  }, [page, executeSearch]);

  const handleRetry = useCallback(() => {
    setError(false);
    setPage(1);
    executeSearch(1, false);
  }, [executeSearch]);

  // Client-side filter logic
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
        knowledge: results.knowledge.total,
        solution: results.solutions.total,
        supplier: results.suppliers.total,
      }
    : undefined;

  const hasAnyResults = results
    ? results.products.total > 0 ||
      results.knowledge.total > 0 ||
      results.solutions.total > 0 ||
      results.suppliers.total > 0
    : false;

  const hasKeyword = query.trim().length > 0;

  const hasMore = results
    ? results.products.items.length < results.products.total ||
      results.knowledge.items.length < results.knowledge.total ||
      results.solutions.items.length < results.solutions.total ||
      results.suppliers.items.length < results.suppliers.total
    : false;

  const shouldRenderSection = (domainType: SearchDomain, count: number): boolean => {
    if (type === 'all') return count > 0;
    return type === domainType;
  };

  const displayResults = filteredResults ?? results;

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

            <div className="mt-4 sm:mt-6">
              {!loading && !error && results && !hasAnyResults && (
                <SearchEmptyState type="no-results" keyword={query} />
              )}

              {error && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">搜索服务暂不可用</h3>
                  <p className="text-sm text-slate-400 mb-4">请稍后重试或浏览产品分类</p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-industrial-cyan rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                    </svg>
                    重新搜索
                  </button>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
}