'use client';

import { EVALUATION_STATES } from './EvaluationStateLabels';

interface EvaluationStateFilterProps {
  current: string; // 'ALL' or an EvaluationState
  counts: Record<string, number>;
  onSelect: (state: string) => void;
}

/**
 * M34.7 Evaluation state filter — tabs expressed via URL query (not a parallel route).
 * Desktop: static tab bar. Mobile: horizontally scrollable, no overflow.
 */
export default function EvaluationStateFilter({
  current,
  counts,
  onSelect,
}: EvaluationStateFilterProps) {
  return (
    <nav
      aria-label="评估状态筛选"
      className="flex gap-1.5 overflow-x-auto pb-1 -mb-1 md:overflow-visible md:flex-wrap"
    >
      {EVALUATION_STATES.map(({ value, label }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={active}
            aria-label={`筛选${label}`}
            className={`inline-flex min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-slate-900 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
            {counts[value] !== undefined && value !== 'ALL' && (
              <span
                className={`rounded-full px-1.5 text-[11px] leading-4 ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {counts[value]}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}