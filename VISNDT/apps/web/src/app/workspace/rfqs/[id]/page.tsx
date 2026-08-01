'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import RFQDetail from '@/components/rfq/RFQDetail';
import RFQResponseList from '@/components/rfq/RFQResponseList';
import { getRfq, getRfqResponses } from '@/services/rfq.service';
import type { RfqDetailItem, RfqResponseItem } from '@/lib/api/rfqs';

function RfqDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [rfq, setRfq] = useState<RfqDetailItem | null>(null);
  const [responses, setResponses] = useState<RfqResponseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
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
          // Filter responses for this RFQ
          const all = responsesRes.value.data || [];
          setResponses(all.filter((r) => r.rfqId === id));
        }
      } catch {
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar />
      <div className="flex-1 flex flex-col">
        <WorkspaceHeader />
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