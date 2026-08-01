import Link from 'next/link';
import DemandStatusBadge from './DemandStatusBadge';
import type { DemandItem } from '@/lib/api/demands';

interface DemandListProps {
  demands: DemandItem[];
  isLoading?: boolean;
}

export default function DemandList({ demands, isLoading }: DemandListProps) {
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

  if (demands.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <div className="text-3xl mb-3">📋</div>
        <h3 className="text-sm font-medium text-slate-700 mb-1">
          No demands yet
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          You have not created any demand listings yet.
        </p>
        <Link
          href="/products"
          className="inline-flex text-sm font-medium text-slate-900 hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {demands.map((demand) => (
        <Link
          key={demand.id}
          href={`/workspace/demands/${demand.id}`}
          className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
                {demand.title}
              </h3>
              {demand.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {demand.description}
                </p>
              )}
            </div>
            <DemandStatusBadge status={demand.status} />
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            {demand.category && (
              <span className="bg-slate-100 px-2 py-0.5 rounded-full">
                {demand.category.name}
              </span>
            )}
            <span>{new Date(demand.createdAt).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}