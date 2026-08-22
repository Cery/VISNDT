import MatchCard from './MatchCard';
import UiIcon from '@/lib/ui-icon';
import type { MatchItem } from '@/services/match.service';

interface MatchListProps {
  matches: MatchItem[];
  isLoading?: boolean;
  onStatusUpdate?: (matchId: string, newStatus: string) => void;
  onRematch?: (demandId: string) => void;
}

export default function MatchList({ matches, isLoading, onStatusUpdate, onRematch }: MatchListProps) {
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
        <div className="text-3xl mb-3"><UiIcon name="link" size={40} color="#94a3b8" /></div>
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          暂无匹配结果
        </h3>
        <p className="text-sm text-slate-400">
          当您的需求被处理后，产品匹配结果将显示在这里。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          onStatusUpdate={onStatusUpdate}
          onRematch={onRematch}
        />
      ))}
    </div>
  );
}