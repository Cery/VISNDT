import type { DemandDetailItem } from '@/lib/api/demands';
import DemandStatusBadge from './DemandStatusBadge';
import DemandParameters from './DemandParameters';

interface DemandDetailProps {
  demand: DemandDetailItem;
  matchesCount: number;
}

export default function DemandDetail({ demand, matchesCount }: DemandDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-xl font-bold text-slate-900">{demand.title}</h1>
          <DemandStatusBadge status={demand.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {demand.category && (
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {demand.category.name}
            </span>
          )}
          <span>Created: {new Date(demand.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(demand.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Description */}
      {demand.description && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Description
          </h2>
          <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
            {demand.description}
          </p>
        </section>
      )}

      {/* Parameters */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Technical Parameters
        </h2>
        <DemandParameters
          parameters={demand.parameters || demand.parameterValues}
        />
      </section>

      {/* Match Count */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          Product Matches
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{matchesCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            Matching products found for this demand
          </p>
        </div>
      </section>
    </div>
  );
}