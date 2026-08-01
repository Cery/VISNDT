import type { RfqResponseItem } from '@/lib/api/rfqs';

const STATUS_MAP: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  REVIEWED: 'Reviewed',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

interface RFQResponseListProps {
  responses: RfqResponseItem[];
  isLoading?: boolean;
}

export default function RFQResponseList({
  responses,
  isLoading,
}: RFQResponseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (responses.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        No responses received yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {responses.map((resp) => (
        <div
          key={resp.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3"
        >
          <div>
            <span className="text-sm font-medium text-slate-700">
              Response #{resp.id.slice(0, 8)}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              {new Date(resp.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {STATUS_MAP[resp.status] || resp.status}
          </span>
        </div>
      ))}
    </div>
  );
}