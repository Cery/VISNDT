'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import BuyerActionSummary from '@/components/workspace/BuyerActionSummary';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import {
  getBuyerPendingDecisions,
  getBuyerWorkspaceOverview,
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

const DOMAIN_NAV_ITEMS = [
  {
    title: '我的需求',
    description: '查看 Demand 列表、状态和详情页入口。',
    href: '/workspace/demands',
    icon: '📋',
  },
  {
    title: '询价管理',
    description: '进入 RFQ 列表，查看询价进度与待决策响应。',
    href: '/workspace/rfqs',
    icon: '📄',
  },
  {
    title: '匹配结果',
    description: '查看当前 Matching 汇总与关联结果。',
    href: '/workspace/matches',
    icon: '🔗',
  },
  {
    title: '通知中心',
    description: '进入通知页面查看当前消息和提醒。',
    href: '/workspace/notifications',
    icon: '🔔',
  },
] as const;

function BuyerDashboardContent() {
  const { user } = useAuth();

  const overviewQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'overview'],
    queryFn: getBuyerWorkspaceOverview,
  });

  const decisionsQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'pending-decisions'],
    queryFn: getBuyerPendingDecisions,
  });

  const pendingDecisionCount = decisionsQuery.data?.length ?? 0;
  const visibleDecisions = (decisionsQuery.data ?? []).slice(0, 3);

  const retryOverview = () => {
    void overviewQuery.refetch();
  };

  const retryDecisions = () => {
    void decisionsQuery.refetch();
  };

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              采购方工作台
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              欢迎回来{user?.name ? `，${user.name}` : ''}。管理您的检测需求、询价与供应商响应。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {user?.workspaceRole ?? 'BUYER'}
            </span>
          </div>
        </div>

        {/* Business Status */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">业务概览</h2>
          </div>

          {overviewQuery.isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <Loading />
            </div>
          ) : overviewQuery.isError || !overviewQuery.data ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <ErrorState
                message="加载汇总数据失败，请稍后重试。"
                onRetry={retryOverview}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="需求"
                value={overviewQuery.data.demandSummary.total}
                description={formatStatusCounts(overviewQuery.data.demandSummary.statusCounts)}
                icon="📋"
              />
              <StatCard
                label="询价"
                value={overviewQuery.data.rfqSummary.total}
                description="Buyer RFQ 总量"
                icon="📄"
              />
              <StatCard
                label="匹配"
                value={overviewQuery.data.matchSummary.total}
                description={formatStatusCounts(overviewQuery.data.matchSummary.statusCounts)}
                icon="🔗"
              />
              <StatCard
                label="待决策响应"
                value={overviewQuery.data.responseSummary.pendingCount}
                description={`待处理 ${overviewQuery.data.responseSummary.pendingCount} / 已接受 ${overviewQuery.data.responseSummary.acceptedCount} / 已拒绝 ${overviewQuery.data.responseSummary.rejectedCount}`}
                icon="⏳"
              />
            </div>
          )}
        </section>

        {/* Pending Actions */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-amber-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">待处理事项</h2>
            {pendingDecisionCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                {pendingDecisionCount} 项待决策
              </span>
            )}
          </div>

          {decisionsQuery.isLoading ? (
            <Loading />
          ) : decisionsQuery.isError ? (
            <ErrorState
              message="加载待决策响应失败，请稍后重试。"
              onRetry={retryDecisions}
            />
          ) : (
            <div className="space-y-4">
              <BuyerActionSummary
                title="待处理供应商响应"
                count={pendingDecisionCount}
                description="您有 RFQ 响应等待查看和决策，进入询价管理页面进行处理。"
                href="/workspace/rfqs"
                linkLabel="查看待决策响应"
              />

              {visibleDecisions.length === 0 ? (
                <EmptyState message="当前没有待处理的 RFQ 响应决策。" />
              ) : (
                <div className="grid gap-3 lg:grid-cols-3">
                  {visibleDecisions.map((decision) => (
                    <article
                      key={decision.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Response ID
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {decision.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">关联需求</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {decision.demand.title}
                          </p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                          <div>
                            <p className="text-xs text-slate-500">供应商</p>
                            <p className="mt-1 text-sm text-slate-900">
                              {decision.supplierOrganization.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">待处理起始</p>
                            <p className="mt-1 text-sm text-slate-900">
                              {formatDateTime(decision.pendingSince)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                          <div>
                            <p className="text-xs text-slate-500">当前状态</p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {decision.status}
                            </p>
                          </div>
                          <Link
                            href={`/workspace/rfqs/${decision.rfq.id}`}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                          >
                            查看询价
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Domain Navigation */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-industrial-cyan rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">业务导航</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {DOMAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  进入
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </WorkspaceLayout>
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
