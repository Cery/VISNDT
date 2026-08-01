import Link from 'next/link';
import MatchStatusBadge from './MatchStatusBadge';
import MatchScore from './MatchScore';
import type { MatchItem } from '@/services/match.service';

interface MatchCardProps {
  match: MatchItem;
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Link
      href={`/workspace/demands/${match.demandId}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
            {match.demandTitle || 'Untitled Demand'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demand #{match.demandId.slice(0, 8)}
          </p>
        </div>
        <MatchStatusBadge status={match.status} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <MatchScore score={match.score} />
        <span className="text-xs text-slate-400">
          {new Date(match.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}