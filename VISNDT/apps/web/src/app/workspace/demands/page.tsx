'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import DemandList from '@/components/demand/DemandList';
import { getDemands } from '@/services/demand.service';
import type { DemandItem } from '@/lib/api/demands';

function DemandsContent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [demands, setDemands] = useState<DemandItem[]>([]);
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
      const res = await getDemands(page, pageSize);
      setDemands(res.data || []);
      setTotal(res.total || 0);
    } catch {
      setError('Unable to load demands. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">My Demands</h2>
                <p className="text-slate-500 text-sm mt-1">
                  View and manage your demand listings.
                </p>
              </div>
              <button
                onClick={() => router.push('/workspace/demands/create')}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
              >
                + Create Demand
              </button>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search demands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setPage(1);
                    load();
                  }
                }}
                className="w-full max-w-xs px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={load}
                  className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <DemandList demands={demands} isLoading={isLoading} />
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-3 py-1 text-sm border border-slate-300 rounded-md disabled:opacity-50 hover:bg-slate-50"
                    >
                      Previous
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
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemandsPage() {
  return (
    <AuthGuard>
      <DemandsContent />
    </AuthGuard>
  );
}