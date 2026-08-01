import type { RfqDetailItem } from '@/lib/api/rfqs';
import RFQStatusBadge from './RFQStatusBadge';

interface RFQDetailProps {
  rfq: RfqDetailItem;
  responseCount: number;
}

export default function RFQDetail({ rfq, responseCount }: RFQDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-xl font-bold text-slate-900">{rfq.title}</h1>
          <RFQStatusBadge status={rfq.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Created: {new Date(rfq.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(rfq.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Demand Reference */}
      {rfq.demand && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Related Demand
          </h2>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-medium text-slate-900">
              {rfq.demand.title}
            </p>
          </div>
        </section>
      )}

      {/* Description */}
      {rfq.description && (
        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-2">
            Description
          </h2>
          <p className="text-sm text-slate-500 whitespace-pre-wrap leading-relaxed">
            {rfq.description}
          </p>
        </section>
      )}

      {/* Response Count */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-2">
          Responses
        </h2>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{responseCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            {responseCount === 0
              ? 'No responses yet'
              : `${responseCount} response${responseCount > 1 ? 's' : ''} received`}
          </p>
        </div>
      </section>
    </div>
  );
}