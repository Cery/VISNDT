'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import { useAuth } from '@/auth/AuthProvider';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import RFQStatusBadge from '@/components/rfq/RFQStatusBadge';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import StatCard from '@/components/workspace/StatCard';
import UiIcon from '@/lib/ui-icon';
import { BusinessIdentityBadge } from '@visndt/design-system';
import {
  getSupplierWorkspaceOverview,
  getSupplierWorkspaceResponses,
  getSupplierWorkspaceRfqs,
} from '@/services/workspace.service';
import { getOffers } from '@/services/offer.service';
import { getAvailableRfqs } from '@/services/rfq.service';

const STATUS_LABEL_MAP: Record<string, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已发布',
  SUBMITTED: '已提交',
  PROCESSING: '处理中',
  OPEN: '开放',
  RESPONDING: '响应中',
  CLOSED: '已关闭',
  CANCELLED: '已取消',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  VIEWED: '已查看',
  PENDING: '待处理',
  MATCHED: '已匹配',
};

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
    .map(([status, count]) => `${STATUS_LABEL_MAP[status] || '未知状态'} ${count}`)
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
    icon: 'file',
  },
  {
    title: '商机中心',
    description: '发现公开 RFQ 机会、查看匹配机会和定向询价，把握业务先机。',
    href: '/workspace/supplier/opportunities',
    icon: 'target',
  },
  {
    title: '我的响应',
    description: '查看已提交响应的状态跟踪与历史记录。',
    href: '/workspace/supplier/responses',
    icon: 'send',
  },
  {
    title: '我的 Offer',
    description: '查看和管理供应能力 Offer，创建新 Offer 并提交。',
    href: '/workspace/supplier/offers',
    icon: 'package',
  },
  {
    title: '企业资料',
    description: '查看和编辑组织基础信息，维护企业身份与公开资料。',
    href: '/workspace/supplier/profile',
    icon: 'building',
  },
  {
    title: '展示管理',
    description: '查看和管理供应商公开展示能力，包括企业身份、产品能力和供应管理。',
    href: '/workspace/supplier/display',
    icon: 'list',
  },
  {
    title: '通知中心',
    description: '进入通知页面查看当前消息和提醒。',
    href: '/workspace/notifications',
    icon: 'bell',
  },
  {
    title: '设置',
    description: '进入工作区设置查看当前账号与偏好配置。',
    href: '/workspace/settings',
    icon: 'settings',
  },
] as const;

function countResponsesByStatus(statuses: string[], targetStatus: string) {
  return statuses.filter((status) => status === targetStatus).length;
}

