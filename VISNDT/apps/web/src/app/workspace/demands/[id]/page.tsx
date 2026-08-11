'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import DemandDetail from '@/components/demand/DemandDetail';
import { getDemand, getDemandMatches, publishDemand, closeDemand } from '@/services/demand.service';
import type { DemandDetailItem } from '@/lib/api/demands';

function DemandDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [demand, setDemand] = useState<DemandDetailItem | null>(null);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [demandRes, matchesRes] = await Promise.allSettled([
        getDemand(id),
        getDemandMatches(id, 1, 1),
      ]);

      if (demandRes.status === 'fulfilled') {
        setDemand(demandRes.value);
      } else {
        setError('加载需求失败，可能不存在或无权访问。');
        return;
      }

      if (matchesRes.status === 'fulfilled') {
        setMatchesCount(matchesRes.value.total || 0);
      }
    } catch {
      setError('发生意外错误。');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = useCallback(async () => {
    setActionLoading('publish');
    try {
      const updated = await publishDemand(id);
      setDemand(updated);
    } catch {
      setError('发布需求失败。');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const handleClose = useCallback(async () => {
    setActionLoading('close');
    try {
      const updated = await closeDemand(id);
      setDemand(updated);
    } catch {
      setError('关闭需求失败。');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const canPublish = demand?.status === 'DRAFT';
  const canEdit = demand?.status === 'DRAFT';
  const canClose = demand?.status === 'PUBLISHED' || demand?.status === 'PROCESSING';

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto">
            {/* Back button */}
            <button
              onClick={() => router.push('/workspace/demands')}
              className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1 transition-colors"
            >
              ← 返回需求列表
            </button>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-slate-100 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                <div className="h-32 bg-slate-100 rounded animate-pulse" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                {error}
              </div>
            ) : demand ? (
              <>
                {/* Action buttons */}
                {!isLoading && demand && (
                  <div className="flex items-center gap-2 mb-6">
                    {canEdit && (
                      <button
                        onClick={() => router.push(`/workspace/demands/${id}/edit`)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                      >
                        编辑
                      </button>
                    )}
                    {canPublish && (
                      <button
                        onClick={handlePublish}
                        disabled={actionLoading === 'publish'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'publish' ? '发布中...' : '发布'}
                      </button>
                    )}
                    {canClose && (
                      <button
                        onClick={handleClose}
                        disabled={actionLoading === 'close'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'close' ? '关闭中...' : '关闭'}
                      </button>
                    )}
                  </div>
                )}
                <DemandDetail demand={demand} matchesCount={matchesCount} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <DemandDetailContent id={id} />
      </RoleGuard>
    </AuthGuard>
  );
}
