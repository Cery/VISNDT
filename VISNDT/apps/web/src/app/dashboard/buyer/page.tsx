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
import DemandStatusBadge from '@/components/demand/DemandStatusBadge';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import StatCard from '@/components/workspace/StatCard';
import {
  getBuyerPendingDecisions,
  getBuyerWorkspaceDemands,
  getBuyerWorkspaceOverview,
} from '@/services/workspace.service';

function formatDateTime(value?: string | null) {
  if (!value) {
    return '暂无';
  }

  return new Date(value).toLocaleString('zh-CN');
}

function BuyerDashboardContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const overviewQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'overview'],
    queryFn: getBuyerWorkspaceOverview,
  });

  const demandsQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'demands'],
    queryFn: getBuyerWorkspaceDemands,
  });

  const decisionsQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'pending-decisions'],
    queryFn: getBuyerPendingDecisions,
  });

  const visibleDemands = (demandsQuery.data ?? []).slice(0, 5);
  const visibleDecisions = (decisionsQuery.data ?? []).slice(0, 5);

  const retryOverview = () => {
    void overviewQuery.refetch();
  };

  const retryDemands = () => {
    void demandsQuery.refetch();
  };

  const retryDecisions = () => {
    void decisionsQuery.refetch();
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
                  Buyer Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  欢迎回来{user?.name ? `，${user.name}` : ''}。这里展示 Buyer 工作区概览、需求总览和待决策响应。
                </p>
              </div>
              <div className="text-sm text-slate-500">
                当前角色：{user?.workspaceRole ?? '未配置'}
              </div>
            </div>

            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">汇总卡片</h2>
                <p className="mt-1 text-sm text-slate-500">
                  数据来自 Workspace API client，经由 `workspace.service.ts` 获取。
                </p>
              </div>

              {overviewQuery.isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white">
                  <Loading />
                </div>
              ) : overviewQuery.isError || !overviewQuery.data ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <ErrorState
                    message="加载 Buyer 汇总数据失败，请稍后重试。"
                    onRetry={retryOverview}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    label="活跃需求"
                    value={overviewQuery.data.demandSummary.total}
                    description="Buyer 需求总量"
                    icon="📋"
                  />
                  <StatCard
                    label="匹配结果"
                    value={overviewQuery.data.matchSummary.total}
                    description="Workspace Match 汇总"
                    icon="🔗"
                  />
                  <StatCard
                    label="已发 RFQ"
                    value={overviewQuery.data.rfqSummary.total}
                    description="Buyer RFQ 总量"
                    icon="📄"
                  />
                  <StatCard
                    label="待决策响应"
                    value={overviewQuery.data.responseSummary.pendingCount}
                    description={`已接受 ${overviewQuery.data.responseSummary.acceptedCount} / 已拒绝 ${overviewQuery.data.responseSummary.rejectedCount}`}
                    icon="⏳"
                  />
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Demand Overview</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    展示最近需求及其匹配、RFQ 进展。
                  </p>
                </div>
                <Link
                  href="/workspace/demands"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  查看全部需求
                </Link>
              </div>

              {demandsQuery.isLoading ? (
                <Loading />
              ) : demandsQuery.isError ? (
                <ErrorState
                  message="加载 Buyer 需求概览失败，请稍后重试。"
                  onRetry={retryDemands}
                />
              ) : visibleDemands.length === 0 ? (
                <EmptyState message="当前暂无 Buyer 需求数据。" />
              ) : (
                <div className="space-y-4">
                  {visibleDemands.map((demand) => (
                    <article
                      key={demand.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <DemandStatusBadge status={demand.status} />
                            <span className="text-xs text-slate-400">Demand ID: {demand.id}</span>
                          </div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {demand.title}
                          </h3>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>创建时间：{formatDateTime(demand.createdAt)}</p>
                          <p>更新时间：{formatDateTime(demand.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">状态</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{demand.status}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">匹配数</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{demand.matchCount}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">RFQ 数</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{demand.rfqCount}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">详情</p>
                          <Link
                            href={`/workspace/demands/${demand.id}`}
                            className="mt-1 inline-flex text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                          >
                            查看 Demand
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Pending RFQ Response Decisions</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    展示等待 Buyer 处理的响应决策。
                  </p>
                </div>
                <Link
                  href="/workspace/rfqs"
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  前往 RFQ 列表
                </Link>
              </div>

              {decisionsQuery.isLoading ? (
                <Loading />
              ) : decisionsQuery.isError ? (
                <ErrorState
                  message="加载待决策响应失败，请稍后重试。"
                  onRetry={retryDecisions}
                />
              ) : visibleDecisions.length === 0 ? (
                <EmptyState message="当前没有待处理的 RFQ 响应决策。" />
              ) : (
                <div className="space-y-4">
                  {visibleDecisions.map((decision) => (
                    <article
                      key={decision.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <RFQResponseStatusBadge status={decision.status} />
                            <span className="text-xs text-slate-400">
                              Response ID: {decision.id}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {decision.demand.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            供应商：{decision.supplierOrganization.name}
                          </p>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                          <p>待处理起始：{formatDateTime(decision.pendingSince)}</p>
                          <p>RFQ 更新时间：{formatDateTime(decision.rfq.updatedAt)}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">RFQ 状态</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{decision.rfq.status}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Demand 状态</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">{decision.demand.status}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">Supplier 类型</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {decision.supplierOrganization.type}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">详情</p>
                          <Link
                            href={`/workspace/rfqs/${decision.rfq.id}`}
                            className="mt-1 inline-flex text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
                          >
                            查看 RFQ
                          </Link>
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

export default function BuyerDashboardPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <BuyerDashboardContent />
      </RoleGuard>
    </AuthGuard>
  );
}
