/**
 * Knowledge Context — Read-side Knowledge Context Section
 *
 * M23.0 — Display Knowledge Context in Match Detail.
 * Knowledge ≠ Score Input. Display only: Context, Reference, Learning.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMatchKnowledgeContext } from '@/lib/api/knowledge-context';
import type { KnowledgeContext } from '@/lib/api/knowledge-context';

interface KnowledgeContextSectionProps {
  matchId: string;
}

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: KnowledgeContext };

export default function KnowledgeContextSection({
  matchId,
}: KnowledgeContextSectionProps) {
  const [state, setState] = useState<LoadState>({ status: 'idle' });

  const load = async () => {
    setState({ status: 'loading' });
    try {
      const data = await getMatchKnowledgeContext(matchId);
      setState({ status: 'success', data });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : '加载知识上下文失败';
      setState({ status: 'error', message: msg });
    }
  };

  useEffect(() => {
    load();
  }, [matchId]);

  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-600 text-sm font-medium">
            知识上下文
          </span>
          <span className="text-xs text-amber-500">(加载失败)</span>
        </div>
        <p className="text-xs text-amber-600">{state.message}</p>
        <button
          onClick={load}
          className="mt-2 text-xs text-amber-700 underline hover:text-amber-800"
        >
          重试
        </button>
      </div>
    );
  }

  const ctx = state.data;
  const hasDomain = ctx.domain !== null;
  const hasCategory = ctx.category !== null;
  const hasRelevant = ctx.relevantEntries.length > 0;
  const hasPrerequisite = ctx.prerequisiteKnowledge.length > 0;
  const hasRelated = ctx.relatedKnowledge.length > 0;
  const hasFollowup = ctx.followupKnowledge.length > 0;
  const isEmpty = !hasDomain && !hasRelevant && !hasPrerequisite && !hasRelated && !hasFollowup;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 className="text-sm font-semibold text-slate-800">相关知识参考</h3>
      </div>

      {isEmpty ? (
        <p className="text-xs text-slate-400">暂无相关知识参考信息。</p>
      ) : (
        <div className="space-y-4">
          {/* Domain & Category */}
          {hasDomain && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">检测领域:</span>
              <span className="font-medium text-slate-700">
                {ctx.domain!.name}
              </span>
              {hasCategory && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-600">{ctx.category!.name}</span>
                </>
              )}
            </div>
          )}

          {/* Relevant Knowledge Entries */}
          {hasRelevant && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-2">
                相关技术资料
              </h4>
              <div className="space-y-2">
                {ctx.relevantEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/knowledge-base/${entry.slug}`}
                    className="block rounded-md border border-slate-100 bg-slate-50 p-2.5 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-800 line-clamp-1">
                      {entry.title}
                    </p>
                    {entry.summary && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {entry.summary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisite Knowledge */}
          {hasPrerequisite && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-2">
                前置知识
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ctx.prerequisiteKnowledge.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/knowledge-base/${entry.slug}`}
                    className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Knowledge */}
          {hasRelated && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-2">
                相关知识
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ctx.relatedKnowledge.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/knowledge-base/${entry.slug}`}
                    className="inline-block px-2 py-0.5 text-xs rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Knowledge */}
          {hasFollowup && (
            <div>
              <h4 className="text-xs font-medium text-slate-500 mb-2">
                进阶学习
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ctx.followupKnowledge.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/knowledge-base/${entry.slug}`}
                    className="inline-block px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-xs text-slate-400 italic">
            以上为匹配背景信息与技术资料参考，不影响匹配评分。
          </p>
        </div>
      )}
    </div>
  );
}