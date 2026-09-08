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
import { getSupplierRuntimeProducts, attachSupplierProduct } from '@/services/workspace.service';
import { getProducts } from '@/services/product.service';
import type {
  WorkspaceSupplierProductItem,
} from '@/lib/api/workspace';
import type { Product } from '@/types/product';

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
  return MODEL_STATUS_LABEL[status] ?? '未知状态';
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
  // SSR 与首次客户端渲染保持一致（默认值），避免在渲染期读 window 引发 Hydration 不匹配。
  // 挂载后一次性从 URL 恢复分页/检索/过滤状态（深链/刷新语义保留）。
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [series, setSeries] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const restored = parseUrlState();
    setQ(restored.q);
    setStatus(restored.status);
    setSeries(restored.series);
    setPage(restored.page);
    setSearchInput(restored.q);
  }, []);

  // 817 Supplier Attach — associate an existing Platform Product with this org.
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachProducts, setAttachProducts] = useState<Product[]>([]);
  const [attachSearch, setAttachSearch] = useState('');
  const [attachLoading, setAttachLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Product | null>(null);
  const [attaching, setAttaching] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [attachNotice, setAttachNotice] = useState<{ ok: boolean; message: string } | null>(null);

  const openAttach = () => {
    setAttachOpen(true);
    setAttachError(null);
    setAttachNotice(null);
    setSelectedPlatform(null);
    setAttachProducts([]);
    setAttachSearch('');
  };

  // Search existing Platform Products (public /admin-managed platform authority).
  const searchAttachProducts = async () => {
    setAttachLoading(true);
    setAttachError(null);
    setAttachNotice(null);
    try {
      const res = await getProducts({
        page: 1,
        pageSize: 50,
        keyword: attachSearch.trim() || undefined,
      });
      setAttachProducts(res.data ?? []);
    } catch {
      setAttachError('加载平台产品失败，请稍后重试。');
      setAttachProducts([]);
    } finally {
      setAttachLoading(false);
    }
  };

  // Confirm: create a NEW organization-owned SupplierProduct DRAFT from the chosen
  // Platform Product. The platform product itself is never created/mutated.
  const confirmAttach = async () => {
    if (!selectedPlatform) return;
    setAttaching(true);
    setAttachError(null);
    setAttachNotice(null);
    try {
      const result = await attachSupplierProduct(selectedPlatform.id);
      setAttachNotice({
        ok: true,
        message: result.alreadyAttached
          ? `「${selectedPlatform.name}」此前已挂靠（返回既有记录），未创建重复草稿。`
          : `已为「${selectedPlatform.name}」创建归属贵组织的供应商型号草稿（DRAFT），待平台治理审核/发布。`,
      });
      setSelectedPlatform(null);
      setAttachSearch('');
      setAttachProducts([]);
      // Refresh draft list + overview so the new Draft is visible immediately.
      void productsQuery.refetch();
      void overviewQuery.refetch();
    } catch (e) {
      const msg = e instanceof Error ? e.message : '挂靠失败，请稍后重试。';
      setAttachError(msg);
    } finally {
      setAttaching(false);
    }
  };

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
              供应商操作边界 — 查看自身产品型号、商用汇总、买方兴趣；并可把平台既有产品挂靠到自己组织。不是商城、不是卖家中心。
            </p>
          </div>
          <button
            type="button"
            onClick={openAttach}
            className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            + 挂靠平台能力
          </button>
        </div>

        {/* Capability Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">产品概览</h2>
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 items-start">
              <StatCard label="产品型号" value={overviewQuery.data.total} description="我的产品型号" icon="list" />
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
            <h2 className="text-lg font-semibold text-slate-900">产品型号状态</h2>
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
              message="加载产品型号失败，请稍后重试。"
              onRetry={() => void productsQuery.refetch()}
            />
          ) : products.length === 0 ? (
            <EmptyState message="当前筛选条件下暂无可展示的产品型号。" />
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

      {/* 817 Attach modal — select existing Platform Product → create org-owned DRAFT */}
      {attachOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="挂靠平台能力"
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">挂靠平台能力</h2>
                <p className="mt-1 text-xs text-slate-500">
                  选择一个**平台既有能力**（Platform Product，平台定义、平台权威），将其挂靠为你们组织自己的供应商型号草稿。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAttachOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="关闭"
              >
                关闭
              </button>
            </div>

            <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
              <p>
                <b>平台能力（Platform Product）</b> = 平台定义的能力/产品（只读，不可由供应商新增或修改）。
              </p>
              <p className="mt-1">
                <b>你们的供应商型号（Supplier Product）</b> = 归属你们组织的自建实现（草稿，待平台治理审核/发布）。
              </p>
              <p className="mt-1">
                挂靠≠新增平台能力、≠认领他人型号、≠共享型号；仅创建一个归属贵组织的新草稿。
              </p>
            </div>

            {attachNotice && (
              <div
                className={`mt-3 rounded-md border px-3 py-2 text-sm ${
                  attachNotice.ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                {attachNotice.message}
              </div>
            )}
            {attachError && (
              <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {attachError}
              </div>
            )}

            <div className="mt-4">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={attachSearch}
                  onChange={(e) => setAttachSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void searchAttachProducts();
                  }}
                  placeholder="搜索平台能力名称…"
                  className="h-9 w-full flex-1 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none sm:w-56"
                />
                <button
                  type="button"
                  onClick={() => void searchAttachProducts()}
                  disabled={attachLoading}
                  className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
                >
                  搜索
                </button>
              </div>

              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {attachLoading ? (
                  <p className="py-6 text-center text-sm text-slate-400">加载中…</p>
                ) : attachProducts.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-400">
                    输入关键词搜索，或留空搜索全部平台能力。
                  </p>
                ) : (
                  attachProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlatform(p)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedPlatform?.id === p.id
                          ? 'border-slate-900 bg-slate-100 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="block w-full break-words font-medium">{p.name}</span>
                      {p.model ? (
                        <span className="mt-0.5 block text-xs text-slate-400">型号：{p.model}</span>
                      ) : null}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAttachOpen(false)}
                className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => void confirmAttach()}
                disabled={!selectedPlatform || attaching}
                className="h-9 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {attaching ? '挂靠中…' : '确认挂靠'}
              </button>
            </div>
          </div>
        </div>
      )}
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