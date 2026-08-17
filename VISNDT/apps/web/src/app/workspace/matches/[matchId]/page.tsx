'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/auth/AuthGuard';
import RoleGuard from '@/auth/RoleGuard';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import MatchStatusBadge from '@/components/match/MatchStatusBadge';
import MatchScore from '@/components/match/MatchScore';
import KnowledgeContextSection from '@/components/match/KnowledgeContextSection';
import { getAllMatches } from '@/services/match.service';
import type { MatchItem } from '@/services/match.service';

function MatchDetailContent({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [match, setMatch] = useState<MatchItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const allMatches = await getAllMatches();
      const found = allMatches.find((m) => m.id === matchId);
      if (!found) {
        setError('未找到匹配记录，可能不存在或无权访问。');
        return;
      }
      setMatch(found);
    } catch {
      setError('加载匹配详情失败，请重试。');
    } finally {
      setIsLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    load();
  }, [load]);

  // Loading state
  if (isLoading) {
    return (
      <WorkspaceLayout>
        <div className="max-w-[800px] mx-auto space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-slate-100 rounded w-1/2" />
            <div className="h-32 bg-slate-100 rounded" />
            <div className="h-24 bg-slate-100 rounded" />
          </div>
        </div>
      </WorkspaceLayout>
    );
  }

  // Error state
  if (error || !match) {
    return (
      <WorkspaceLayout>
        <div className="max-w-[800px] mx-auto">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm text-red-700">{error || '未知错误'}</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={load}
                className="text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                重试
              </button>
              <button
                onClick={() => router.push('/workspace/matches')}
                className="text-sm font-medium text-slate-600 underline hover:text-slate-800"
              >
                返回匹配列表
              </button>
            </div>
          </div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="max-w-[800px] mx-auto space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => router.push('/workspace/matches')}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← 返回匹配列表
        </button>

        {/* Match Summary */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/workspace/demands/${match.demandId}`}
                className="hover:underline"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {match.demandTitle || '未命名需求'}
                </h2>
              </Link>
              <p className="text-xs text-slate-400 mt-1">
                需求 #{match.demandId.slice(0, 8)}
              </p>
            </div>
            <MatchStatusBadge status={match.status} />
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">匹配 ID</p>
              <p className="text-xs font-mono text-slate-600">
                {match.id.slice(0, 12)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">创建时间</p>
              <p className="text-xs text-slate-600">
                {new Date(match.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">更新时间</p>
              <p className="text-xs text-slate-600">
                {new Date(match.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">组织</p>
              <p className="text-xs text-slate-600">
                {match.organizationId ? match.organizationId.slice(0, 8) : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            匹配评分
          </h3>
          <div className="flex items-center gap-4">
            <MatchScore score={match.score} />
            {match.score != null && (
              <span className="text-sm font-medium text-slate-700">
                匹配度: {Math.round(match.score * 100)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            评分基于需求参数与产品参数的确定性匹配算法，不使用知识库或 AI 加权。
          </p>
        </div>

        {/* Knowledge Context */}
        <KnowledgeContextSection matchId={matchId} />

        {/* Review Actions */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            操作
          </h3>
          <div className="flex items-center gap-3">
            <Link
              href={`/workspace/demands/${match.demandId}`}
              className="px-4 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              查看需求详情
            </Link>
            <Link
              href="/workspace/matches"
              className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              返回匹配列表
            </Link>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);

  return (
    <AuthGuard>
      <RoleGuard roles={['BUYER']}>
        <MatchDetailContent matchId={matchId} />
      </RoleGuard>
    </AuthGuard>
  );
}