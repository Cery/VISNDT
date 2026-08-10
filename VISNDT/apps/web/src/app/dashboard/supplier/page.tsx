'use client';

import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import RFQStatusBadge from '@/components/rfq/RFQStatusBadge';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import StatCard from '@/components/workspace/StatCard';
import {
  getSupplierWorkspaceOverview,
  getSupplierWorkspaceResponses,
  getSupplierWorkspaceRfqs,
} from '@/services/workspace.service';

function formatDateTime(value?: string | null) {
  if (!value) {
    return '暂无';
  }

  return new Date(value).toLocaleString('zh-CN');
}

function formatStatusCounts(statusCounts?: Record<string, number>) {
  const entries = Object.entries(statusCounts ?? {}).filter(([, count]) => count > 0);

  if (entries.length === 0) {
    return '暂无状态统计';
  }

  return entries
    .slice(0, 3)
    .map(([status, count]) => `${status} ${count}`)
    .join(' / ');
}

function formatOrganizationName(name?: string | null) {
  if (!name) {
    return '未关联 Buyer 组织';
  }

  return name;
}

function SupplierDashboardContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((value) => !value), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const overviewQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'overview'],
    queryFn: getSupplierWorkspaceOverview,
  });

  const rfqsQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'rfqs'],
    queryFn: getSupplierWorkspaceRfqs,
  });

  const responsesQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'responses'],
    queryFn: getSupplierWorkspaceResponses,
  });

  const visibleRfqs = (rfqsQuery.data ?? []).slice(0, 5);
  const visibleResponses = (responsesQuery.data ?? []).slice(0, 5);

  const retryOverview = () => {
    void overviewQuery.refetch();
  };

  const retryRfqs = () => {
    void rfqsQuery.refetch();
  };

  const retryResponses = () => {
    void responsesQuery.refetch();
  };

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="mx-auto max-w-[1200px] space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Supplier Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  欢迎回来{user?.name ? `，${user.name}` : ''}。这里展示 Supplier 工作区概览、定向 RFQ 快照和响应跟踪。
                </p>
              </div>
              <div className="text-sm text-slate-500">
                当前角色：{user?.workspaceRole ?? '未配置'}
              </div>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Supplier Summary Cards</h2>
                <p className="mt-1 text-sm text-slate-500">
                  数据仅来自 `workspace.service.ts` 的 Supplier Workspace API 封装。
                </p>
              </div>

              {overviewQuery.isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white">
                  <Loading />
                </div>
              ) : overviewQuery.isError || !overviewQuery.data ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <ErrorState
                    message="加载 Supplier 汇总数据失败，请稍后重试。"
                    onRetry={retryOverview}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="RFQ Summary"
                    value={overviewQuery.data.rfqSummary.total}
                    description={formatStatusCounts(overviewQuery.data.rfqSummary.statusCounts)}
                    icon="📄"
                  />
                  <StatCard
                    label="Response Summary"
                    value={overviewQuery.data.responseSummary.total}
                    description={formatStatusCounts(overviewQuery.data.responseSummary.statusCounts)}
                    icon="📨"
                  />
                  <StatCard
                    label="Notification Summary"
                    value={overviewQuery.data.notificationSummary.unreadCount}
                    description="当前未读通知数"
                    icon="🔔"
                  />
                  <StatCard
                    label="Match Summary"
                    value={overviewQuery.data.matchSummary.total}
                    description={formatStatusCounts(overviewQuery.data.matchSummary.statusCounts)}
                    icon="🔗"
                  />
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Targeted RFQ Snapshot</h2>
                <p className="mt-1 text-sm text-slate-500">
                  展示当前组织最近收到的定向 RFQ 快照，不提供 RFQ 操作入口。
                </p>
              </div>

              {rfqsQuery.isLoading ? (
                <Loading />
              ) : rfqsQuery.isError ? (
                <ErrorState
                  message="加载定向 RFQ 快照失败，请稍后重试。"
                  onRetry={retryRfqs}
                />
              ) : visibleRfqs.length === 0 ? (
                <EmptyState message="当前暂无可展示的定向 RFQ。" />
              ) : (
                <div className="space-y-4">
                  {visibleRfqs.map((rfq) => (
                    <article
                      key={rfq.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <RFQStatusBadge status={rfq.status} />
                            <span className="text-xs text-slate-400">RFQ ID: {rfq.id}</span>
                          </div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {rfq.title}
                          </h3>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>创建时间：{formatDateTime(rfq.createdAt)}</p>
                          <p>更新时间：{formatDateTime(rfq.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">RFQ title</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{rfq.title}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Demand context</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            RFQ 标题上下文：{rfq.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Reference: {rfq.reference}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            当前契约未提供独立 demand 字段
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Buyer organization</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {formatOrganizationName(rfq.buyerOrganization?.name)}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Status</p>
                          <div className="mt-1">
                            <RFQStatusBadge status={rfq.status} />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Response Tracking</h2>
                <p className="mt-1 text-sm text-slate-500">
                  展示当前组织最近提交的响应状态和关联 Buyer 上下文。
                </p>
              </div>

              {responsesQuery.isLoading ? (
                <Loading />
              ) : responsesQuery.isError ? (
                <ErrorState
                  message="加载响应跟踪数据失败，请稍后重试。"
                  onRetry={retryResponses}
                />
              ) : visibleResponses.length === 0 ? (
                <EmptyState message="当前暂无可展示的响应记录。" />
              ) : (
                <div className="space-y-4">
                  {visibleResponses.map((response) => (
                    <article
                      key={response.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <RFQResponseStatusBadge status={response.status} />
                            <span className="text-xs text-slate-400">
                              Response ID: {response.id}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {response.rfq.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            关联需求：{response.demand.title}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>提交时间：{formatDateTime(response.createdAt)}</p>
                          <p>更新时间：{formatDateTime(response.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Response status</p>
                          <div className="mt-1">
                            <RFQResponseStatusBadge status={response.status} />
                          </div>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Related RFQ</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {response.rfq.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Reference: {response.rfq.reference}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Buyer organization</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {formatOrganizationName(response.buyerOrganization?.name)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierDashboardPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierDashboardContent />
      </RoleGuard>
    </AuthGuard>
  );
}
