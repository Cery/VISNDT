'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import WorkspaceSectionHeader from '@/components/workspace/WorkspaceSectionHeader';
import BuyerJourneySteps from '@/components/workspace/BuyerJourneySteps';
import ReturnToDiscovery from '@/components/workspace/ReturnToDiscovery';
import MatchList from '@/components/match/MatchList';
import {
  getAllMatches,
  updateMatchStatus,
  rematchDemand,
} from '@/services/match.service';
import type { MatchItem } from '@/services/match.service';

function MatchesContent() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [searchQuery, setSearchQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch {
      setError('加载匹配结果失败，请重试。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 300);
  };

  // Client-side filtering and pagination
  const filtered = searchQuery
    ? matches.filter((m) =>
        (m.demandTitle || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : matches;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleStatusUpdate = async (matchId: string, newStatus: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;
    try {
      await updateMatchStatus(match.demandId, matchId, newStatus);
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, matchStatus: newStatus } : m,
        ),
      );
    } catch {
      setError('更新匹配状态失败，请重试。');
    }
  };

  const handleRematch = async (demandId: string) => {
    try {
      await rematchDemand(demandId);
      // Reload matches after rematch
      await load();
    } catch {
      setError('重新匹配失败，请重试。');
    }
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-[1200px] mx-auto space-y-6">
        <WorkspaceSectionHeader
          title="匹配结果"
          eyebrow="BUYER · MATCHING"
          description="查看需求与检测能力的匹配结果，定位可发起询价的产品与供应商。"
        />

        <BuyerJourneySteps currentStep="match" />
        <ReturnToDiscovery context="MATCHING" />

        {/* Search with debounce */}
        <div>
          <input
            type="text"
            placeholder="搜索需求标题..."
            onChange={handleSearchChange}
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
            <MatchList
              matches={pagedData}
              isLoading={isLoading}
              onStatusUpdate={handleStatusUpdate}
              onRematch={handleRematch}
            />
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

export default function MatchesPage() {
  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <MatchesContent />
      </RoleGuard>
    </AuthGuard>
  );
}
