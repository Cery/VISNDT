'use client';

import Link from 'next/link';
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

const DOMAIN_NAV_ITEMS = [
  {
    title: 'RFQ机会',
    description: '进入定向 RFQ 列表，查看当前可跟进的询价机会。',
    href: '/workspace/supplier/rfqs',
    icon: '📄',
  },
  {
    title: '我的响应',
    description: '查看已提交响应的状态跟踪与历史记录。',
    href: '/workspace/supplier/responses',
    icon: '📨',
  },
  {
    title: '通知中心',
    description: '进入通知页面查看当前消息和提醒。',
    href: '/workspace/notifications',
    icon: '🔔',
  },
  {
    title: '设置',
    description: '进入工作区设置查看当前账号与偏好配置。',
    href: '/workspace/settings',
    icon: '⚙️',
  },
] as const;

function countResponsesByStatus(statuses: string[], targetStatus: string) {
  return statuses.filter((status) => status === targetStatus).length;
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
  const responseItems = responsesQuery.data ?? [];
  const visibleResponses = responseItems.slice(0, 3);
  const responseStatuses = responseItems.map((response) => response.status);
  const submittedResponseCount = countResponsesByStatus(responseStatuses, 'SUBMITTED');
  const pendingResponseCount = responseStatuses.filter(
    (status) => status !== 'ACCEPTED' && status !== 'REJECTED',
  ).length;
  const acceptedResponseCount = countResponsesByStatus(responseStatuses, 'ACCEPTED');

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
                  Supplier Business Workbench
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  欢迎回来{user?.name ? `，${user.name}` : ''}。这里作为 Supplier Workspace 的业务状态与导航中心，只展示当前状态、待处理摘要和业务入口。
                </p>
              </div>
              <div className="text-sm text-slate-500">
                当前角色：{user?.workspaceRole ?? '未配置'}
              </div>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Business Status</h2>
                <p className="mt-1 text-sm text-slate-500">
                  数据仅来自 `getSupplierWorkspaceOverview()`，用于展示 Supplier 当前业务状态。
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
                    label="Targeted RFQ"
                    value={overviewQuery.data.rfqSummary.total}
                    description={formatStatusCounts(overviewQuery.data.rfqSummary.statusCounts)}
                    icon="📄"
                  />
                  <StatCard
                    label="Responses"
                    value={overviewQuery.data.responseSummary.total}
                    description={formatStatusCounts(overviewQuery.data.responseSummary.statusCounts)}
                    icon="📨"
                  />
                  <StatCard
                    label="Matches"
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
                  展示当前组织最近收到的定向 RFQ 机会摘要，不提供 RFQ 操作入口，也不扩展到 Marketplace 或全量 Demand 浏览。
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
                  基于 `getSupplierWorkspaceResponses()` 展示响应状态摘要与最近跟踪记录，页面保持只读，不提供提交、编辑、撤回或决策按钮。
                </p>
              </div>

              {responsesQuery.isLoading ? (
                <Loading />
              ) : responsesQuery.isError ? (
                <ErrorState
                  message="加载响应跟踪数据失败，请稍后重试。"
                  onRetry={retryResponses}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                      label="Submitted"
                      value={submittedResponseCount}
                      description="当前处于已提交状态的响应数"
                      icon="📨"
                    />
                    <StatCard
                      label="Pending"
                      value={pendingResponseCount}
                      description="尚未进入最终结果的响应数"
                      icon="⏳"
                    />
                    <StatCard
                      label="Accepted"
                      value={acceptedResponseCount}
                      description="已接受的响应数"
                      icon="✅"
                    />
                  </div>

                  {visibleResponses.length === 0 ? (
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
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Domain Navigation</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Supplier Workspace 作为导航中心，仅提供进入现有业务域页面的入口。
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {DOMAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-slate-300 hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{item.description}</p>
                    <span className="mt-4 inline-flex text-sm font-medium text-slate-700">
                      进入页面
                    </span>
                  </Link>
                ))}
              </div>
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