function SupplierDashboardContent() {
  const { user } = useAuth();

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

  const offersQuery = useQuery({
    queryKey: ['offers', 'supplier', 'dashboard'],
    queryFn: () =>
      getOffers({
        organizationId: user?.organizationId ?? undefined,
        pageSize: 1,
      }),
    enabled: !!user?.organizationId,
  });

  const availableRfqsQuery = useQuery({
    queryKey: ['rfqs', 'available', 'dashboard'],
    queryFn: () => getAvailableRfqs({ pageSize: 1 }),
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
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              供应商工作台
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              欢迎回来{user?.name ? `，${user.name}` : ''}。管理您的 RFQ 机会、响应状态与能力展示。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {user?.workspaceRole ?? 'SUPPLIER'}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6 items-start">
              <StatCard
                label="待处理 RFQ"
                value={overviewQuery.data.rfqSummary.total}
                description={formatStatusCounts(overviewQuery.data.rfqSummary.statusCounts)}
                icon="file"
              />
              <StatCard
                label="已提交响应"
                value={overviewQuery.data.responseSummary.total}
                description={formatStatusCounts(overviewQuery.data.responseSummary.statusCounts)}
                icon="send"
              />
              <StatCard
                label="匹配机会"
                value={overviewQuery.data.matchSummary.total}
                description={formatStatusCounts(overviewQuery.data.matchSummary.statusCounts)}
                icon="link"
              />
              <StatCard
                label="公开 RFQ"
                value={availableRfqsQuery.data?.total ?? 0}
                description="可参与响应"
                icon="target"
              />
              <StatCard
                label="我的 Offer"
                value={offersQuery.data?.total ?? 0}
                description="供应能力 Offer"
                icon="package"
              />
              <StatCard
                label="未读通知"
                value={overviewQuery.data.notificationSummary.unreadCount}
                description="条未读消息"
                icon="bell"
              />
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-emerald-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">快捷操作</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <Link
              href="/workspace/supplier/rfqs"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-lg"><UiIcon name="file" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">查看 RFQ</p>
                <p className="text-xs text-slate-500">{overviewQuery.data?.rfqSummary.total ?? 0} 个待处理</p>
              </div>
            </Link>
            <Link
              href="/workspace/supplier/opportunities"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 text-lg"><UiIcon name="target" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">商机中心</p>
                <p className="text-xs text-slate-500">{availableRfqsQuery.data?.total ?? 0} 个公开 RFQ</p>
              </div>
            </Link>
            <Link
              href="/workspace/supplier/responses"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 text-lg"><UiIcon name="send" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">我的响应</p>
                <p className="text-xs text-slate-500">{overviewQuery.data?.responseSummary.total ?? 0} 条记录</p>
              </div>
            </Link>
            <Link
              href="/workspace/supplier/offers"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600 text-lg"><UiIcon name="package" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">我的 Offer</p>
                <p className="text-xs text-slate-500">{offersQuery.data?.total ?? 0} 个 Offer</p>
              </div>
            </Link>
            <Link
              href="/workspace/supplier/profile"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600 text-lg"><UiIcon name="building" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">企业资料</p>
                <p className="text-xs text-slate-500">管理组织信息</p>
              </div>
            </Link>
            <Link
              href="/workspace/supplier/display"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 text-lg"><UiIcon name="list" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">展示管理</p>
                <p className="text-xs text-slate-500">管理能力展示</p>
              </div>
            </Link>
            <Link
              href="/workspace/notifications"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-600 text-lg"><UiIcon name="bell" size={18} color="currentColor" /></span>
              <div>
                <p className="text-sm font-medium text-slate-900">通知中心</p>
                <p className="text-xs text-slate-500">{overviewQuery.data?.notificationSummary.unreadCount ?? 0} 条未读</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Targeted RFQ Snapshot */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-industrial-cyan rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">定向询价快照</h2>
          </div>

          {rfqsQuery.isLoading ? (
            <Loading />
          ) : rfqsQuery.isError ? (
            <ErrorState
              message="加载定向 RFQ 快照失败，请稍后重试。"
              onRetry={retryRfqs}
            />
          ) : visibleRfqs.length === 0 ? (
            <EmptyState
              icon="search"
              title="暂无可展示的定向 RFQ"
              message="当前没有指向您组织的定向询价单。"
              description="可前往商机中心浏览公开 RFQ 机会，或返回 RFQ 列表发起可响应的询价流程。"
              action={{ label: '发现 RFQ 机会', href: '/workspace/supplier/opportunities' }}
            />
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
                        <BusinessIdentityBadge type="RFQ" id={rfq.id} createdAt={rfq.createdAt} variant="plain" />
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
                      <p className="text-xs text-slate-500">RFQ 标题</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{rfq.title}</p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-500">需求上下文</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {rfq.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Reference: {rfq.reference}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-500">采购方组织</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {formatOrganizationName(rfq.buyerOrganization?.name)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-slate-500">状态</p>
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

        {/* Response Tracking */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-amber-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">响应跟踪</h2>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 items-start">
                <StatCard
                  label="已提交"
                  value={submittedResponseCount}
                  description="当前处于已提交状态的响应数"
                  icon="send"
                />
                <StatCard
                  label="处理中"
                  value={pendingResponseCount}
                  description="尚未进入最终结果的响应数"
                  icon="clock"
                />
                <StatCard
                  label="已接受"
                  value={acceptedResponseCount}
                  description="已接受的响应数"
                  icon="check"
                />
              </div>

              {visibleResponses.length === 0 ? (
                <EmptyState
                  icon="document"
                  title="暂无响应记录"
                  message="当前暂无可展示的报价响应。"
                  description="确定供应能力并不再发起响应时，可前往 RFQ 机会页对可响应的询价提交技术方案。"
                  action={{ label: '查看可响应询价', href: '/workspace/supplier/rfqs' }}
                />
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
                            <BusinessIdentityBadge type="RFQ_RESPONSE" id={response.id} createdAt={response.createdAt} variant="plain" />
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
                          <p className="text-xs text-slate-500">响应状态</p>
                          <div className="mt-1">
                            <RFQResponseStatusBadge status={response.status} />
                          </div>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">关联 RFQ</p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {response.rfq.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Reference: {response.rfq.reference}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white p-3">
                          <p className="text-xs text-slate-500">采购方组织</p>
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

        {/* Recent Activity */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-violet-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">最近活动</h2>
          </div>

          {rfqsQuery.isLoading || responsesQuery.isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-3">
              {visibleRfqs.length === 0 && visibleResponses.length === 0 ? (
                <EmptyState
                  icon="default"
                  title="暂无最近业务活动"
                  message="尚未产生 RFQ 或响应的业务活动记录。"
                  description="从商机中心开始：发现匹配机会并对可响应的询价提交方案，活动将在此沉淀为时间线。"
                  action={{ label: '前往商机中心', href: '/workspace/supplier/opportunities' }}
                />
              ) : (
                <>
                  {visibleRfqs.slice(0, 3).map((rfq) => (
                    <Link
                      key={`rfq-${rfq.id}`}
                      href={`/workspace/supplier/rfqs/${rfq.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:bg-white hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-600 text-xs">
                          RFQ
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{rfq.title}</p>
                          <p className="text-xs text-slate-400">定向询价 · {formatDateTime(rfq.createdAt)}</p>
                        </div>
                      </div>
                      <RFQStatusBadge status={rfq.status} />
                    </Link>
                  ))}
                  {visibleResponses.slice(0, 3).map((response) => (
                    <Link
                      key={`resp-${response.id}`}
                      href="/workspace/supplier/responses"
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:bg-white hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-100 text-amber-600 text-xs">
                          RES
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{response.rfq.title}</p>
                          <p className="text-xs text-slate-400">响应提交 · {formatDateTime(response.createdAt)}</p>
                        </div>
                      </div>
                      <RFQResponseStatusBadge status={response.status} />
                    </Link>
                  ))}
                </>
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
                  <span className="text-xl"><UiIcon name={item.icon} size={22} color="#94a3b8" /></span>
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

export default function SupplierDashboardPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierDashboardContent />
      </RoleGuard>
    </AuthGuard>
  );
}
