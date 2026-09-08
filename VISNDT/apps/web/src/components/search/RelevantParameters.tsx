import type { ParameterFacet } from '@/lib/api/search';

/**
 * M36 Engineering Discovery Search — Relevant Technical Parameters.
 *
 * Surfaces the engineering-relevant parameter dimensions of the current query
 * directly on result cards so an engineer sees "why this result is relevant":
 *   - shows the query-level common technical parameters (intersection), sourced
 *     entirely from the existing /search/context response (no new API / table);
 *   - highlights any parameter that is currently being filtered (matched
 *     technical constraint = engineering relevance).
 *
 * Deliberately compact & mobile-safe: flex-wrap, truncated labels, no hard
 * width → no horizontal overflow at 375/768/1024/1440.
 */
interface RelevantParametersProps {
  /** Common (intersection) technical parameters of the query */
  params: ParameterFacet[];
  /** parameterId → selected values for the current query (active filters) */
  activeFilters?: Record<string, string[]>;
  /** Small caption describing what is shown (e.g. 相关技术参数) */
  caption?: string;
  /** Max parameters to render (avoid clutter) */
  limit?: number;
  /** Max values to show per parameter (compact cards default 2) */
  valuesLimit?: number;
}

const DEFAULT_MAX_VALUES_PER_PARAM = 2;

export default function RelevantParameters({
  params,
  activeFilters,
  caption = '相关技术参数',
  limit = 4,
  valuesLimit = DEFAULT_MAX_VALUES_PER_PARAM,
}: RelevantParametersProps) {
  if (!params || params.length === 0) return null;

  const visible = params.slice(0, limit);

  return (
    <div className="mt-3 pt-3 border-t border-slate-100">
      <div className="flex items-center gap-1.5 mb-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
          {caption}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {visible.map((param) => {
          const selectedValues = activeFilters?.[param.parameterId];
          const isFiltered = !!selectedValues && selectedValues.length > 0;
          const values = param.availableValues.slice(0, valuesLimit);
          const totalValues = param.availableValues.length;
          const valueText = values
            .map((v) => `${v.label}${param.unit ? ` ${param.unit}` : ''}`)
            .join(' · ');

          return (
            <span
              key={param.parameterId}
              className={`inline-flex items-center gap-1 max-w-full sm:max-w-[calc(50%-0.375rem)] min-w-0 overflow-hidden text-[11px] rounded-md border px-2 py-1 ${
                isFiltered
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-500'
              }`}
            >
              <span className="font-medium text-slate-600 truncate shrink-0">
                {param.parameterName}
              </span>
              {values.length > 0 && (
                <span className="flex items-center gap-1 min-w-0">
                  <span className={`truncate ${isFiltered ? 'font-semibold text-emerald-700' : ''}`}>
                    {valueText}
                  </span>
                  {totalValues > valuesLimit && <span className="shrink-0">等</span>}
                </span>
              )}
              {isFiltered && <span className="font-semibold shrink-0">· 已匹配</span>}
            </span>
          );
        })}
      </div>
    </div>
  );
}