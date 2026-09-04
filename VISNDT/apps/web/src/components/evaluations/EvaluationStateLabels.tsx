import type { EvaluationState } from '@/lib/api/evaluations';

/**
 * Evaluation state presentation — M34.7 frozen 4-state semantics.
 * NOT_EVALUATED is a UI-derived state (not a persisted enum value).
 * State indication is text + color (never color-only).
 */

export const EVALUATION_STATES: { value: EvaluationState | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '全部' },
  { value: 'INTERESTED', label: '感兴趣' },
  { value: 'SHORTLISTED', label: '短名单' },
  { value: 'COMPARING', label: '对比中' },
  { value: 'CONTACTED', label: '已联系' },
];

const STATE_META: Record<
  EvaluationState,
  { label: string; badgeClass: string; dotClass: string }
> = {
  INTERESTED: {
    label: '感兴趣',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClass: 'bg-sky-500',
  },
  SHORTLISTED: {
    label: '短名单',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  COMPARING: {
    label: '对比中',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  CONTACTED: {
    label: '已联系',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
};

export interface EvaluationStateItem {
  value: EvaluationState;
  label: string;
}

export function getStateLabel(state: EvaluationState): string {
  return STATE_META[state]?.label ?? state;
}

export function getStateMeta(state: EvaluationState) {
  return STATE_META[state] ?? STATE_META.INTERESTED;
}

export default function EvaluationStateChip({ state }: { state: EvaluationState }) {
  const meta = getStateMeta(state);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}