'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import RFQStatusBadge from '@/components/rfq/RFQStatusBadge';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import { getAvailableRfqs } from '@/services/rfq.service';
import type { AvailableRfqItem } from '@/lib/api/rfqs';

function formatDateTime(value?: string | null) {
  if (!value) {
    return '暂无';
  }

  return new Date(value).toLocaleString('zh-CN');
}

function SupplierRfqsContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [rfqs, setRfqs] = useState<AvailableRfqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadRfqs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getAvailableRfqs({ page, pageSize });
      setRfqs(result.data ?? []);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 0);
    } catch {
      setError('加载供应商可报价询价列表失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadRfqs();
  }, [loadRfqs]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto">
            <RoleGuard roles={['SUPPLIER']}>
              <div className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">供应商询价管理</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      查看当前可响应的 RFQ 列表，仅做数据展示，不扩展报价业务流程。
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
                    <ErrorState message={error} onRetry={() => void loadRfqs()} />
                  </div>
                ) : rfqs.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <EmptyState message="当前暂无可报价的询价单。" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {rfqs.map((rfq) => (
                        <article
                          key={rfq.id}
                          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <RFQStatusBadge status={rfq.status} />
                                <span className="text-xs text-slate-400">RFQ ID: {rfq.id}</span>
                              </div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {rfq.demand.title}
                              </h3>
                            </div>
                            <div className="text-sm text-slate-500 space-y-1 text-right">
                              <p>发布时间：{formatDateTime(rfq.publishedAt)}</p>
                              <p>创建时间：{formatDateTime(rfq.createdAt)}</p>
                            </div>
                          </div>

                          <div className="mt-4 rounded-lg bg-slate-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                              Demand
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-900">
                              {rfq.demand.title}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                              {rfq.demand.description?.trim() || '暂无需求描述'}
                            </p>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Link
                              href={`/workspace/supplier/rfqs/${rfq.id}`}
                              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
                            >
                              查看详情
                            </Link>
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
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierRfqsPage() {
  return (
    <AuthGuard>
      <SupplierRfqsContent />
    </AuthGuard>
  );
}
