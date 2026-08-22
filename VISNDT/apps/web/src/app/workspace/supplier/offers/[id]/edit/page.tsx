'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getOffer, updateOffer, submitOffer, withdrawOffer } from '@/services/offer.service';

const OFFER_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

function OfferStatusBadge({ status }: { status: string }) {
  const label = OFFER_STATUS_LABELS[status] ?? status;
  const colorMap: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600',
    SUBMITTED: 'bg-blue-100 text-blue-700',
    ACCEPTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-rose-100 text-rose-700',
    WITHDRAWN: 'bg-amber-100 text-amber-700',
  };
  const colorClass = colorMap[status] ?? 'bg-slate-100 text-slate-600';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

function OfferEditContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.id as string;

  const offerQuery = useQuery({
    queryKey: ['offer', id],
    queryFn: () => getOffer(id),
    enabled: !!id,
  });

  const offer = offerQuery.data;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('CNY');
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Initialize form values from offer data
  if (offer && !initialized) {
    setTitle(offer.title);
    setDescription(offer.description ?? '');
    setPrice(offer.price ? String(offer.price) : '');
    setCurrency(offer.currency ?? 'CNY');
    setInitialized(true);
  }

  const isDraft = offer?.status === 'DRAFT';
  const isSubmitted = offer?.status === 'SUBMITTED';
  const isEditable = isDraft;

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
        setError('请填写 Offer 标题。');
        return;
      }

      setSaving(true);
      setError(null);
      setSuccess(null);

      try {
        await updateOffer(id, {
          title: title.trim(),
          description: description.trim() || undefined,
          price: price ? Number(price) : undefined,
          currency: currency || undefined,
        });
        setSuccess('Offer 已保存。');
        offerQuery.refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '保存失败，请稍后重试。';
        setError(message);
      } finally {
        setSaving(false);
      }
    },
    [id, title, description, price, currency, offerQuery],
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await submitOffer(id);
      setSuccess('Offer 已提交。');
      offerQuery.refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '提交失败，请稍后重试。';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }, [id, offerQuery]);

  const handleWithdraw = useCallback(async () => {
    setWithdrawing(true);
    setError(null);
    setSuccess(null);

    try {
      await withdrawOffer(id);
      setSuccess('Offer 已撤回。');
      offerQuery.refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '撤回失败，请稍后重试。';
      setError(message);
    } finally {
      setWithdrawing(false);
    }
  }, [id, offerQuery]);

  if (offerQuery.isLoading) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[720px]">
          <Loading />
        </div>
      </WorkspaceLayout>
    );
  }

  if (offerQuery.isError || !offer) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[720px]">
          <ErrorState
            message="加载 Offer 失败，请稍后重试。"
            onRetry={() => offerQuery.refetch()}
          />
        </div>
      </WorkspaceLayout>
    );
  }

  // Verify ownership
  if (user?.organizationId && offer.organizationId !== user.organizationId) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[720px]">
          <ErrorState message="您无权编辑此 Offer。" />
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[720px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">编辑报价</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isDraft ? '编辑草稿报价并提交。' : '查看报价详情与状态。'}
            </p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>

        {/* Offer Info Summary */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">报价概览</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">产品编号</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{offer.productId}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">所属组织</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {offer.organization?.name ?? '未命名组织'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">创建时间</p>
              <p className="mt-1 text-sm text-slate-700">{formatDateTime(offer.createdAt)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">更新时间</p>
              <p className="mt-1 text-sm text-slate-700">{formatDateTime(offer.updatedAt)}</p>
            </div>
          </div>
        </section>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">报价信息</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Offer 标题 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={!isEditable}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                disabled={!isEditable}
                placeholder="描述您的供应能力..."
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">价格</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  disabled={!isEditable}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">货币</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  disabled={!isEditable}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="CNY">CNY (人民币)</option>
                  <option value="USD">USD (美元)</option>
                  <option value="EUR">EUR (欧元)</option>
                  <option value="JPY">JPY (日元)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {isDraft && (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? '保存中...' : '保存草稿'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? '提交中...' : '提交 Offer'}
                </button>
              </>
            )}
            {isSubmitted && (
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
              >
                {withdrawing ? '撤回中...' : '撤回 Offer'}
              </button>
            )}
            <button
              type="button"
              onClick={() => router.push('/workspace/supplier/offers')}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              返回列表
            </button>
          </div>
        </form>
      </div>
    </WorkspaceLayout>
  );
}

export default function OfferEditPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <OfferEditContent />
      </RoleGuard>
    </AuthGuard>
  );
}