'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import {
  getMySupplierProducts,
  getMySupplierProduct,
  createMySupplierProduct,
  updateMySupplierProduct,
  submitMySupplierProduct,
} from '@/lib/api/supplier-self-service';
import type { MySupplierProduct } from '@/lib/api/supplier-self-service';
import { getProducts } from '@/services/product.service';
import { attachSupplierProduct } from '@/services/workspace.service';
import type { Product } from '@/types/product';

/**
 * 820 SupplierProduct Self-Service Foundation — My Products.
 *
 * Own-model management surface for an ENABLED supplier organization:
 *   My Products
 *     ↓ Attach Platform Product (挂靠 → org-owned DRAFT placeholder)
 *     ↓ Create / Edit Draft Model (新增/编辑，真实品牌/型号)
 *     ↓ Save
 *
 * Create / Edit are org-scoped server-side (/supplier-products/my*). All UI
 * is responsive (375/768/1024/1440). Explicit non-goals of 820 (media,
 * parameters, offers, search authority, SEO, marketplace) are NOT shown here.
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

function formatDateTime(value?: string | null): string {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

type FormState = {
  brand: string;
  series: string;
  modelNumber: string;
  description: string;
  technicalDescription: string;
  applicationInfo: string;
};

const EMPTY_FORM: FormState = {
  brand: '',
  series: '',
  modelNumber: '',
  description: '',
  technicalDescription: '',
  applicationInfo: '',
};

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

/** Create/Edit own model modal (820). */
function ModelFormModal({
  open,
  mode,
  existing,
  onClose,
  onSaved,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  existing: MySupplierProduct | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [platform, setPlatform] = useState<Product | null>(null);
  const [platformSearch, setPlatformSearch] = useState('');
  const [platformList, setPlatformList] = useState<Product[]>([]);
  const [platformLoading, setPlatformLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever modal opens / target changes.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSubmitting(false);
    if (mode === 'edit' && existing) {
      setForm({
        brand: existing.brand ?? '',
        series: existing.series ?? '',
        modelNumber: existing.modelNumber ?? '',
        description: existing.description ?? '',
        technicalDescription: existing.technicalDescription ?? '',
        applicationInfo: existing.applicationInfo ?? '',
      });
      setPlatform(null);
    } else {
      setForm(EMPTY_FORM);
      setPlatform(null);
      setPlatformList([]);
      setPlatformSearch('');
    }
  }, [open, mode, existing]);

  const searchPlatform = async () => {
    setPlatformLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page: 1, pageSize: 50, keyword: platformSearch.trim() || undefined });
      setPlatformList(res.data ?? []);
    } catch {
      setPlatformList([]);
    } finally {
      setPlatformLoading(false);
    }
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canSave =
    ((mode === 'create' && !!platform) || mode === 'edit') &&
    form.brand.trim().length > 0 &&
    form.modelNumber.trim().length > 0;

  const submit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const base = {
        brand: form.brand.trim(),
        series: form.series.trim() || null,
        modelNumber: form.modelNumber.trim(),
        description: form.description.trim() || null,
        technicalDescription: form.technicalDescription.trim() || null,
        applicationInfo: form.applicationInfo.trim() || null,
      };
      if (mode === 'edit') {
        await updateMySupplierProduct(existing!.id, base);
        onSaved('型号已保存。');
      } else {
        await createMySupplierProduct({ ...base, platformProductId: platform!.id });
        onSaved('已为你创建归属本组织的供应商型号草稿（DRAFT）。');
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败，请稍后重试。');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={mode === 'create' ? '新增供应商型号' : '编辑供应商型号'}>
      <div className="w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl max-h-[90vh]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'create' ? '新增供应商型号' : '编辑供应商型号'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              归属你的组织。能力锚点（Platform Product）为平台权威，仅可绑定、不可修改。
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="关闭">
            关闭
          </button>
        </div>

        {mode === 'create' && (
          <div className="mt-4">
            <label className={labelClass}>绑定平台能力（Platform Product）*</label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={platformSearch}
                onChange={(e) => setPlatformSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void searchPlatform(); }}
                placeholder="搜索平台能力名称…"
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={() => void searchPlatform()} disabled={platformLoading} className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">
                {platformLoading ? '加载中…' : '搜索'}
              </button>
            </div>
            {platform ? (
              <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-slate-900 bg-slate-100 px-3 py-2 text-sm text-slate-900">
                <span className="break-words">{platform.name}</span>
                <button type="button" onClick={() => setPlatform(null)} className="shrink-0 text-xs text-slate-500 hover:text-slate-800">
                  重选
                </button>
              </div>
            ) : (
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                {platformList.length === 0 ? (
                  <p className="py-3 text-center text-xs text-slate-400">
                    {platformLoading ? '加载中…' : '输入关键词搜索并选择平台能力。'}
                  </p>
                ) : (
                  platformList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-slate-400"
                    >
                      <span className="block w-full break-words font-medium">{p.name}</span>
                      {p.model ? <span className="mt-0.5 block text-xs text-slate-400">型号：{p.model}</span> : null}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {mode === 'edit' && existing && (
          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            能力锚点：{existing.platformProduct?.name ?? '—'} · 当前状态：
            <span className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(existing.status)}`}>
              {statusLabel(existing.status)}
            </span>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>品牌（Brand）*</label>
            <input type="text" value={form.brand} onChange={(e) => set('brand', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>系列（Series）</label>
            <input type="text" value={form.series} onChange={(e) => set('series', e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>型号（Model Number）*</label>
            <input type="text" value={form.modelNumber} onChange={(e) => set('modelNumber', e.target.value)} className={inputClass} />
            <p className="mt-1 text-[11px] text-slate-400">同一平台能力下，不同型号使用不同的真实型号标识。</p>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>产品描述</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>技术描述</label>
            <textarea value={form.technicalDescription} onChange={(e) => set('technicalDescription', e.target.value)} rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>应用信息</label>
            <textarea value={form.applicationInfo} onChange={(e) => set('applicationInfo', e.target.value)} rows={2} className={inputClass} />
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50">
            取消
          </button>
          <button type="button" onClick={() => void submit()} disabled={!canSave || submitting} className="h-9 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            {submitting ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Supplier product self-service content (list + create/edit + attach). */
function SupplierProductsContent() {
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  const [formState, setFormState] = useState<{ open: boolean; mode: 'create' | 'edit'; existing: MySupplierProduct | null }>({ open: false, mode: 'create', existing: null });
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachProducts, setAttachProducts] = useState<Product[]>([]);
  const [attachSearch, setAttachSearch] = useState('');
  const [attachLoading, setAttachLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Product | null>(null);
  const [attaching, setAttaching] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);

  const listQuery = useQuery({
    queryKey: ['supplier-self-service', 'my', q, status, page],
    queryFn: () => getMySupplierProducts({ page, pageSize: PAGE_SIZE, keyword: q || undefined, status: status || undefined }),
  });

  const products = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const openCreate = () => setFormState({ open: true, mode: 'create', existing: null });
  const openEdit = (id: string) => {
    // Load full detail (including descriptions) before editing.
    void getMySupplierProduct(id).then((detail) => {
      setFormState({ open: true, mode: 'edit', existing: detail });
    });
  };

  const onSaved = (msg: string) => {
    setNotice(msg);
    void listQuery.refetch();
  };

  const submitProduct = async (id: string) => {
    try {
      await submitMySupplierProduct(id);
      setNotice('已提交平台治理审核（DRAFT → SUBMITTED）。');
    } catch (e) {
      setNotice('提交失败：' + (e instanceof Error ? e.message : '请稍后重试。'));
    }
    void listQuery.refetch();
  };

  const openAttach = () => {
    setAttachOpen(true);
    setAttachError(null);
    setSelectedPlatform(null);
    setAttachProducts([]);
    setAttachSearch('');
  };

  const searchAttachProducts = async () => {
    setAttachLoading(true);
    setAttachError(null);
    try {
      const res = await getProducts({ page: 1, pageSize: 50, keyword: attachSearch.trim() || undefined });
      setAttachProducts(res.data ?? []);
    } catch {
      setAttachProducts([]);
      setAttachError('加载平台能力失败，请稍后重试。');
    } finally {
      setAttachLoading(false);
    }
  };

  const confirmAttach = async () => {
    if (!selectedPlatform) return;
    setAttaching(true);
    setAttachError(null);
    try {
      const result = await attachSupplierProduct(selectedPlatform.id);
      setNotice(result.alreadyAttached ? `「${selectedPlatform.name}」此前已挂靠（返回既有记录），未创建重复草稿。` : `已为「${selectedPlatform.name}」创建归属本组织的挂靠草稿（DRAFT，待完善真实型号信息后提交治理）。`);
      setAttachOpen(false);
      void listQuery.refetch();
    } catch (e) {
      setAttachError(e instanceof Error ? e.message : '挂靠失败，请稍后重试。');
    } finally {
      setAttaching(false);
    }
  };

  const searchList = () => { setQ(searchInput.trim()); setPage(1); };
  const resetFilters = () => { setSearchInput(''); setQ(''); setStatus(''); setPage(1); };

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的产品（My Products）</h1>
            <p className="mt-1 text-sm text-slate-500">
              供应商型号（SupplierProduct）自助管理 —— 挂靠平台能力、新增/编辑自己的型号草稿并保存。能力锚点为平台权威，仅可绑定、不可修改。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openAttach} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              + 挂靠平台能力
            </button>
            <button type="button" onClick={openCreate} className="h-10 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700">
              + 新增型号
            </button>
          </div>
        </div>

        {notice && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {notice}
          </div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') searchList(); }}
              placeholder="搜索品牌 / 系列 / 型号 / 描述…"
              className="h-9 w-full max-w-xs rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none"
            />
            <button type="button" onClick={searchList} className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700">
              搜索
            </button>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none"
              aria-label="状态筛选"
            >
              <option value="">全部状态</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {(q || status || page > 1) && (
              <button type="button" onClick={resetFilters} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50">
                重置
              </button>
            )}
            <span className="ml-auto text-xs text-slate-400">共 {total} 条，第 {currentPage}/{totalPages} 页</span>
          </div>

          {listQuery.isLoading ? (
            <Loading />
          ) : listQuery.isError ? (
            <ErrorState message="加载型号失败，请稍后重试。" onRetry={() => void listQuery.refetch()} />
          ) : products.length === 0 ? (
            <EmptyState message="暂无 SupplierProduct。可点击「挂靠平台能力」或「新增型号」开始。" />
          ) : (
            <div className="space-y-4">
              {products.map((p) => (
                <article key={p.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="break-words text-sm font-semibold text-slate-900">
                          {p.brand} {p.series ?? ''} {p.modelNumber}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(p.status)}`}>
                          {statusLabel(p.status)}
                        </span>
                        {p.isPlaceholder && (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                            平台占位 · 待完善真实型号
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        能力锚点：{p.platformProduct?.name ?? '—'}
                      </p>
                      <p className="text-xs text-slate-400">创建：{formatDateTime(p.createdAt)}</p>
                    </div>
                    {(p.status === 'DRAFT' || p.status === 'APPROVED') && (
                      <button
                        type="button"
                        onClick={() => openEdit(p.id)}
                        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
                      >
                        编辑
                      </button>
                    )}
                    {p.status === 'DRAFT' && (
                      <button
                        type="button"
                        onClick={() => void submitProduct(p.id)}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500"
                      >
                        提交审核
                      </button>
                    )}
                  </div>
                  {p.description ? <p className="mt-2 text-xs text-slate-600">{p.description}</p> : null}
                </article>
              ))}
            </div>
          )}

          {total > PAGE_SIZE && !listQuery.isError && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
              <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">
                上一页
              </button>
              <span className="text-sm text-slate-500">{currentPage} / {totalPages}</span>
              <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50">
                下一页
              </button>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500 shadow-sm sm:p-6">
          <h2 className="mb-2 text-base font-semibold text-slate-900">说明</h2>
          <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed">
            <li>草稿（DRAFT）状态：仅你自己组织可见，不会进入公开发现。</li>
            <li>带「平台占位」标识的型号：由“挂靠”自动生成，brand/型号仍为平台派生的占位值，需编辑为真实供应商信息后再进入治理/发布。</li>
            <li>本页不涉及报价、库存、商城等商用能力（另有 Offer 流程治理）。</li>
          </ul>
        </section>
      </div>

      <ModelFormModal
        open={formState.open}
        mode={formState.mode}
        existing={formState.existing}
        onClose={() => setFormState({ open: false, mode: 'create', existing: null })}
        onSaved={onSaved}
      />

      {attachOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label="挂靠平台能力">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">挂靠平台能力</h2>
                <p className="mt-1 text-xs text-slate-500">选择平台已有能力（Platform Product，平台权威）并创建归属本组织的挂靠草稿。</p>
              </div>
              <button type="button" onClick={() => setAttachOpen(false)} className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="关闭">
                关闭
              </button>
            </div>

            {attachError && <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{attachError}</div>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={attachSearch}
                onChange={(e) => setAttachSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void searchAttachProducts(); }}
                placeholder="搜索平台能力名称…"
                className="w-full flex-1 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none sm:w-56"
              />
              <button type="button" onClick={() => void searchAttachProducts()} disabled={attachLoading} className="h-9 rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50">
                搜索
              </button>
            </div>

            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
              {attachLoading ? (
                <p className="py-6 text-center text-sm text-slate-400">加载中…</p>
              ) : attachProducts.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-400">输入关键词搜索，或留空搜索全部平台能力。</p>
              ) : (
                attachProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${selectedPlatform?.id === p.id ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'}`}
                  >
                    <span className="block w-full break-words font-medium">{p.name}</span>
                    {p.model ? <span className="mt-0.5 block text-xs text-slate-400">型号：{p.model}</span> : null}
                  </button>
                ))
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button type="button" onClick={() => setAttachOpen(false)} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-600 hover:bg-slate-50">
                取消
              </button>
              <button type="button" onClick={() => void confirmAttach()} disabled={!selectedPlatform || attaching} className="h-9 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
                {attaching ? '挂靠中…' : '确认挂靠'}
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}

export default function SupplierProductsPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierProductsContent />
      </RoleGuard>
    </AuthGuard>
  );
}