'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import RFQDetail from '@/components/rfq/RFQDetail';
import RFQResponseList from '@/components/rfq/RFQResponseList';
import { getRfq, getRfqResponses, deleteRfq, publishRfq, closeRfq } from '@/services/rfq.service';
import type { RfqDetailItem, RfqResponseItem } from '@/lib/api/rfqs';

function RfqDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [rfq, setRfq] = useState<RfqDetailItem | null>(null);
  const [responses, setResponses] = useState<RfqResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [rfqRes, responsesRes] = await Promise.allSettled([
        getRfq(id),
        getRfqResponses(1, 50),
      ]);

      if (rfqRes.status === 'fulfilled') {
        setRfq(rfqRes.value);
      } else {
        setError('Failed to load RFQ. It may not exist or you may not have access.');
        return;
      }

      if (responsesRes.status === 'fulfilled') {
        const all = responsesRes.value.data || [];
        setResponses(all.filter((r) => r.rfqId === id));
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this RFQ?')) return;
    setActionLoading('delete');
    try {
      await deleteRfq(id);
      router.push('/workspace/rfqs');
    } catch {
      setError('Failed to delete RFQ.');
      setActionLoading('');
    }
  }, [id, router]);

  const handlePublish = useCallback(async () => {
    setActionLoading('publish');
    try {
      const updated = await publishRfq(id);
      setRfq(updated);
    } catch {
      setError('Failed to publish RFQ.');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const handleClose = useCallback(async () => {
    setActionLoading('close');
    try {
      const updated = await closeRfq(id);
      setRfq(updated);
    } catch {
      setError('Failed to close RFQ.');
    } finally {
      setActionLoading('');
    }
  }, [id]);

  const canPublish = rfq?.status === 'DRAFT';
  const canClose = rfq?.status === 'OPEN' || rfq?.status === 'RESPONDING';

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button
              onClick={() => router.push('/workspace/rfqs')}
              className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1 transition-colors"
            >
              ← Back to RFQs
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
            ) : rfq ? (
              <>
                {/* Action buttons */}
                {!isLoading && rfq && (
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      onClick={() => router.push(`/workspace/rfqs/${id}/edit`)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                    {canPublish && (
                      <button
                        onClick={handlePublish}
                        disabled={actionLoading === 'publish'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'publish' ? 'Publishing...' : 'Publish'}
                      </button>
                    )}
                    {canClose && (
                      <button
                        onClick={handleClose}
                        disabled={actionLoading === 'close'}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
                      >
                        {actionLoading === 'close' ? 'Closing...' : 'Close'}
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      disabled={actionLoading === 'delete'}
                      className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === 'delete' ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
                <RFQDetail rfq={rfq} responseCount={responses.length} />
                <div className="mt-8">
                  <h2 className="text-sm font-semibold text-slate-700 mb-3">
                    Response Details
                  </h2>
                  <RFQResponseList responses={responses} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <RfqDetailContent id={id} />
    </AuthGuard>
  );
}