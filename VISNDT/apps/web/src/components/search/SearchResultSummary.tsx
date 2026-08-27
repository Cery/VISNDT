interface SearchResultSummaryItem {
  label: string;
  value: number;
}

interface SearchResultSummaryProps {
  /** Total matching capability count across all domains */
  total: number;
  /** Per-domain counts (only non-zero items are rendered) */
  counts: SearchResultSummaryItem[];
}

/**
 * 703_M29.3 — Search Result Summary.
 *
 * Immediately communicates what the search found across the capability
 * domains, grounded entirely in the existing unified /search response counts
 * (products / solutions / supplier-products / knowledge). No new API / table.
 */
export default function SearchResultSummary({ total, counts }: SearchResultSummaryProps) {
  if (total <= 0) return null;

  const visible = counts.filter((c) => c.value > 0);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-industrial-sm px-4 py-3 mb-4 sm:px-5 sm:mb-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm font-semibold text-foreground">
          发现 {total} 项相关检测能力
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {visible.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
            >
              {c.label}
              <strong className="font-semibold text-slate-800">{c.value}</strong>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}