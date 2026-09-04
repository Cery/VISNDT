import type { RelevantCategoryContext } from '@/lib/api/search';

/**
 * M36 — Engineering Discovery IA Framing.
 *
 * Frames the results surface around the discoverer's engineering questions
 * ("which capability are you inspecting", "which technical constraints matter"),
 * instead of a generic keyword hit list. Grounded entirely in the existing
 * `/search/context` payload (relevantCategories + commonFilters). No new API.
 */
interface EngineeringDiscoveryFramingProps {
  categories: RelevantCategoryContext[];
  /** Number of common technical parameters surfaced for this query */
  paramCount: number;
  /** Total selectable values across those parameters */
  totalParamValues: number;
}

export default function EngineeringDiscoveryFraming({
  categories,
  paramCount,
  totalParamValues,
}: EngineeringDiscoveryFramingProps) {
  const hasCategories = categories.length > 0;
  const hasParams = paramCount > 0;

  if (!hasCategories && !hasParams) return null;

  return (
    <section className="rounded-xl border border-slate-200/80 bg-white shadow-industrial-sm px-4 py-4 mb-4 sm:px-5 sm:mb-6">
      <div className="flex items-center gap-2 mb-2.5">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
        </svg>
        <h3 className="text-sm font-semibold text-foreground">工程发现</h3>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
        {hasCategories && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-400">能力分类</span>
            <span className="flex flex-wrap items-center gap-1.5">
              {categories.slice(0, 4).map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-emerald-700"
                >
                  {c.name}
                  <span className="ml-1 text-emerald-400">{c.productCount}</span>
                </span>
              ))}
            </span>
          </span>
        )}

        {hasParams && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-slate-400">技术约束</span>
            <span className="font-semibold text-emerald-700">
              {paramCount} 项参数 · {totalParamValues} 个可选值
            </span>
            <span className="text-slate-400">可用于筛选</span>
          </span>
        )}
      </div>
    </section>
  );
}