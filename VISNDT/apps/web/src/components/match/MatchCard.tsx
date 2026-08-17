'use client';

import { useState } from 'react';
import Link from 'next/link';
import MatchStatusBadge from './MatchStatusBadge';
import MatchScore from './MatchScore';
import type { MatchItem } from '@/services/match.service';

interface MatchCardProps {
  match: MatchItem;
  onStatusUpdate?: (matchId: string, newStatus: string) => void;
  onRematch?: (demandId: string) => void;
}

export default function MatchCard({ match, onStatusUpdate, onRematch }: MatchCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const canAccept = match.status === 'REVIEWED';
  const canReject = match.status === 'REVIEWED' || match.status === 'MATCHED';
  const canRematch = match.status === 'REJECTED' || match.status === 'EXPIRED';

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      if (onStatusUpdate) {
        await onStatusUpdate(match.id, newStatus);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <Link href={`/workspace/demands/${match.demandId}`} className="hover:underline">
            <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
              {match.demandTitle || '未命名需求'}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">
            需求 #{match.demandId.slice(0, 8)}
          </p>
        </div>
        <MatchStatusBadge status={match.status} />
      </div>

      {/* Score and details */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <MatchScore score={match.score} />
          {match.score != null && (
            <span className="text-xs text-slate-500">
              匹配度: {Math.round(match.score * 100)}%
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {new Date(match.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* View detail link */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <Link
          href={`/workspace/matches/${match.id}`}
          className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          查看详情 →
        </Link>
      </div>

      {/* Action buttons */}
      {(canAccept || canReject || canRematch) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
          {canAccept && (
            <button
              onClick={() => handleStatusUpdate('ACCEPTED')}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
            >
              {isUpdating ? '处理中...' : '接受匹配'}
            </button>
          )}
          {canReject && (
            <button
              onClick={() => handleStatusUpdate('REJECTED')}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
            >
              {isUpdating ? '处理中...' : '拒绝匹配'}
            </button>
          )}
          {canRematch && onRematch && (
            <button
              onClick={() => onRematch(match.demandId)}
              disabled={isUpdating}
              className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition-colors"
            >
              {isUpdating ? '处理中...' : '重新匹配'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}