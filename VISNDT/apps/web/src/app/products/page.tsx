'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product.service';
import { getCategories } from '@/services/category.service';
import { getFilterParameterDefinitions, getCategoryFilterParameterDefinitions } from '@/services/parameter-definition.service';
import type { ProductParameterFilter } from '@/types/product';
import { trackEvent, buildEvent } from '@/lib/analytics';
import { translateCategoryName } from '@/lib/translate';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import PageContainer from '@/components/common/PageContainer';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';
import SearchBar from '@/components/products/SearchBar';
import ProductFilter from '@/components/products/ProductFilter';
import MobileFilterDrawer from '@/components/products/MobileFilterDrawer';
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
  const [filterOpen, setFilterOpen] = useState(false);

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
    // 811 Batch A (D1): 公共目录焦点回归自动刷新。
    // 811 修补 (D1 跟进): refetchOnMount:'always' —— 修复「产品中心页分类筛选」在纯客户端路由跳转下仍命中 60s 新鲜缓存、不重拉导致的删除分类残留。
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  // 参数定义：有分类上下文时仅加载该分类 ACTIVE 产品实际使用的参数；
  // 无分类时回退为全站参数定义（保持兼容）。
  const { data: parameterDefinitionsData } = useQuery({
    queryKey: categoryId
      ? ['category-parameters', categoryId]
      : ['parameter-definitions'],
    queryFn: () =>
      categoryId
        ? getCategoryFilterParameterDefinitions(categoryId)
        : getFilterParameterDefinitions(),
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
    // 811 Batch A (D1): 公共产品列表焦点回归自动刷新。
    refetchOnWindowFocus: true,
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
      // 切换分类后参数筛选面板切换为「该分类上下文参数」，旧分类参数筛选失效，需清零避免误过滤
      setParameterFilters([]);
      setPage(1);
      syncURL(keyword, catId, sortBy, sortOrder, 1, []);
      trackEvent(buildEvent('product_filter', { source: '/products', metadata: { action: 'category', categoryId: catId } }));
    },
    [keyword, sortBy, sortOrder, syncURL],
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
    <div className="min-h-screen bg-surface-0">
      {/* 工业检测能力中心 Header 带（M33.3 结构性重组：Dark Technical Band + 分类能力铁轨 + mono 数据锚点） */}
      <div className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
        {/* 受控技术网格 */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
        <PageContainer variant="content" paddingY={40}>
          <div className="max-w-4xl relative">
            <IndustrialBadge label="工业检测能力发现 · 能力中心" tone="cyan" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-5 tracking-tight">
            工业检测能力注册表
          </h1>
          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            面向工业无损检测的能力发现平台。围绕检测场景、技术参数与能力状态，从注册能力中定位匹配的设备与方案。
          </p>
          {/* mono 数据锚点：注册能力总数 */}
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <span className="font-mono text-lg font-bold text-white tabular-nums">
              {productsData?.total ?? '—'}
            </span>
            <span className="text-xs text-slate-400">项已注册检测能力</span>
          </div>
          </div>

          {/* 分类能力铁轨 rail（保留既有 onCategoryChange 行为） */}
          {categories.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {categories.slice(0, 8).map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCategoryChange(c.id)}
                  className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                    categoryId === c.id
                      ? 'bg-primary/20 text-white border-primary/50'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-primary/40 hover:text-white'
                  }`}
                >
                  <span className="font-mono opacity-50 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                  <span>{translateCategoryName(c.name)}</span>
                  <span className="opacity-60">检测能力</span>
                </button>
              ))}
            </div>
          )}
        </PageContainer>
      </div>

      <PageContainer variant="content" paddingY={28}>
        {/* M38 最终实现补齐 — 跨面发现收束：产品中心 → 分类 → 知识 → 方案 → 统一检索 */}
        <div className="mb-6">
          <EngineeringDiscoveryNav activeLabel="检测产品" />
        </div>

        {/* 802 — Capability Evaluation ribbon: contextual + next-action（工程评估语境，非电商价格） */}
        <div className="mb-6 rounded-xl border border-slate-200/80 bg-surface-1 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-industrial-cyan mb-1">
                CAPABILITY EVALUATION
              </p>
              <p className="text-sm text-foreground">
                {categoryId && categories.length
                  ? `正在评估“${categories.find((c) => c.id === categoryId)?.name ? translateCategoryName(categories.find((c) => c.id === categoryId)!.name) : '所选能力'}”检测能力`
                  : '从工程语义出发，按能力、参数与状态评估注册检测能力'}
                {parameterFilters.length > 0 ? ` · ${parameterFilters.length} 项参数约束` : ''}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                以技术参数与工程适用性开展确定性能力评估，不做商品化比价。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => router.push('/products/compare')}
                className="inline-flex items-center gap-1 rounded-lg border border-primary/30 text-primary text-sm font-medium px-3 py-1.5 hover:border-primary hover:bg-primary/5 transition-colors"
              >
                评估对比<span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={() => router.push('/search')}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 text-foreground text-sm font-medium px-3 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
              >
                统一检索相关参数<span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-full sm:max-w-lg">
          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            initialValue={keyword}
            placeholder="搜索检测能力、技术参数或型号..."
          />
        </div>

        {/* 移动端筛选入口（< lg 显示） */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center gap-2 w-full sm:w-auto bg-white border border-slate-200 text-foreground text-sm font-medium px-4 py-2.5 rounded-lg hover:border-primary/40 hover:text-primary transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
              <path d="M2 3.5h10M3.5 7h7M5.5 10.5h3" />
            </svg>
            筛选{activeFilterCount > 0 ? `（${activeFilterCount}）` : ''}
          </button>
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

      {/* 移动端筛选抽屉 */}
      <MobileFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="筛选能力"
      >
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
      </MobileFilterDrawer>

      {/* Compare Bar — floating bottom bar */}
      <CompareBar
        compareIds={compareIds}
        products={productsData?.data ?? []}
        onRemove={handleCompareRemove}
        onClear={handleCompareClear}
      />

      {/* 占位：已选择对比时给底部固定 CompareBar 预留空间，避免遮挡最后一项内容 */}
      {compareIds.length > 0 && <div className="h-20" aria-hidden="true" />}
      </PageContainer>
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