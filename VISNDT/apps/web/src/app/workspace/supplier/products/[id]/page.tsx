'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import SupplierModelMediaParameters from '@/components/supplier-product/SupplierModelMediaParameters';
import { getMySupplierProduct } from '@/lib/api/supplier-self-service';
import type { MySupplierProduct } from '@/lib/api/supplier-self-service';

const MODEL_STATUS_LABEL: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  REVIEWING: '审核中',
  APPROVED: '已批准',
  PUBLISHED: '已发布',
  REJECTED: '已拒绝',
};

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

function detailTexts(model: MySupplierProduct): { label: string; value: string }[] {
  const list: { label: string; value: string }[] = [];
  if (model.description) list.push({ label: '产品描述', value: model.description });
  if (model.technicalDescription) list.push({ label: '技术描述', value: model.technicalDescription });
  if (model.applicationInfo) list.push({ label: '应用信息', value: model.applicationInfo });
  return list;
}

function SupplierProductDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [model, setModel] = useState<MySupplierProduct | null>(null);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]">
          <Loading />
        </div>
      </WorkspaceLayout>
    );
  }

  if (loadError || !model) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[1200px]">
          <ErrorState message={loadError || '未找到该型号。'} onRetry={() => void load()} />
        </div>
      </WorkspaceLayout>
    );
  }

  const modelLabel = `${model.brand ?? ''} ${model.series ?? ''} ${model.modelNumber ?? ''}`.trim();
  const texts = detailTexts(model);

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        <button
          type="button"
          onClick={() => router.push('/workspace/supplier/products')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← 返回我的产品
        </button>

        {/* 页面身份 */}
        <div>
          <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
            SUPPLIER · SUPPLIERPRODUCT
          </span>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{modelLabel}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            型号级（SupplierProduct）媒体与技术参数呈现。能力锚点为平台权威，仅可绑定、不可修改。
          </p>
        </div>

        {/* 型号身份卡 */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(model.status)}`}>
                  {statusLabel(model.status)}
                </span>
                {model.isPlaceholder && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                    平台占位 · 待完善真实型号
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600">
                能力锚点：<span className="font-medium text-slate-900">{model.platformProduct?.name ?? '—'}</span>
              </p>
              <p className="text-xs text-slate-400">
                型号（Model Number）：<span className="font-mono">{model.modelNumber}</span>
                {model.series ? <> · 系列：{model.series}</> : null}
                {model.brand ? <> · 品牌：{model.brand}</> : null}
              </p>
              <p className="text-xs text-slate-400">创建：{formatDateTime(model.createdAt)}</p>
            </div>
          </div>

          {texts.length > 0 && (
            <dl className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              {texts.map((t) => (
                <div key={t.label}>
                  <dt className="text-xs font-medium text-slate-500">{t.label}</dt>
                  <dd className="mt-0.5 text-sm whitespace-pre-line text-slate-700">{t.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Media + Parameters */}
        <SupplierModelMediaParameters
          media={model.media ?? []}
          parameterValues={model.parameterValues ?? []}
        />

        {/* Capability disclosure — 写入能力为治理能力，不做伪 CTA */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm sm:p-6">
          <h2 className="mb-1 text-sm font-semibold text-slate-900">说明</h2>
          <p>
            本页展示型号级媒体与技术参数（读取自真实的型号数据）。媒体与参数的更新属于组织治理 / 审核流程，
            本页为只读呈现，不提供无后端支撑的伪造编辑动作。平台能力定义的其余参数按能力默认呈现。
          </p>
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