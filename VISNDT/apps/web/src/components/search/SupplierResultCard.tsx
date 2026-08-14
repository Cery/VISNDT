import Link from 'next/link';
import type { SupplierSearchResult } from '@/services/search.service';
import { highlightText } from '@/lib/search-utils';

interface SupplierResultCardProps {
  supplier: SupplierSearchResult;
  highlight?: string;
}

export default function SupplierResultCard({ supplier, highlight }: SupplierResultCardProps) {
  const maxCapabilities = 3;
  const visibleCapabilities = supplier.offerCapabilities.slice(0, maxCapabilities);
  const remaining = supplier.offerCapabilities.length - maxCapabilities;

  return (
    <Link
      href={`/suppliers/${supplier.organizationId}`}
      className="block rounded-xl border border-slate-200/80 shadow-industrial-sm p-5 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {highlight
              ? highlightText(supplier.organizationName, highlight)
              : supplier.organizationName}
          </h3>

          {supplier.organizationType && (
            <span className="inline-block text-xs text-slate-500 bg-slate-100 rounded px-2 py-0.5 mb-2">
              {supplier.organizationType}
            </span>
          )}

          {/* Offer Capabilities */}
          {supplier.offerCapabilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {visibleCapabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="inline-block text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-0.5"
                >
                  {highlight ? highlightText(cap, highlight) : cap}
                </span>
              ))}
              {remaining > 0 && (
                <span className="inline-block text-xs text-slate-400">
                  +{remaining} 更多
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {supplier.offerCount} 项供应能力
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 text-slate-300 group-hover:text-primary transition-colors pt-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}