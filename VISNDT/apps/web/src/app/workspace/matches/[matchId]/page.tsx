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
import {
  getMatchDetail,
  getAllMatches,
} from '@/services/match.service';
import type {
  MatchItem,
  MatchDetail,
  MatchParameterScore,
} from '@/services/match.service';
import { MatchExplanationCard, MATCH_STATUS_PRESENTATION } from '@visndt/design-system';
import type { MatchFactor } from '@visndt/design-system';

/**
 * 由后端真实 matchDetails.explanation.factors 派生解释因子。
 * 不重算评分，不伪造因素。仅映射字段到展示结构。
 */
function buildFactorsFromDetails(
  details: MatchDetail['matchDetails'],
): MatchFactor[] | null {
  const factors = details?.explanation?.factors;
  if (!factors || factors.length === 0) return null;
  return factors.map((f) => ({
    label: f.name,
    matched: f.matched,
    note: `得分 ${Math.round(f.score)} · 权重 ${f.weight}`,
  }));
}

/** 参数值展示辅助：非空值，否则 —— */
function fmtValue(v?: string | null) {
  return v && v.trim() !== '' ? v : '—';
}

function ParameterScoreTable({
  scores,
}: {
  scores: MatchParameterScore[];
}) {
  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-slate-400 border-b border-slate-100">
            <th className="py-2 pr-3 font-medium">参数</th>
            <th className="py-2 pr-3 font-medium">需求值</th>
            <th className="py-2 pr-3 font-medium">能力值</th>
            <th className="py-2 pr-3 font-medium">权重</th>
            <th className="py-2 pr-3 font-medium">必须</th>
            <th className="py-2 font-medium">得分</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => {
            const matched = s.score > 0;
            return (
              <tr
                key={`${s.parameterDefinitionId}-${i}`}
                className="border-b border-slate-50"
              >
                <td className="py-2 pr-3 text-slate-800 font-medium">
                  {s.parameterName}
                </td>
                <td className="py-2 pr-3 text-slate-600">
                  {fmtValue(s.demandValue)}
                </td>
                <td className="py-2 pr-3 text-slate-600">
                  {fmtValue(s.productValue)}
                </td>
                <td className="py-2 pr-3 text-slate-500">{s.weight}</td>
                <td className="py-2 pr-3 text-slate-500">
                  {s.required ? '是' : '否'}
                </td>
                <td
                  className={`py-2 font-medium ${
                    matched ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {matched ? '✓' : '×'} {Math.round(s.score)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MatchDetailContent({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [summary, setSummary] = useState<MatchItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // 先定位匹配归属的 demandId（列表接口含归属校验提示）
      const allMatches = await getAllMatches();
      const summaryMatch = allMatches.find((m) => m.id === matchId);
      if (!summaryMatch) {
        setError('未找到匹配记录，可能不存在或无权访问。');
        return;
      }
      setSummary(summaryMatch);

      // 拉取完整匹配详情（含真实 matchDetails、能力、需求参数）
      const detail = await getMatchDetail(summaryMatch.demandId, matchId);
      setMatch(detail);
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
  if (error || (!match && !summary)) {
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

  const status = match?.matchStatus ?? summary?.matchStatus ?? '';
  const score = match?.matchScore ?? summary?.matchScore ?? null;
  const createdAt = match?.createdAt ?? summary?.createdAt ?? '';
  const demandId = match?.demandId ?? summary?.demandId ?? '';
  const demandTitle = match?.demand?.title ?? summary?.demandTitle ?? '未命名需求';

  // 真实匹配解释（仅来自后端 matchDetails）
  const details = match?.matchDetails ?? null;
  const factors = details ? buildFactorsFromDetails(details) : null;
  const parameterScores = details?.parameterScores ?? null;
  const algorithm = details?.algorithm ?? null;
  const hardFail = details?.hardFail ?? null;
  const failReason = details?.failReason ?? null;
  // 0-1 置信度（仅用于 design-system 卡片展示，业务真值仍为 matchScore 0-100）
  const confidence = score != null ? score / 100 : null;

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
                href={`/workspace/demands/${demandId}`}
                className="hover:underline"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {demandTitle}
                </h2>
              </Link>
              <p className="text-xs text-slate-400 mt-1">
                需求 #{demandId.slice(0, 8)}
              </p>
            </div>
            <MatchStatusBadge status={status} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">匹配 ID</p>
              <p className="text-xs font-mono text-slate-600">
                {matchId.slice(0, 12)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">匹配能力</p>
              <p className="text-xs text-slate-600">
                {match?.product?.name || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">创建时间</p>
              <p className="text-xs text-slate-600">
                {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">匹配算法</p>
              <p className="text-xs font-mono text-slate-600">
                {algorithm ? String(algorithm) : '—'}
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
            <MatchScore score={score} />
            {score != null && (
              <span className="text-sm font-medium text-slate-700">
                匹配度: {Math.round(score)}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            评分基于需求参数与产品参数的确定性匹配算法，不使用知识库或 AI 加权。
          </p>
        </div>

        {/* Match Explanation — 消费后端真实 matchDetails */}
        <MatchExplanationCard
          matchId={matchId}
          title="匹配结果解释"
          referent={{ type: 'DEMAND', id: demandId, createdAt }}
          score={confidence}
          status={status}
          statusPresentation={MATCH_STATUS_PRESENTATION[status]}
          factors={factors ?? []}
        />

        {details && (hardFail || failReason) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5">
            <h3 className="text-sm font-semibold text-red-800 mb-2">
              匹配失败原因
            </h3>
            <p className="text-xs text-red-700">
              {hardFail ? '存在必填参数未匹配。' : ''}{' '}
              {failReason ? String(failReason) : ''}
            </p>
          </div>
        )}

        {details && parameterScores && parameterScores.length > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                参数匹配概览
              </h3>
              <span className="text-xs text-slate-400">
                {typeof details.matchedParameters === 'number' && (
                  <>
                    已匹配 {details.matchedParameters} / {details.totalParameters}{' '}
                    项 · 匹配率 {Math.round(Number(details.matchRate ?? 0))}%
                  </>
                )}
              </span>
            </div>
            <ParameterScoreTable scores={parameterScores} />
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              参数匹配概览
            </h3>
            <p className="text-xs text-slate-400">
              当前暂无详细匹配解释。
            </p>
          </div>
        )}

        {/* Knowledge Context */}
        <KnowledgeContextSection matchId={matchId} />

        {/* Review Actions */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">
            操作
          </h3>
          <div className="flex items-center gap-3">
            <Link
              href={`/workspace/demands/${demandId}`}
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