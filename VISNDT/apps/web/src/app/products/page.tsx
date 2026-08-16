'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product.service';
import { getCategories } from '@/services/category.service';
import { getFilterParameterDefinitions } from '@/services/parameter-definition.service';
import type { ProductParameterFilter } from '@/types/product';
import { trackEvent, buildEvent } from '@/lib/analytics';
import SearchBar from '@/components/products/SearchBar';
import ProductFilter from '@/components/products/ProductFilter';
import ProductGrid from '@/components/products/ProductGrid';
import CompareBar from '@/components/products/CompareBar';
import Pagination from '@/components/common/Pagination';
import ErrorState from '@/components/common/ErrorState';

/**
 * Read filter state from URL search params.
 * Enables: URL restore, browser back/forward, shareable search URLs.
 */
function readStateFromURL(searchParams: URLSearchParams) {
  const keyword = searchParams.get('keyword') ?? '';
  const categoryId = searchParams.get('categoryId') ?? undefined;
  const sortBy = (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'name') || 'createdAt';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  let parameterFilters: ProductParameterFilter[] = [];
  try {
    const raw = searchParams.get('pf');
    if (raw) {
      const parsed = JSON.parse(decodeURIComponent(raw));
      if (Array.isArray(parsed)) {
        parameterFilters = parsed.filter(
          (f: unknown) =>
            typeof f === 'object' &&
            f !== null &&
            'parameterDefinitionId' in (f as Record<string, unknown>),
        ) as ProductParameterFilter[];
      }
    }
  } catch {
    // Invalid JSON in URL — ignore
  }

  return { keyword, categoryId, sortBy, sortOrder, page, parameterFilters };
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial state from URL
  const initialState = useMemo(() => readStateFromURL(searchParams), [searchParams]);

  const [keyword, setKeyword] = useState(initialState.keyword);
  const [categoryId, setCategoryId] = useState<string | undefined>(initialState.categoryId);
  const [sortBy, setSortBy] = useState(initialState.sortBy);
  const [sortOrder, setSortOrder] = useState(initialState.sortOrder);
  const [page, setPage] = useState(initialState.page);
  const [parameterFilters, setParameterFilters] = useState<ProductParameterFilter[]>(
    initialState.parameterFilters,
  );
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Sync state to URL (replace, not push — avoids bloating browser history)
  const syncURL = useCallback(
    (
      kw: string,
      catId: string | undefined,
      sb: string,
      so: string,
      pg: number,
      pf: ProductParameterFilter[],
    ) => {
      const params = new URLSearchParams();
      if (kw) params.set('keyword', kw);
      if (catId) params.set('categoryId', catId);
      if (sb !== 'createdAt') params.set('sortBy', sb);
      if (so !== 'desc') params.set('sortOrder', so);
      if (pg > 1) params.set('page', String(pg));
      if (pf.length > 0) params.set('pf', encodeURIComponent(JSON.stringify(pf)));

      const qs = params.toString();
      router.replace(qs ? `/products?${qs}` : '/products', { scroll: false });
    },
    [router],
  );

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const { data: parameterDefinitionsData } = useQuery({
    queryKey: ['parameter-definitions'],
    queryFn: () => getFilterParameterDefinitions(),
  });

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', keyword, categoryId, sortBy, sortOrder, page, parameterFilters],
    queryFn: () =>
      getProducts({
        keyword: keyword || undefined,
        categoryId,
        sortBy: sortBy as 'createdAt' | 'updatedAt' | 'name',
        sortOrder: sortOrder as 'asc' | 'desc',
        page,
        pageSize: 12,
        status: 'ACTIVE',
        parameterFilters,
      }),
  });

  const handleSearch = useCallback(
    (kw: string) => {
      setKeyword(kw);
      setPage(1);
      syncURL(kw, categoryId, sortBy, sortOrder, 1, parameterFilters);
      trackEvent(buildEvent('product_filter', { source: '/products', metadata: { action: 'search', keyword: kw } }));
    },
    [categoryId, sortBy, sortOrder, parameterFilters, syncURL],
  );

  const handleClearSearch = useCallback(() => {
    // Called when user clicks X in search bar
  }, []);

  const handleCategoryChange = useCallback(
    (catId: string | undefined) => {
      setCategoryId(catId);
      setPage(1);
      syncURL(keyword, catId, sortBy, sortOrder, 1, parameterFilters);
      trackEvent(buildEvent('product_filter', { source: '/products', metadata: { action: 'category', categoryId: catId } }));
    },
    [keyword, sortBy, sortOrder, parameterFilters, syncURL],
  );

  const handleSortChange = useCallback(
    (field: string, order: string) => {
      const sb = field as 'createdAt' | 'updatedAt' | 'name';
      const so = order as 'asc' | 'desc';
      setSortBy(sb);
      setSortOrder(so);
      setPage(1);
      syncURL(keyword, categoryId, field, order, 1, parameterFilters);
      trackEvent(buildEvent('product_filter', { source: '/products', metadata: { action: 'sort', sortBy: field, sortOrder: order } }));
    },
    [keyword, categoryId, parameterFilters, syncURL],
  );

  const handleParameterFilterChange = useCallback(
    (filters: ProductParameterFilter[]) => {
      setParameterFilters(filters);
      setPage(1);
      syncURL(keyword, categoryId, sortBy, sortOrder, 1, filters);
      trackEvent(buildEvent('product_filter', { source: '/products', metadata: { action: 'parameter', filterCount: filters.length } }));
    },
    [keyword, categoryId, sortBy, sortOrder, syncURL],
  );

  const handlePageChange = useCallback(
    (pg: number) => {
      setPage(pg);
      syncURL(keyword, categoryId, sortBy, sortOrder, pg, parameterFilters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [keyword, categoryId, sortBy, sortOrder, parameterFilters, syncURL],
  );

  const handleClearAll = useCallback(() => {
    setKeyword('');
    setCategoryId(undefined);
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
    setParameterFilters([]);
    setCompareIds([]);
    syncURL('', undefined, 'createdAt', 'desc', 1, []);
  }, [syncURL]);

  const handleCompareToggle = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 4) return prev; // max 4
      return [...prev, id];
    });
  }, []);

  const handleCompareRemove = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const handleCompareClear = useCallback(() => {
    setCompareIds([]);
  }, []);

  const categories = categoriesData?.data ?? [];
  const parameterDefinitions = parameterDefinitionsData ?? [];

  // Active filter count
  const hasActiveFilters =
    keyword !== '' || categoryId !== undefined || parameterFilters.length > 0;

  const activeFilterCount =
    (keyword ? 1 : 0) + (categoryId ? 1 : 0) + parameterFilters.length;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">产品</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">浏览工业检测设备</p>
          </div>
          
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-full sm:max-w-lg">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          initialValue={keyword}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar Filter */}
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilter
            categories={categories}
            selectedCategoryId={categoryId}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            parameterDefinitions={parameterDefinitions}
            parameterFilters={parameterFilters}
            onParameterFilterChange={handleParameterFilterChange}
            hasActiveFilters={hasActiveFilters}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">
                已筛选 {activeFilterCount} 项：
              </span>
              {keyword && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  关键词: {keyword}
                  <button
                    type="button"
                    onClick={() => handleSearch('')}
                    className="hover:text-primary/70"
                    aria-label="清除关键词"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </span>
              )}
              {categoryId && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  分类已选
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(undefined)}
                    className="hover:text-primary/70"
                    aria-label="清除分类"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </span>
              )}
              {parameterFilters.length > 0 && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  参数筛选 x{parameterFilters.length}
                  <button
                    type="button"
                    onClick={() => handleParameterFilterChange([])}
                    className="hover:text-primary/70"
                    aria-label="清除参数筛选"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <path d="M2 2l6 6M8 2l-6 6" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-1"
              >
                清除全部
              </button>
            </div>
          )}

          {isError ? (
            <ErrorState
              message={error instanceof Error ? error.message : '加载产品失败'}
            />
          ) : (
            <>
              <ProductGrid
                products={productsData?.data ?? []}
                isLoading={isLoading}
                totalCount={productsData?.total}
                hasActiveFilters={hasActiveFilters}
                searchKeyword={keyword}
                currentPage={page}
                compareIds={compareIds}
                onCompareToggle={handleCompareToggle}
              />
              <Pagination
                currentPage={page}
                totalPages={productsData?.totalPages ?? 1}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Compare Bar — floating bottom bar */}
      <CompareBar
        compareIds={compareIds}
        products={productsData?.data ?? []}
        onRemove={handleCompareRemove}
        onClear={handleCompareClear}
      />
    </div>
  );
}

/**
 * Products page with URL-synced search state.
 * Suspense boundary required for useSearchParams() in Next.js App Router.
 */
export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
}