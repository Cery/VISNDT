'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { getAvailableRfqs } from '@/services/rfq.service';
import { getSupplierWorkspaceOverview, getSupplierWorkspaceRfqs, getSupplierWorkspaceResponses } from '@/services/workspace.service';
import type { AvailableRfqItem } from '@/lib/api/rfqs';
import type { WorkspaceSupplierRfqItem } from '@/lib/api/workspace';
import { BusinessIdentityBadge } from '@visndt/design-system';

const RFQ_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  OPEN: '公开',
  RESPONDING: '响应中',
  CLOSED: '已关闭',
};

function formatDateTime(value?: string | null) {
  if (!value) return '暂无';
  return new Date(value).toLocaleString('zh-CN');
}

function RfqStatusBadge({ status }: { status: string }) {
  const label = RFQ_STATUS_LABELS[status] ?? status;
  const colorMap: Record<string, string> = {
    OPEN: 'bg-emerald-100 text-emerald-700',
    RESPONDING: 'bg-blue-100 text-blue-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    DRAFT: 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status] ?? 'bg-slate-100 text-slate-600'}`}>
      {label}
    </span>
  );
}

type Tab = 'available' | 'targeted' | 'matches';

function OpportunityContent() {
  const [activeTab, setActiveTab] = useState<Tab>('available');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Available RFQs (open to all suppliers)
  const availableQuery = useQuery({
    queryKey: ['rfqs', 'available', page],
    queryFn: () => getAvailableRfqs({ page, pageSize }),
    enabled: activeTab === 'available',
  });

  // Targeted RFQs (directed to this supplier)
  const targetedQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'rfqs'],
    queryFn: getSupplierWorkspaceRfqs,
    enabled: activeTab === 'targeted',
  });

  // Workspace overview (for match summary)
  const overviewQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'overview'],
    queryFn: getSupplierWorkspaceOverview,
  });

  // Responses
  const responsesQuery = useQuery({
    queryKey: ['workspace', 'supplier', 'responses'],
    queryFn: getSupplierWorkspaceResponses,
  });

  const availableRfqs = availableQuery.data?.data ?? [];
  const availableTotal = availableQuery.data?.total ?? 0;
  const availablePages = availableQuery.data?.totalPages ?? 1;
  const targetedRfqs = targetedQuery.data ?? [];
  const matchSummary = overviewQuery.data?.matchSummary;
  const responses = responsesQuery.data ?? [];

  // Build a set of RFQ IDs that have been responded to
  const respondedRfqIds = new Set(responses.map((r) => r.rfq.id));

  const tabs = [
    { key: 'available' as Tab, label: '公开 RFQ', count: availableTotal },
    { key: 'targeted' as Tab, label: '定向 RFQ', count: targetedRfqs.length },
    { key: 'matches' as Tab, label: '匹配机会', count: matchSummary?.total ?? 0 },
  ];

  return (
    <WorkspaceLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">商机中心</h1>
            <p className="mt-1 text-sm text-slate-500">
              发现公开 RFQ 机会、查看定向询价和匹配机会，把握业务先机。
            </p>
          </div>
        </div>

        {/* Opportunity Summary */}
        {overviewQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white"><Loading /></div>
        ) : overviewQuery.data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">公开 RFQ</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{availableTotal}</p>
              <p className="text-xs text-slate-400">可参与报价的公开询价</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">定向 RFQ</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{overviewQuery.data.rfqSummary.total}</p>
              <p className="text-xs text-slate-400">指向您组织的询价</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">匹配机会</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{matchSummary?.total ?? 0}</p>
              <p className="text-xs text-slate-400">基于 Offer 的需求匹配</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">已响应</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{responses.length}</p>
              <p className="text-xs text-slate-400">已提交的 RFQ 响应</p>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: Available RFQs */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {availableQuery.isLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white"><Loading /></div>
            ) : availableQuery.isError ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <ErrorState message="加载公开 RFQ 失败，请稍后重试。" onRetry={() => availableQuery.refetch()} />
              </div>
            ) : availableRfqs.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <EmptyState message="当前没有公开可参与的 RFQ 机会。" />
              </div>
            ) : (
              <>
                {availableRfqs.map((rfq: AvailableRfqItem) => {
                  const hasResponded = respondedRfqIds.has(rfq.id);
                  return (
                    <div key={rfq.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <RfqStatusBadge status={rfq.status} />
                            {hasResponded && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                已响应
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{rfq.demand.title}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Demand ID: {rfq.demand.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            发布: {formatDateTime(rfq.publishedAt ?? rfq.createdAt)}
                          </span>
                          <Link
                            href={`/workspace/supplier/rfqs/${rfq.id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
                          >
                            查看详情
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">RFQ 编号</p>
                          <div className="mt-1"><BusinessIdentityBadge type="RFQ" id={rfq.id} createdAt={rfq.createdAt} variant="plain" /></div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">需求编号</p>
                          <div className="mt-1"><BusinessIdentityBadge type="DEMAND" id={rfq.demand.id} variant="plain" /></div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">状态</p>
                          <RfqStatusBadge status={rfq.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                {availablePages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                    >
                      上一页
                    </button>
                    <span className="text-sm text-slate-500">{page} / {availablePages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(availablePages, p + 1))}
                      disabled={page >= availablePages}
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab Content: Targeted RFQs */}
        {activeTab === 'targeted' && (
          <div className="space-y-4">
            {targetedQuery.isLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white"><Loading /></div>
            ) : targetedQuery.isError ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <ErrorState message="加载定向 RFQ 失败，请稍后重试。" onRetry={() => targetedQuery.refetch()} />
              </div>
            ) : targetedRfqs.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <EmptyState message="当前没有指向您组织的定向 RFQ。" />
              </div>
            ) : (
              targetedRfqs.map((rfq: WorkspaceSupplierRfqItem) => {
                const hasResponded = respondedRfqIds.has(rfq.id);
                return (
                  <div key={rfq.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <RfqStatusBadge status={rfq.status} />
                          {hasResponded && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              已响应
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-900">{rfq.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          采购方: {rfq.buyerOrganization?.name ?? '未知'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          {formatDateTime(rfq.createdAt)}
                        </span>
                        <Link
                          href={`/workspace/supplier/rfqs/${rfq.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
                        >
                          查看详情
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">RFQ 编号</p>
                        <div className="mt-1"><BusinessIdentityBadge type="RFQ" id={rfq.id} createdAt={rfq.createdAt} variant="plain" /></div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">采购方</p>
                        <p className="text-sm font-medium text-slate-900">{rfq.buyerOrganization?.name ?? '未知'}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">状态</p>
                        <RfqStatusBadge status={rfq.status} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content: Match Opportunities */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {overviewQuery.isLoading ? (
              <div className="rounded-xl border border-slate-200 bg-white"><Loading /></div>
            ) : overviewQuery.isError ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <ErrorState message="加载匹配机会失败，请稍后重试。" onRetry={() => overviewQuery.refetch()} />
              </div>
            ) : !matchSummary || matchSummary.total === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <EmptyState message="当前没有基于 Offer 的需求匹配机会。" />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">匹配机会概览</h3>
                <p className="mt-1 text-sm text-slate-500">
                  以下展示基于您的 Offer 所产生的需求匹配机会统计。
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">总匹配数</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{matchSummary.total}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">匹配状态分布</p>
                    <div className="mt-2 space-y-1">
                      {Object.entries(matchSummary.statusCounts).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{status}</span>
                          <span className="font-medium text-slate-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-blue-700">
                    DemandMatch 机会来源于您的 Offer 与 Buyer Demand 的自动匹配。当匹配发生时，Buyer 可能基于匹配结果创建定向 RFQ，您将在&ldquo;定向 RFQ&rdquo;标签中看到相关机会。
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Opportunity Timeline */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-violet-400 rounded-full" />
            <h2 className="text-lg font-semibold text-slate-900">机会时间线</h2>
          </div>

          {responsesQuery.isLoading ? (
            <Loading />
          ) : responsesQuery.isError ? (
            <ErrorState message="加载时间线失败。" onRetry={() => responsesQuery.refetch()} />
          ) : responses.length === 0 && targetedRfqs.length === 0 ? (
            <EmptyState message="暂无机会活动记录。" />
          ) : (
            <div className="space-y-3">
              {targetedRfqs.slice(0, 3).map((rfq) => (
                <Link
                  key={`rfq-${rfq.id}`}
                  href={`/workspace/supplier/rfqs/${rfq.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:bg-white hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-100 text-blue-600 text-xs font-bold">
                      RFQ
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{rfq.title}</p>
                      <p className="text-xs text-slate-400">收到定向询价 · {formatDateTime(rfq.createdAt)}</p>
                    </div>
                  </div>
                  <RfqStatusBadge status={rfq.status} />
                </Link>
              ))}
              {responses.slice(0, 5).map((response) => (
                <Link
                  key={`resp-${response.id}`}
                  href="/workspace/supplier/responses"
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:bg-white hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-100 text-amber-600 text-xs font-bold">
                      RES
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{response.rfq.title}</p>
                      <p className="text-xs text-slate-400">
                        {response.status === 'SUBMITTED' && '提交响应'}
                        {response.status === 'VIEWED' && '响应已查看'}
                        {response.status === 'ACCEPTED' && '响应已接受'}
                        {response.status === 'REJECTED' && '响应已拒绝'}
                        {' · '}{formatDateTime(response.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    response.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                    response.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                    response.status === 'VIEWED' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {response.status === 'SUBMITTED' ? '已提交' :
                     response.status === 'VIEWED' ? '已查看' :
                     response.status === 'ACCEPTED' ? '已接受' :
                     response.status === 'REJECTED' ? '已拒绝' : response.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </WorkspaceLayout>
  );
}

export default function SupplierOpportunityPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <OpportunityContent />
      </RoleGuard>
    </AuthGuard>
  );
}