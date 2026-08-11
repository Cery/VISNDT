'use client';

import { useCallback, useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import RFQResponseStatusBadge from '@/components/rfq/RFQResponseStatusBadge';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { getMyRfqResponses } from '@/services/rfq.service';
import type { RfqResponseItem } from '@/lib/api/rfqs';

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
                    查看当前组织已提交的 RFQ 响应记录，不开发报价编辑能力。
                  </p>
                </div>
                <div className="text-sm text-slate-500">
                  第 {page} 页 / 共 {Math.max(totalPages, 1)} 页，{total} 条
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
              ) : responses.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <EmptyState message="当前暂无报价响应记录。" />
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {responses.map((response) => (
                      <article
                        key={response.id}
                        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <RFQResponseStatusBadge status={response.status} />
                              <span className="text-xs text-slate-400">
                                Response ID: {response.id}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {response.rfq?.demand?.title || '未关联需求标题'}
                            </h3>
                          </div>
                          <div className="text-sm text-slate-500 space-y-1 text-right">
                            <p>提交时间：{formatDateTime(response.createdAt)}</p>
                            <p>RFQ 状态：{response.rfq?.status || '暂无'}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="rounded-lg bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Offer
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
                              Response
                            </p>
                            <p className="mt-2 text-sm text-slate-700">
                              当前状态：{response.status}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {response.message?.trim() || '暂无响应说明'}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
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
