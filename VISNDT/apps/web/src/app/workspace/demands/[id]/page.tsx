'use client';

import { useEffect, useState, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import DemandDetail from '@/components/demand/DemandDetail';
import { getDemand, getDemandMatches } from '@/services/demand.service';
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

  useEffect(() => {
    async function load() {
      try {
        const [demandRes, matchesRes] = await Promise.allSettled([
          getDemand(id),
          getDemandMatches(id, 1, 1),
        ]);

        if (demandRes.status === 'fulfilled') {
          setDemand(demandRes.value);
        } else {
          setError('Failed to load demand. It may not exist or you may not have access.');
          return;
        }

        if (matchesRes.status === 'fulfilled') {
          setMatchesCount(matchesRes.value.total || 0);
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
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <button
              onClick={() => router.push('/workspace/demands')}
              className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1 transition-colors"
            >
              ← Back to Demands
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
              <DemandDetail demand={demand} matchesCount={matchesCount} />
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
      <DemandDetailContent id={id} />
    </AuthGuard>
  );
}