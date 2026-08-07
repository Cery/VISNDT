'use client';

import { useEffect, useState, useCallback } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceHeader from '@/components/workspace/WorkspaceHeader';
import MatchList from '@/components/match/MatchList';
import { getAllMatches } from '@/services/match.service';
import type { MatchItem } from '@/services/match.service';

function MatchesContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch {
      setError('Unable to load matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Client-side filtering and pagination
  const filtered = searchQuery
    ? matches.filter((m) =>
        (m.demandTitle || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : matches;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="flex min-h-screen">
      <WorkspaceSidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <WorkspaceHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 bg-slate-50 p-6">
          <div className="max-w-[1200px] mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">匹配结果</h2>
              <p className="text-slate-500 text-sm mt-1">
                查看需求与产品的匹配结果。
              </p>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="搜索需求标题..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
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
                <MatchList matches={pagedData} isLoading={isLoading} />
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

export default function MatchesPage() {
  return (
    <AuthGuard>
      <MatchesContent />
    </AuthGuard>
  );
}