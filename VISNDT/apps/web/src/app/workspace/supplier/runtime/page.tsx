'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import StatCard from '@/components/workspace/StatCard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getSupplierRuntimeProducts } from '@/services/workspace.service';
import type {
  WorkspaceSupplierProductItem,
} from '@/lib/api/workspace';

/**
 * Supplier Runtime — 661.3 M28.0 Capability Operation Boundary.
 * 664 M28.0 Supplier Product Management Scaling:
 *   - P2-A Pagination / Search / Status Filter / Series Filter (Backend contract
 *     stays the single GET /workspace/supplier/runtime/products entry, extended
 *     with page/pageSize/q/status/series query params).
 *   - P3 Status Tag / Badge visualization retained.
 * URL state (page/q/status/series) is persisted to the address bar for refresh
 * and deep-link survival. NOT a Marketplace / Seller Center — read-only.
 */

const PAGE_SIZE = 20;

const MODEL_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已批准',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

const STATUS_OPTIONS = Object.entries(MODEL_STATUS_LABEL).map(([value, label]) => ({
  value,
  label,
}));

function statusLabel(status: string): string {
  return MODEL_STATUS_LABEL[status] ?? status;
}

function statusTone(status: string): string {
  if (status === 'PUBLISHED') return 'bg-emerald-100 text-emerald-700';
  if (status === 'APPROVED') return 'bg-sky-100 text-sky-700';
  if (status === 'REJECTED') return 'bg-rose-100 text-rose-700';
  if (status === 'REVIEWING' || status === 'SUBMITTED') return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-600';
}

function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return '暂无';
  }
  return new Date(value).toLocaleString('zh-CN');
}

