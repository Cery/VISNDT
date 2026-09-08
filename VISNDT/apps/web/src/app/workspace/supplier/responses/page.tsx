'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { BusinessIdentityBadge } from '@visndt/design-system';
import { getMyRfqResponses } from '@/services/rfq.service';
import type { RfqResponseItem } from '@/lib/api/rfqs';

const RESPONSE_STATUS_FILTERS = [
  { label: '全部', value: '' },
  { label: '已提交', value: 'SUBMITTED' },
  { label: '已查看', value: 'VIEWED' },
  { label: '已接受', value: 'ACCEPTED' },
  { label: '已拒绝', value: 'REJECTED' },
] as const;

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

function formatStatus(status: string | undefined | null): string {
  if (!status) return '暂无';
  return STATUS_LABEL_MAP[status] || '未知状态';
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '暂无';
  }

  return new Date(value).toLocaleString('zh-CN');
}

function formatOfferSummary(response: RfqResponseItem) {
  if (!response.offer) {
    return '暂无报价信息';
  }

  const parts = [response.offer.title];

  if (response.offer.price !== null && response.offer.price !== undefined) {
    parts.push(`${response.offer.currency || 'CNY'} ${response.offer.price}`);
  }

  parts.push(`状态：${response.offer.status}`);

  return parts.join(' | ');
}

function formatDecisionNote(status: string, decisionNote?: string | null) {
  if (status === 'ACCEPTED' && decisionNote) {
    return `接受备注：${decisionNote}`;
  }
  if (status === 'REJECTED' && decisionNote) {
    return `拒绝原因：${decisionNote}`;
  }
  return null;
}

function SupplierResponsesContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [responses, setResponses] = useState<RfqResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  const loadResponses = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getMyRfqResponses(page, pageSize);
      setResponses(result.data ?? []);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 0);
    } catch {
      setError('加载我的报价响应失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadResponses();
  }, [loadResponses]);

  const filteredResponses = useMemo(() => {
    if (!statusFilter) {
      return responses;
    }
    return responses.filter((r) => r.status === statusFilter);
  }, [responses, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { total: responses.length };
    for (const r of responses) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [responses]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">报价响应管理</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    查看当前组织已提交的 RFQ 响应记录，跟踪 Buyer 决策结果。
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  第 {page} 页 / 共 {Math.max(totalPages, 1)} 页，{total} 条
                </div>
              </div>

              {/* Status Filter */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {RESPONSE_STATUS_FILTERS.map((filter) => {
                    const count = filter.value ? statusCounts[filter.value] || 0 : statusCounts.total || 0;
                    const isActive = statusFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(filter.value);
                          setPage(1);
                        }}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {filter.label}
                        <span className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {isLoading ? (
                <div className="rounded-xl border border-slate-200 bg-white">
                  <Loading />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <ErrorState message={error} onRetry={() => void loadResponses()} />
                </div>
              ) : filteredResponses.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <EmptyState message={statusFilter ? `当前暂无状态为"${RESPONSE_STATUS_FILTERS.find((f) => f.value === statusFilter)?.label || statusFilter}"的响应记录。` : '当前暂无报价响应记录。'} />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {filteredResponses.map((response) => {
                      const decisionText = formatDecisionNote(response.status, response.decisionNote);
                      return (
                        <article
                          key={response.id}
                          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <RFQResponseStatusBadge status={response.status} />
                                <BusinessIdentityBadge type="RFQ_RESPONSE" id={response.id} createdAt={response.createdAt} variant="plain" />
                              </div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {response.rfq?.demand?.title || '未关联需求标题'}
                              </h3>
                            </div>
                            <div className="text-sm text-slate-500 space-y-1 text-right">
                              <p>提交时间：{formatDateTime(response.createdAt)}</p>
                              <p>RFQ 状态：{formatStatus(response.rfq?.status)}</p>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-4">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                报价
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                {formatOfferSummary(response)}
                              </p>
                              {response.offer?.description ? (
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                  {response.offer.description}
                                </p>
                              ) : null}
                            </div>

                            <div className="rounded-lg bg-slate-50 p-4">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                响应
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                当前状态：{formatStatus(response.status)}
                              </p>
                              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                {response.message?.trim() || '暂无响应说明'}
                              </p>
                            </div>
                          </div>

                          {/* Buyer Decision Result */}
                          {(response.status === 'ACCEPTED' || response.status === 'REJECTED') && decisionText ? (
                            <div className={`mt-4 rounded-lg p-4 ${
                              response.status === 'ACCEPTED'
                                ? 'border border-emerald-200 bg-emerald-50'
                                : 'border border-rose-200 bg-rose-50'
                            }`}>
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
                                  response.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}>
                                  {response.status === 'ACCEPTED' ? (
                                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.42 0l-4-4a1 1 0 011.42-1.42L8 12.58l7.29-7.29a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${
                                    response.status === 'ACCEPTED' ? 'text-emerald-800' : 'text-rose-800'
                                  }`}>
                                    Buyer {response.status === 'ACCEPTED' ? '接受' : '拒绝'}决策
                                  </p>
                                  <p className={`mt-1 text-sm ${
                                    response.status === 'ACCEPTED' ? 'text-emerald-700' : 'text-rose-700'
                                  }`}>
                                    {decisionText}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {/* RFQ Association Info */}
                          {response.rfq ? (
                            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                RFQ 关联信息
                              </p>
                              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                <div>
                                  <span className="text-xs text-slate-400">RFQ 编号</span>
                                  <p className="text-sm font-medium text-slate-700">
                                    <BusinessIdentityBadge type="RFQ" id={response.rfq.id} variant="plain" />
                                  </p>
                                </div>
                                <div>
                                  <span className="text-xs text-slate-400">RFQ 状态</span>
                                  <p className="text-sm font-medium text-slate-700">{formatStatus(response.rfq.status)}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-slate-400">需求编号</span>
                                  <p className="text-sm font-medium text-slate-700">
                                    {response.rfq.demand ? (
                                      <BusinessIdentityBadge type="DEMAND" id={response.rfq.demand.id} variant="plain" />
                                    ) : '暂无'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierResponsesPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['SUPPLIER']}>
        <SupplierResponsesContent />
      </RoleGuard>
    </AuthGuard>
  );
}
