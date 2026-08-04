import Link from 'next/link';
import RFQStatusBadge from './RFQStatusBadge';
import type { RfqItem } from '@/lib/api/rfqs';

interface RFQListProps {
  rfqs: RfqItem[];
  isLoading?: boolean;
}

export default function RFQList({ rfqs, isLoading }: RFQListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (rfqs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="text-3xl mb-3">📄</div>
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          暂无询价
        </h3>
        <p className="text-sm text-slate-400">
          您的组织尚未收到任何询价。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rfqs.map((rfq) => (
        <Link
          key={rfq.id}
          href={`/workspace/rfqs/${rfq.id}`}
          className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
                {rfq.title}
              </h3>
              {rfq.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {rfq.description}
                </p>
              )}
            </div>
            <RFQStatusBadge status={rfq.status} />
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span>{new Date(rfq.createdAt).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}