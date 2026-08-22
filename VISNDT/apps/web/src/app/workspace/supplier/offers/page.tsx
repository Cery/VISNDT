'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getOffers } from '@/services/offer.service';

const OFFER_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

const OFFER_STATUS_FILTERS = [
  { label: '全部', value: '' },
  { label: '草稿', value: 'DRAFT' },
  { label: '已提交', value: 'SUBMITTED' },
  { label: '已接受', value: 'ACCEPTED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '已撤回', value: 'WITHDRAWN' },
] as const;

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

function OfferListContent() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const offersQuery = useQuery({
    queryKey: ['offers', 'supplier', user?.organizationId, statusFilter, page],
    queryFn: () =>
      getOffers({
        organizationId: user?.organizationId ?? undefined,
        status: statusFilter || undefined,
        page,
        pageSize,
      }),
    enabled: !!user?.organizationId,
  });

  const offers = useMemo(() => offersQuery.data?.data ?? [], [offersQuery.data]);
  const total = offersQuery.data?.total ?? 0;
  const totalPages = offersQuery.data?.totalPages ?? 1;

  const statusCounts = useMemo(() => {
    if (!user?.organizationId) return {};
    const counts: Record<string, number> = { total: total };
    for (const o of offers) {
      counts[o.status] = (counts[o.status] || 0) + 1;
    }
    return counts;
  }, [offers, total, user?.organizationId]);

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">我的报价</h1>
            <p className="mt-1 text-sm text-slate-500">
              管理您的供应能力报价，查看状态并创建新的报价。
            </p>
          </div>
          <Link
            href="/workspace/supplier/offers/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建报价
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {OFFER_STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
              {f.value && statusCounts[f.value] ? ` (${statusCounts[f.value]})` : ''}
            </button>
          ))}
        </div>

        {/* Offer List */}
        {offersQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Loading />
          </div>
        ) : offersQuery.isError ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState
              message="加载报价列表失败，请稍后重试。"
              onRetry={() => offersQuery.refetch()}
            />
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState
              message={statusFilter ? '当前筛选条件下没有报价。' : '暂无报价，点击上方按钮创建第一个报价。'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <Link
                key={offer.id}
                href={`/workspace/supplier/offers/${offer.id}/edit`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                    {offer.title}
                  </h3>
                  <OfferStatusBadge status={offer.status} />
                </div>
                {offer.description && (
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2">{offer.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  {offer.price && (
                    <span className="rounded bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
                      {offer.currency ?? 'CNY'} {Number(offer.price).toLocaleString()}
                    </span>
                  )}
                  <span>创建于 {formatDateTime(offer.createdAt)}</span>
                </div>
                {offer.organization && (
                  <p className="mt-2 text-xs text-slate-400">
                    {offer.organization.name ?? '未命名组织'}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              上一页
            </button>
            <span className="text-sm text-slate-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierOffersPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <OfferListContent />
      </RoleGuard>
    </AuthGuard>
  );
}