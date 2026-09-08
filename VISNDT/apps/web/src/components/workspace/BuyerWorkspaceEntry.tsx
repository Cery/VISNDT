'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import StatCard from '@/components/workspace/StatCard';
import BuyerActionSummary from '@/components/workspace/BuyerActionSummary';
import WorkspaceIdentityBar from '@/components/workspace/WorkspaceIdentityBar';
import UiIcon from '@/lib/ui-icon';
import type { UiIconName } from '@/lib/ui-icon';
import {
  getBuyerWorkspaceOverview,
  getBuyerPendingDecisions,
} from '@/services/workspace.service';

function formatStatusCounts(statusCounts?: Record<string, number>) {
  const entries = Object.entries(statusCounts ?? {}).filter(([, count]) => count > 0);
  if (entries.length === 0) {
    return '暂无状态统计';
  }
  return entries.slice(0, 3).map(([status, count]) => `${status} ${count}`).join(' / ');
}

const BUYER_QUICK_ITEMS = [
  { title: '我的需求', description: '创建与管理检测需求', href: '/workspace/demands', icon: 'list' },
  { title: '我的询价请求', description: '查看询价进度与待决策响应', href: '/workspace/rfqs', icon: 'file' },
  { title: '匹配结果', description: '查看需求与产品的匹配结果', href: '/workspace/matches', icon: 'link' },
  { title: '通知中心', description: '查看消息与提醒', href: '/workspace/notifications', icon: 'bell' },
] as const;

/**
 * Buyer Workspace SaaS Experience — Demand Side entry layer.
 */
export default function BuyerWorkspaceEntry() {
  const overviewQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'overview'],
    queryFn: getBuyerWorkspaceOverview,
  });

  const decisionsQuery = useQuery({
    queryKey: ['workspace', 'buyer', 'pending-decisions'],
    queryFn: getBuyerPendingDecisions,
  });

  const pendingDecisionCount = decisionsQuery.data?.length ?? 0;
  const visibleDecisions = (decisionsQuery.data ?? []).slice(0, 2);

  return (
    <div className="mx-auto max-w-[1120px] space-y-6">
      <WorkspaceIdentityBar
        title="采购方工作空间"
        subtitle="面向采买侧的检测能力发现与询价决策入口。围绕需求、RFQ 与供应商响应，快速掌握当前业务状态并明确下一步行动。"
        roleLabel="Buyer · 采购方"
        roleHint="需求发起侧（Demand Side）"
        roleTone="cyan"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 items-start">
            <StatCard
              label="需求"
              value={overviewQuery.data.demandSummary.total}
              description={formatStatusCounts(overviewQuery.data.demandSummary.statusCounts)}
              icon="list"
            />
            <StatCard
              label="询价请求"
              value={overviewQuery.data.rfqSummary.total}
              description="询价请求总量"
              icon="file"
            />
            <StatCard
              label="匹配"
              value={overviewQuery.data.matchSummary.total}
              description={formatStatusCounts(overviewQuery.data.matchSummary.statusCounts)}
              icon="link"
            />
            <StatCard
              label="待决策响应"
              value={overviewQuery.data.responseSummary.pendingCount}
              description="等待查看与决策的供应商响应"
              icon="clock"
            />
          </div>
        )}
      </section>

      {/* Pending Actions */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-amber-400 rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">待处理事项</h2>
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
            message="加载待处理事项失败，请稍后重试。"
            onRetry={() => decisionsQuery.refetch()}
          />
        ) : (
          <>
            <BuyerActionSummary
              title="待处理供应商响应"
              count={pendingDecisionCount}
              description="您有 RFQ 响应等待查看和决策，进入我的询价请求页面进行处理。"
              href="/workspace/rfqs"
              linkLabel="查看待决策响应"
            />

            {visibleDecisions.length > 0 && (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {visibleDecisions.map((d) => (
                  <article key={d.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      待决策响应
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{d.demand.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{d.supplierOrganization.name}</p>
                    <Link
                      href={`/workspace/rfqs/${d.rfq.id}`}
                      className="mt-3 inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      查看询价请求
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Quick Operations */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 bg-industrial-cyan rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">快捷入口</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 items-start">
          {BUYER_QUICK_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <span className="text-xl"><UiIcon name={item.icon as UiIconName} size={22} color="#94a3b8" /></span>
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
            <h2 className="text-lg font-semibold text-foreground">进入完整采购方工作台</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              查看更完整的业务概览、待处理决策与最近活动。
            </p>
          </div>
          <Link
            href="/dashboard/buyer"
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