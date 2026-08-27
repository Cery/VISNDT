'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getInquiryById } from '@/services/inquiry.service';

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

function InquiryDetailContent() {
  const params = useParams();
  const id = params.id as string;

  const inquiryQuery = useQuery({
    queryKey: ['inquiry', id],
    queryFn: () => getInquiryById(id),
    enabled: !!id,
  });

  if (inquiryQuery.isLoading) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[720px]">
          <Loading />
        </div>
      </WorkspaceLayout>
    );
  }

  if (inquiryQuery.isError || !inquiryQuery.data) {
    return (
      <WorkspaceLayout>
        <div className="mx-auto max-w-[720px]">
          <ErrorState message="加载询价详情失败，请稍后重试。" onRetry={() => inquiryQuery.refetch()} />
        </div>
      </WorkspaceLayout>
    );
  }

  const inq = inquiryQuery.data;

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[720px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">询价详情</h1>
            <p className="mt-1 text-sm text-slate-500">
              编号 {inq.id.slice(0, 8)}… · 提交于 {formatDateTime(inq.createdAt)}
            </p>
          </div>
          <InquiryStatusBadge status={inq.status} />
        </div>

        {/* Capability Context */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">询价对象</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">针对能力</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{inq.productName || '未命名能力'}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">能力提供方</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {inq.organizationName || '未命名组织'}
              </dd>
            </div>
          </dl>
        </section>

        {/* Contact + Message */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">询价内容</h2>
          <dl className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">联系人</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{inq.contactName || '—'}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">邮箱</dt>
                <dd className="mt-1 text-sm text-slate-800 break-all">{inq.contactEmail || '—'}</dd>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">联系电话</dt>
              <dd className="mt-1 text-sm text-slate-900">{inq.contactPhone || '—'}</dd>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">询价留言</dt>
              <dd className="mt-2 text-sm whitespace-pre-wrap text-slate-700">{inq.message || '—'}</dd>
            </div>
          </dl>
        </section>

        {/* Back */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/workspace/supplier/inquiries"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            返回询价列表
          </Link>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierInquiryDetailPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <InquiryDetailContent />
      </RoleGuard>
    </AuthGuard>
  );
}