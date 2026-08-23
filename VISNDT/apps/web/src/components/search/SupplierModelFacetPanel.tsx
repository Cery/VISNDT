'use client';

import type { SupplierProductFacetBundle, SupplierModelFacetOption } from '@/lib/api/search';

/**
 * SupplierModelFacetPanel — M28.0 M661.5 / M661.6 Unified Discovery Consolidation.
 *
 * Brand / Series / Commercial availability facets for the SupplierProduct search
 * dimension. Folded into the unified `/search` page (type=supplier-product),
 * consuming the SupplierProduct dimension facet bundle served directly by the
 * unified `/search` response (M661.6 — SearchPage never calls the legacy
 * `/search/supplier-models` endpoint).
 *
 * Category + technical-parameter facets are rendered by the shared ParameterFacet
 * (Search Context), which applies to both Product and SupplierProduct dimensions.
 * Brand / series / commercial availability are supplier-model-specific and appear
 * here so no second independent facet system is introduced.
 */

interface SupplierModelFacetPanelProps {
  facets: SupplierProductFacetBundle | null;
  loading: boolean;
  selected: { brand?: string; series?: string; hasOffer?: boolean };
  onToggleBrand: (value: string) => void;
  onToggleSeries: (value: string) => void;
  onToggleHasOffer: () => void;
  onClear: () => void;
}

function SingleSelectGroup({
  title,
  options,
  active,
  onToggle,
}: {
  title: string;
  options: SupplierModelFacetOption[];
  active?: string;
  onToggle: (value: string) => void;
}) {
  if (!options || options.length === 0) return null;
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h4>
      <ul className="space-y-1">
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => onToggle(opt.value)}
                className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left text-xs transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="line-clamp-1">{opt.label}</span>
                <span className="text-slate-400">{opt.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SupplierModelFacetPanel({
  facets,
  loading,
  selected,
  onToggleBrand,
  onToggleSeries,
  onToggleHasOffer,
  onClear,
}: SupplierModelFacetPanelProps) {
  if (!loading && !facets) return null;

  const hasActive = !!selected.brand || !!selected.series || !!selected.hasOffer;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">供应商型号筛选</h3>
        {hasActive && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            清除
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3.5 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-5 w-full bg-slate-100 rounded" />
              <div className="h-5 w-4/5 bg-slate-100 rounded mt-1" />
            </div>
          ))}
        </div>
      )}

      {!loading && facets && (
        <>
          {/* Commercial availability */}
          <div className="border-b border-slate-100 py-2">
            <button
              type="button"
              onClick={onToggleHasOffer}
              className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                selected.hasOffer
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>仅有有效 Offer</span>
              <span className="text-slate-400">{facets.commercial.hasActiveOffer}</span>
            </button>
          </div>

          <SingleSelectGroup
            title="品牌"
            options={facets.brands}
            active={selected.brand}
            onToggle={onToggleBrand}
          />
          <SingleSelectGroup
            title="系列"
            options={facets.series}
            active={selected.series}
            onToggle={onToggleSeries}
          />
        </>
      )}
    </div>
  );
}