function SupplierModelRow({
  product,
  onSelected,
}: {
  product: WorkspaceSupplierProductItem;
  onSelected: (id: string) => void;
}) {
  const publishedOffers = product.commercialSummary.activeCount;
  const priceRange =
    product.commercialSummary.minPrice !== null &&
    product.commercialSummary.minPrice !== undefined
      ? `${formatPrice(product.commercialSummary.minPrice)} ~ ${formatPrice(
          product.commercialSummary.maxPrice,
        )}`
      : '未定价';

  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              {product.brand} {product.series ?? ''} {product.modelNumber}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(product.status)}`}
            >
              {statusLabel(product.status)}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            能力锚点（Platform Product）：{product.platformProduct.name}
          </p>
          <p className="text-xs text-slate-400">创建：{formatDateTime(product.createdAt)}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelected(product.id)}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
        >
          查看买方兴趣
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs text-slate-500">状态</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{statusLabel(product.status)}</p>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs text-slate-500">商用 Offer（汇总）</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{publishedOffers} 个有效</p>
        </div>
        <div className="rounded-lg bg-white p-3">
          <p className="text-xs text-slate-500">价格区间</p>
          <p className="mt-1 text-sm font-medium text-slate-900">{priceRange}</p>
        </div>
      </div>
    </article>
  );
}

function parseUrlState(): { page: number; q: string; status: string; series: string } {
  if (typeof window === 'undefined') return { page: 1, q: '', status: '', series: '' };
  const sp = new URLSearchParams(window.location.search);
  return {
    page: Math.max(1, Number(sp.get('page') ?? '1') || 1),
    q: sp.get('q') ?? '',
    status: sp.get('status') ?? '',
    series: sp.get('series') ?? '',
  };
}

function SupplierRuntimeContent() {
  const initial = useMemo(parseUrlState, []);
  const [q, setQ] = useState(initial.q);
  const [status, setStatus] = useState(initial.status);
  const [series, setSeries] = useState(initial.series);
  const [page, setPage] = useState(initial.page);
  const [searchInput, setSearchInput] = useState(initial.q);

  // Persist filter state to the address bar so refresh / deep-link survive.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (status) sp.set('status', status);
    if (series) sp.set('series', series);
    sp.set('page', String(page));
    window.history.replaceState(null, '', `?${sp.toString()}`);
  }, [q, status, series, page]);

  // Paged / filtered supplier product list.
  const productsQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'runtime', 'products', q, status, series, page],
    queryFn: () =>
      getSupplierRuntimeProducts({
        page,
        pageSize: PAGE_SIZE,
        q: q || undefined,
        status: status || undefined,
        series: series || undefined,
      }),
  });

  // Unfiltered overview used for capability stats + series/status filter options.
  const overviewQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'runtime', 'products', 'overview'],
    queryFn: () => getSupplierRuntimeProducts({ page: 1, pageSize: 100 }),
  });

  const allModels = overviewQuery.data?.data ?? [];
  const seriesOptions = useMemo(
    () =>
      Array.from(
        new Set(
          (overviewQuery.data?.data ?? [])
            .map((p) => p.series)
            .filter((x): x is string => !!x),
        ),
      ),
    [overviewQuery.data?.data],
  );

  const products = productsQuery.data?.data ?? [];
  const total = productsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const totalOffers = allModels.reduce(
    (sum, p) => sum + (p.commercialSummary?.activeCount ?? 0),
    0,
  );
  const publishedCount = allModels.filter((p) => p.status === 'PUBLISHED').length;
  const reviewingCount = allModels.filter((p) => p.status === 'REVIEWING').length;

  const openInquiryProduct = (id: string) => {
    window.location.href = `/workspace/supplier/runtime/products/${id}/inquiry-context`;
  };

  const applySearch = () => {
    setQ(searchInput.trim());
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput('');
    setQ('');
    setStatus('');
    setSeries('');
    setPage(1);
  };

  const goToPage = (nextPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, nextPage)));
  };

  const selectClass =
    'h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none';

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">供应商运行时（Supplier Runtime）</h1>
            <p className="mt-1 text-sm text-slate-500">
              供应商能力操作边界 — 只读查看自身 SupplierProduct、商用汇总与买方兴趣。不是商城、不是卖家中心。
            </p>
          </div>
        </div>

        {/* Capability Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">能力概览</h2>
          </div>

          {overviewQuery.isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <Loading />
            </div>
          ) : overviewQuery.isError || overviewQuery.data === undefined ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <ErrorState
                message="加载运行时数据失败，请稍后重试。"
                onRetry={() => void overviewQuery.refetch()}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="能力型号" value={overviewQuery.data.total} description="自身 SupplierProduct" icon="list" />
              <StatCard label="已发布" value={publishedCount} description="可供公开发现" icon="dashboard" />
              <StatCard label="有效 Offer" value={totalOffers} description="商用层汇总" icon="link" />
              <StatCard label="审核中" value={reviewingCount} description="待治理确认" icon="clock" />
            </div>
          )}
        </section>

        {/* Supplier Product Status */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-emerald-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">能力型号状态</h2>
          </div>

          {/* Toolbar: search / status filter / series filter / reset */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applySearch();
              }}
              placeholder="搜索品牌 / 系列 / 型号 / 能力名称…"
              className="h-9 w-64 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={applySearch}
              className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              搜索
            </button>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className={selectClass}
              aria-label="状态筛选"
            >
              <option value="">全部状态</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={series}
              onChange={(e) => {
                setSeries(e.target.value);
                setPage(1);
              }}
              className={selectClass}
              aria-label="系列筛选"
            >
              <option value="">全部系列</option>
              {seriesOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {(q || status || series || page > 1) && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                重置
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">
              共 {total} 条，第 {currentPage}/{totalPages} 页
            </span>
          </div>

          {productsQuery.isLoading ? (
            <Loading />
          ) : productsQuery.isError ? (
            <ErrorState
              message="加载能力型号失败，请稍后重试。"
              onRetry={() => void productsQuery.refetch()}
            />
          ) : products.length === 0 ? (
            <EmptyState message="当前筛选条件下暂无可展示的 SupplierProduct。" />
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <SupplierModelRow
                  key={product.id}
                  product={product}
                  onSelected={openInquiryProduct}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > PAGE_SIZE && !productsQuery.isError && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
                className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                上一页
              </button>
              <span className="text-sm text-slate-500">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
                className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                下一页
              </button>
            </div>
          )}
        </section>

        {/* Buyer Interest Snapshot */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-industrial-cyan rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">买方兴趣快照</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500">
            买方 Inquiry 在能力层（Platform Product）聚合呈现。选择上方某个型号的「查看买方兴趣」进入具体 Inquiry 上下文。
          </p>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            点击型号卡片中的「查看买方兴趣」按钮，查看关联 Inquiries 的只读列表。
          </div>
        </section>
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierRuntimePage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierRuntimeContent />
      </RoleGuard>
    </AuthGuard>
  );
}