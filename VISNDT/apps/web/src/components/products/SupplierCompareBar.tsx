'use client';

import Link from 'next/link';

/**
 * SupplierCompareBar — M28.1 M667 SupplierProduct Comparison Experience.
 *
 * Floating bottom bar for the Buyer's selected SupplierProducts (all under the
 * same Platform Capability). Reuses the existing `/products/compare` URL state
 * with `type=supplier-product&capability=<platformProductId>` so deep links,
 * refresh and back/forward stay stable. Never a new comparison domain/entity.
 */
interface SupplierCompareBarProps {
  /** Platform Product (Capability Authority) anchor */
  capabilityId: string;
  capabilityName: string;
  /** Selected SupplierProducts (id + display label) */
  selected: { id: string; label: string }[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function SupplierCompareBar({
  capabilityId,
  capabilityName,
  selected,
  onRemove,
  onClear,
}: SupplierCompareBarProps) {
  if (selected.length === 0) return null;

  const compareUrl = `/products/compare?ids=${selected
    .map((s) => s.id)
    .join(',')}&type=supplier-product&capability=${capabilityId}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-industrial-lg">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            已选择 {selected.length} 个供应商型号
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 3h10M1 9h10" />
            </svg>
            {capabilityName}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto min-w-0">
            {selected.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >
                <span className="max-w-[120px] truncate">{s.label}</span>
                <button
                  type="button"
                  onClick={() => onRemove(s.id)}
                  className="hover:text-primary/70 flex-shrink-0"
                  aria-label={`移除 ${s.label}`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M2 2l6 6M8 2l-6 6" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            清空
          </button>
          <Link
            href={compareUrl}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                selected.length >= 2
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              }
            `}
            aria-disabled={selected.length < 2}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 4h12M1 10h12M3 1v12M11 1v12" />
            </svg>
            开始对比
          </Link>
        </div>
      </div>
    </div>
  );
}
