interface MatchScoreProps {
  score: number | null | undefined;
  className?: string;
}

export default function MatchScore({ score, className = '' }: MatchScoreProps) {
  if (score === null || score === undefined) {
    return <span className={`text-xs text-slate-400 ${className}`}>—</span>;
  }

  const pct = Math.round(score * 100);
  const width = Math.min(100, Math.max(0, pct));

  const barColor =
    width >= 80
      ? 'bg-emerald-500'
      : width >= 50
        ? 'bg-blue-500'
        : 'bg-amber-500';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-600">{pct}%</span>
    </div>
  );
}