import MatchCard from './MatchCard';
import type { MatchItem } from '@/services/match.service';

interface MatchListProps {
  matches: MatchItem[];
  isLoading?: boolean;
}

export default function MatchList({ matches, isLoading }: MatchListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="text-3xl mb-3">🔗</div>
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          No matches yet
        </h3>
        <p className="text-sm text-slate-400">
          Product matches will appear here once your demands have been processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}