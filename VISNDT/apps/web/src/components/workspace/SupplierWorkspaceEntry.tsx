'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import StatCard from '@/components/workspace/StatCard';
import WorkspaceIdentityBar from '@/components/workspace/WorkspaceIdentityBar';
import { useAuth } from '@/auth/AuthProvider';
import {
  getSupplierWorkspaceOverview,
  getSupplierWorkspaceResponses,
} from '@/services/workspace.service';
import { getOffers } from '@/services/offer.service';
import { getAvailableRfqs } from '@/services/rfq.service';

function formatStatusCounts(statusCounts?: Record<string, number>) {
  const entries = Object.entries(statusCounts ?? {}).filter(([, count]) => count > 0);
  if (entries.length === 0) {
    return '暂无状态统计';
  }
  return entries.slice(0, 3).map(([status, count]) => `${status} ${count}`).join(' / ');
}

const SUPPLIER_QUICK_ITEMS = [
  { title: 'RFQ 机会', description: '查看定向询价机会', href: '/workspace/supplier/rfqs', icon: '📄' },
  { title: '商机中心', description: '发现公开 RFQ 机会', href: '/workspace/supplier/opportunities', icon: '🎯' },
  { title: '我的响应', description: '跟踪响应状态与历史', href: '/workspace/supplier/responses', icon: '📨' },
  { title: '我的 Offer', description: '管理供应能力 Offer', href: '/workspace/supplier/offers', icon: '📦' },
  { title: '企业资料', description: '维护企业身份与公开资料', href: '/workspace/supplier/profile', icon: '🏢' },
  { title: '展示管理', description: '管理能力展示', href: '/workspace/supplier/display', icon: '📋' },
] as const;

/**
 * Supplier Workspace SaaS Experience — Capability Provider entry layer.
 */
export default function SupplierWorkspaceEntry() {
  const { user } = useAuth();

  const overviewQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'overview'],
    queryFn: getSupplierWorkspaceOverview,
  });

  const responsesQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'responses'],
    queryFn: getSupplierWorkspaceResponses,
  });

  const offersQuery = useQuery({
    queryKey: ['offers', 'supplier', 'entry'],
    queryFn: () => getOffers({ organizationId: user?.organizationId ?? undefined, pageSize: 1 }),
    enabled: !!user?.organizationId,
  });

  const availableRfqsQuery = useQuery({
    queryKey: ['rfqs', 'available', 'entry'],
    queryFn: () => getAvailableRfqs({ pageSize: 1 }),
  });

  const responses = responsesQuery.data ?? [];
  const submittedCount = responses.filter((r) => r.status === 'SUBMITTED').length;
  const pendingCount = responses.filter(
    (r) => r.status !== 'ACCEPTED' && r.status !== 'REJECTED',
  ).length;
  const acceptedCount = responses.filter((r) => r.status === 'ACCEPTED').length;

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <WorkspaceIdentityBar
        title="供应商工作空间"
        subtitle="面向能力提供侧的询价响应与商机跟进入口。围绕 RFQ 机会、响应进度与能力展示，快速掌握当前业务状态并明确下一步行动。"
        roleLabel="Supplier · 供应商"
        roleHint="能力提供侧（Capability Provider）"
        roleTone="amber"
      />

      {/* Business Snapshot */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">业务快照</h2>
        </div>

        {overviewQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white">
            <Loading />
          </div>
        ) : overviewQuery.isError || !overviewQuery.data ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState
              message="加载业务快照失败，请稍后重试。"
              onRetry={() => overviewQuery.refetch()}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <StatCard
              label="待处理 RFQ"
              value={overviewQuery.data.rfqSummary.total}
              description={formatStatusCounts(overviewQuery.data.rfqSummary.statusCounts)}
              icon="📄"
            />
            <StatCard
              label="已提交响应"
              value={overviewQuery.data.responseSummary.total}
              description={formatStatusCounts(overviewQuery.data.responseSummary.statusCounts)}
              icon="📨"
            />
            <StatCard
              label="匹配机会"
              value={overviewQuery.data.matchSummary.total}
              description={formatStatusCounts(overviewQuery.data.matchSummary.statusCounts)}
              icon="🔗"
            />
            <StatCard
              label="公开 RFQ"
              value={availableRfqsQuery.data?.total ?? 0}
              description="可参与报价"
              icon="🎯"
            />
            <StatCard
              label="我的 Offer"
              value={offersQuery.data?.total ?? 0}
              description="供应能力 Offer"
              icon="📦"
            />
            <StatCard
              label="未读通知"
              value={overviewQuery.data.notificationSummary.unreadCount}
              description="条未读消息"
              icon="🔔"
            />
          </div>
        )}
      </section>

      {/* Response Progress (Pending Actions) */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-amber-400 rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">响应进度</h2>
        </div>

        {responsesQuery.isLoading ? (
          <Loading />
        ) : responsesQuery.isError ? (
          <ErrorState
            message="加载响应进度失败，请稍后重试。"
            onRetry={() => responsesQuery.refetch()}
          />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{submittedCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">已提交</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">处理中</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{acceptedCount}</p>
                <p className="mt-1 text-xs text-muted-foreground">已接受</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">查看全部响应记录与状态跟踪。</p>
              <Link
                href="/workspace/supplier/responses"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                查看我的响应 →
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Quick Operations */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-industrial-cyan rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">快捷入口</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {SUPPLIER_QUICK_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <span className="text-xl">{item.icon}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dashboard Deep Link */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">进入完整供应商工作台</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              查看定向询价快照、响应跟踪与最近活动。
            </p>
          </div>
          <Link
            href="/dashboard/supplier"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            进入工作台
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}