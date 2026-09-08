'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import SupplierModelMediaEditor from '@/components/supplier-product/SupplierModelMediaEditor';
import SupplierModelParameterEditor from '@/components/supplier-product/SupplierModelParameterEditor';
import {
  getMySupplierProduct,
  updateMySupplierProduct,
  submitMySupplierProduct,
} from '@/lib/api/supplier-self-service';
import type { MySupplierProduct } from '@/lib/api/supplier-self-service';

/**
 * WP-5A — SupplierProduct Model Workbench.
 *
 * Object → Data → Action → State → Publication → Public Context.
 * Identity (editable) + Media Write (R1) + Parameter Write (R2) + Review/Submit.
 * Media / Parameter / Identity edits are gated to DRAFT / APPROVED (server-enforced).
 * The workbench surfaces the "next valid action" for the current lifecycle state.
 */

const MODEL_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已批准',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

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

function formatDateTime(value?: string | null): string {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

function nextActionFor(status: string): { message: string; cta: string | null } {
  switch (status) {
    case 'DRAFT':
      return { message: '草稿仅自己组织可见，可编辑媒体 / 参数 / 身份，完善后可提交审核。', cta: 'submit' };
    case 'REJECTED':
      return { message: '该型号已被拒绝。请回到 DRAFT 并修正后再提交。（当前需治理侧重新开放到 DRAFT）', cta: null };
    case 'SUBMITTED':
      return { message: '已提交平台治理审核，等待复核。审核期间不可编辑。', cta: null };
    case 'REVIEWING':
      return { message: '平台治理正在复核中。', cta: null };
    case 'APPROVED':
      return { message: '已批准（非公开状态）。可继续完善媒体 / 参数 / 身份；发布由平台治理执行。', cta: null };
    case 'PUBLISHED':
      return { message: '已发布，公开能力上下文可见当前媒体 / 参数。', cta: 'public' };
    default:
      return { message: '', cta: null };
  }
}

const inputClass =
  'w-full min-h-11 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-500 focus:outline-none focus:outline-2';
const labelClass = 'mb-1 block text-xs font-medium text-slate-500';

function SupplierProductDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [model, setModel] = useState<MySupplierProduct | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Identity inline edit state.
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [idForm, setIdForm] = useState<{ brand: string; series: string; modelNumber: string; description: string; technicalDescription: string; applicationInfo: string }>({
    brand: '', series: '', modelNumber: '', description: '', technicalDescription: '', applicationInfo: '',
  });
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [idError, setIdError] = useState('');
  const [idNotice, setIdNotice] = useState('');
  const [submitErr, setSubmitErr] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const detail = await getMySupplierProduct(id);
      setModel(detail);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : '加载型号失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const startEditIdentity = () => {
    if (!model) return;
    setIdForm({
      brand: model.brand ?? '',
      series: model.series ?? '',
      modelNumber: model.modelNumber ?? '',
      description: model.description ?? '',
      technicalDescription: model.technicalDescription ?? '',
      applicationInfo: model.applicationInfo ?? '',
    });
    setIdError('');
    setIdNotice('');
    setEditingIdentity(true);
  };

  const saveIdentity = async () => {
    setSavingIdentity(true);
    setIdError('');
    setIdNotice('');
    try {
      const updated = await updateMySupplierProduct(id, {
        brand: idForm.brand.trim(),
        series: idForm.series.trim() || null,
        modelNumber: idForm.modelNumber.trim(),
        description: idForm.description.trim() || null,
        technicalDescription: idForm.technicalDescription.trim() || null,
        applicationInfo: idForm.applicationInfo.trim() || null,
      });
      setModel(updated);
      setEditingIdentity(false);
      setIdNotice('型号身份已保存并经 API 持久化。');
    } catch (e) {
      setIdError(e instanceof Error ? e.message : '保存失败，请稍后重试。');
    } finally {
      setSavingIdentity(false);
    }
  };

  const submitReview = async () => {
    setSubmitErr('');
    try {
      const updated = await submitMySupplierProduct(id);
      setModel(updated);
      setIdNotice('已提交平台治理审核（DRAFT → SUBMITTED）。');
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : '提交失败，请稍后重试。');
    }
  };

  const reload = useCallback(async () => {
    const detail = await getMySupplierProduct(id);
    setModel(detail);
  }, [id]);

  if (isLoading) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]"><Loading /></div>
      </WorkspaceLayout>
    );
  }

  if (loadError || !model) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]"><ErrorState message={loadError || '未找到该型号。'} onRetry={() => void load()} /></div>
      </WorkspaceLayout>
    );
  }

  const modelLabel = `${model.brand ?? ''} ${model.series ?? ''} ${model.modelNumber ?? ''}`.trim();
  const editable = model.status === 'DRAFT' || model.status === 'APPROVED';
  const review = nextActionFor(model.status);

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        <button type="button" onClick={() => router.push('/workspace/supplier/products')} className="text-sm text-slate-500 hover:text-slate-700">
          ← 返回我的产品
        </button>

        {/* 页面身份 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">SUPPLIER · SUPPLIERPRODUCT · WORKBENCH</span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{modelLabel}</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              型号级工作台：身份 · 媒体 · 技术参数 · 审核 · 公开上下文。能力锚点为平台权威，仅可绑定、不可修改。
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone(model.status)}`}>{statusLabel(model.status)}</span>
            {model.isPlaceholder && (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">平台占位 · 待完善真实型号</span>
            )}
          </div>
        </div>

        {/* 生命周期 / 下一步卡片 */}
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="min-w-0 text-sm text-slate-600">{review.message}</div>
          <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
            {review.cta === 'submit' && (
              <button type="button" onClick={() => void submitReview()} className="inline-flex min-h-12 sm:min-h-11 items-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-500">
                提交审核 (DRAFT → SUBMITTED)
              </button>
            )}
            {review.cta === 'public' && model.platformProduct?.slug && (
              <Link href={`/products/${model.platformProduct.slug}`} className="inline-flex min-h-12 sm:min-h-11 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700">
                查看公开能力上下文 →
              </Link>
            )}
            {editable && !editingIdentity && (
              <button type="button" onClick={startEditIdentity} className="inline-flex min-h-12 sm:min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                编辑身份
              </button>
            )}
          </div>
        </section>

        {submitErr && <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitErr}</div>}
        {idNotice && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{idNotice}</div>}

        {/* Model Identity */}
        <section aria-labelledby="identity-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="identity-heading" className="text-base font-semibold text-slate-900">型号身份</h2>
              <p className="mt-1 text-xs text-slate-500">能力锚点：{model.platformProduct?.name ?? '—'}</p>
            </div>
          </div>

          {editingIdentity ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>品牌（Brand）*</label>
                <input type="text" value={idForm.brand} onChange={(e) => setIdForm((f) => ({ ...f, brand: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>系列（Series）</label>
                <input type="text" value={idForm.series} onChange={(e) => setIdForm((f) => ({ ...f, series: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>型号（Model Number）*</label>
                <input type="text" value={idForm.modelNumber} onChange={(e) => setIdForm((f) => ({ ...f, modelNumber: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>产品描述</label>
                <textarea rows={2} value={idForm.description} onChange={(e) => setIdForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>技术描述</label>
                <textarea rows={2} value={idForm.technicalDescription} onChange={(e) => setIdForm((f) => ({ ...f, technicalDescription: e.target.value }))} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>应用信息</label>
                <textarea rows={2} value={idForm.applicationInfo} onChange={(e) => setIdForm((f) => ({ ...f, applicationInfo: e.target.value }))} className={inputClass} />
              </div>
              {idError && <div className="sm:col-span-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{idError}</div>}
              <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2">
                <button type="button" onClick={() => setEditingIdentity(false)} className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm text-slate-600 hover:bg-slate-50">取消</button>
                <button type="button" onClick={() => void saveIdentity()} disabled={savingIdentity || !idForm.brand.trim() || !idForm.modelNumber.trim()} className="inline-flex min-h-11 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {savingIdentity ? '保存中…' : '保存身份'}
                </button>
              </div>
            </div>
          ) : (
            <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-slate-500">品牌</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{model.brand ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">系列</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{model.series ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">型号（Model Number）</dt>
                <dd className="mt-0.5 font-mono text-sm text-slate-900">{model.modelNumber ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">能力锚点</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{model.platformProduct?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">创建</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{formatDateTime(model.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">最近更新</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{formatDateTime(model.updatedAt)}</dd>
              </div>
              {model.description && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">产品描述</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-sm text-slate-700">{model.description}</dd>
                </div>
              )}
              {model.technicalDescription && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">技术描述</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-sm text-slate-700">{model.technicalDescription}</dd>
                </div>
              )}
              {model.applicationInfo && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">应用信息</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-sm text-slate-700">{model.applicationInfo}</dd>
                </div>
              )}
            </dl>
          )}
        </section>

        {/* Media Write (R1) */}
        <SupplierModelMediaEditor
          supplierProductId={model.id}
          media={model.media ?? []}
          editable={editable}
          onReload={reload}
        />

        {/* Parameter Write (R2) */}
        <SupplierModelParameterEditor model={model} editable={editable} onReload={reload} />

        {/* Public context continuity */}
        <section aria-labelledby="public-context-heading" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 id="public-context-heading" className="text-base font-semibold text-slate-900">公开上下文</h2>
          <p className="mt-1 text-xs text-slate-500">
            {model.status === 'PUBLISHED'
              ? '该型号已发布，以下公开产品上下文可见此型号的媒体与参数。'
              : '该型号尚未发布（非 PUBLIC），不会出现在公开发现中。发布后，公共产品上下文将呈现真实媒体与参数。'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {model.platformProduct?.slug ? (
              <>
                <Link href={`/products/${model.platformProduct.slug}`} className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 text-sm text-slate-700 hover:bg-slate-50">
                  查看平台能力详情（公开）
                </Link>
                {model.status === 'PUBLISHED' && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">媒体：{model.media?.length ?? 0} · 参数：{model.parameterValues?.length ?? 0}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-slate-400">未绑定公开能力锚点。</span>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">说明</h2>
          <ul className="list-inside list-disc space-y-1 leading-relaxed">
            <li>编辑（身份 / 媒体 / 参数）仅在 DRAFT / APPROVED 生效，由服务端强制；SUBMITTED / REVIEWING / PUBLISHED / REJECTED 不可改。</li>
            <li>供应商仅可管理自己的型号（组织隔离）；跨组织被明确 DENIED。</li>
            <li>未发布型号不会出现在公开发现；媒体与参数遵循同一发布边界。</li>
            <li>本页不涉及报价 / 库存 / 商城等商用能力（另有 Offer 流程治理）。</li>
          </ul>
        </section>
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        {id ? <SupplierProductDetailContent id={id} /> : null}
      </RoleGuard>
    </AuthGuard>
  );
}