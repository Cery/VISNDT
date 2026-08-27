'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getMyInquiries } from '@/services/inquiry.service';

const INQUIRY_STATUS_LABELS: Record<string, string> = {
  NEW: '新询价',
  PROCESSING: '跟进中',
  REPLIED: '已回复',
  CLOSED: '已关闭',
};

function InquiryStatusBadge({ status }: { status: string }) {
  const label = INQUIRY_STATUS_LABELS[status] ?? status;
  const colorMap: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-amber-100 text-amber-700',
    REPLIED: 'bg-emerald-100 text-emerald-700',
    CLOSED: 'bg-slate-100 text-slate-600',
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

function InquiryListContent() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const pageSize = 12;

  const inquiriesQuery = useQuery({
    queryKey: ['inquiries', 'supplier', statusFilter, page],
    queryFn: () => getMyInquiries(page, pageSize),
  });

  const all = useMemo(() => inquiriesQuery.data?.data ?? [], [inquiriesQuery.data]);
  const total = inquiriesQuery.data?.total ?? 0;
  const totalPages = inquiriesQuery.data?.totalPages ?? 1;

  const filtered = useMemo(() => {
    if (!statusFilter) return all;
    return all.filter((i) => i.status === statusFilter);
  }, [all, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const i of all) counts[i.status] = (counts[i.status] || 0) + 1;
    return counts;
  }, [all]);

  const filters = [
    { label: '全部', value: '' },
    ...Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => ({ label, value })),
  ];

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">收到的询价</h1>
          <p className="mt-1 text-sm text-slate-500">
            来自采购方 / 访客的能力询价线索，含针对的能力、联系人与当前状态。
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
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

        {/* List */}
        {inquiriesQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Loading />
          </div>
        ) : inquiriesQuery.isError ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message="加载询价列表失败，请稍后重试。" onRetry={() => inquiriesQuery.refetch()} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState
              message={statusFilter ? '当前筛选条件下没有询价。' : '暂无收到的询价。'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((inq) => (
              <Link
                key={inq.id}
                href={`/workspace/supplier/inquiries/${inq.id}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                    {inq.productName || '未命名能力'}
                  </h3>
                  <InquiryStatusBadge status={inq.status} />
                </div>
                {inq.organizationName && (
                  <p className="mt-2 text-xs text-slate-400">
                    目标：{inq.organizationName}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded bg-slate-50 px-2 py-0.5 font-medium text-slate-600">
                    {inq.contactName}
                  </span>
                  <span>{inq.contactEmail}</span>
                </div>
                {inq.message && (
                  <p className="mt-3 text-sm text-slate-500 line-clamp-2">{inq.message}</p>
                )}
                <p className="mt-3 text-xs text-slate-400">提交于 {formatDateTime(inq.createdAt)}</p>
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
              {page} / {totalPages}（共 {total} 条）
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

export default function SupplierInquiriesPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <InquiryListContent />
      </RoleGuard>
    </AuthGuard>
  );
}