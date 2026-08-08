import Link from 'next/link';

interface MatchCardProps {
  id: string;
  demandId: string;
  status: string;
  score?: number | null;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  MATCHED: 'bg-green-100 text-green-700',
  REVIEWED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default function MatchCard({
  id,
  demandId,
  status,
  score,
  createdAt,
}: MatchCardProps) {
  return (
    <Link
      href={`/workspace/matches/${id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-medium text-sm text-slate-900">
            匹配 #{id.slice(0, 8)}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">需求: {demandId.slice(0, 8)}</p>
        </div>
        <span
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
            STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        {score !== null && score !== undefined && (
          <span>匹配度: {(score * 100).toFixed(0)}%</span>
        )}
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}