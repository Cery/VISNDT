'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import WorkspaceSectionHeader from '@/components/workspace/WorkspaceSectionHeader';
import BuyerJourneySteps from '@/components/workspace/BuyerJourneySteps';
import ReturnToDiscovery from '@/components/workspace/ReturnToDiscovery';
import RFQList from '@/components/rfq/RFQList';
import { getRfqs } from '@/services/rfq.service';
import type { RfqItem } from '@/lib/api/rfqs';

function RfqsContent() {
  const router = useRouter();
  const [rfqs, setRfqs] = useState<RfqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getRfqs(page, pageSize);
      setRfqs(res.data || []);
      setTotal(res.total || 0);
    } catch {
      setError('加载询价失败，请重试。');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <WorkspaceLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <WorkspaceSectionHeader
          title="我的询价请求"
          eyebrow="BUYER · RFQ"
          description="查看已发布的询价请求，并审核供应商响应、做出报价决策。"
          actions={
            <button
              onClick={() => router.push('/workspace/rfqs/create')}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
            >
              + 创建询价请求
            </button>
          }
        />

        <BuyerJourneySteps currentStep="rfq" />
        <ReturnToDiscovery context="RFQ" />

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="搜索询价请求..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setPage(1);
                load();
              }
            }}
            className="w-full sm:max-w-xs px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={load}
              className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
            >
              重试
            </button>
          </div>
        ) : (
          <>
            <RFQList rfqs={rfqs} isLoading={isLoading} />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
                >
                  上一页
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      p === page
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </WorkspaceLayout>
  );
}

export default function RfqsPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <RfqsContent />
      </RoleGuard>
    </AuthGuard>
  );
}
