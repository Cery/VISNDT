'use client';

import Link from 'next/link';
import type { BuyerEvaluation, EvaluationState } from '@/lib/api/evaluations';
import EvaluationStateChip, { getStateLabel } from './EvaluationStateLabels';
import { EVALUATION_STATES } from './EvaluationStateLabels';

/**
 * Resolved target context for an evaluation row.
 *  - product  : Catalog / Capability evaluation (Product)
 *  - supplier : Specific Supplier-owned supply evaluation (SupplierProduct)
 */
export interface EvaluationTargetContext {
  status: 'loading' | 'ready' | 'error' | 'missing';
  kind: 'product' | 'supplier';
  productId: string;
  productName: string;
  /** Display title (Product name or SupplierProduct brand+model). */
  label: string;
  supplierLabel?: string;
  orgId?: string | null;
  orgName?: string;
}

interface EvaluationListItemProps {
  evaluation: BuyerEvaluation;
  context: EvaluationTargetContext;
  selected: boolean;
  onToggleSelect: () => void;
  onStateChange: (next: EvaluationState) => void;
  onDelete: () => void;
  onConnect: () => void;
}

const STATE_OPTIONS = EVALUATION_STATES.filter((s) => s.value !== 'ALL');

function TargetBadge({ kind }: { kind: 'product' | 'supplier' }) {
  return kind === 'supplier' ? (
    <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 uppercase">
      供应商供应
    </span>
  ) : (
    <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 uppercase">
      能力评估
    </span>
  );
}

export default function EvaluationListItem({
  evaluation,
  context,
  selected,
  onToggleSelect,
  onStateChange,
  onDelete,
  onConnect,
}: EvaluationListItemProps) {
  const isReady = context.status === 'ready';
  const isMissing = context.status === 'missing';

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-industrial-sm transition-colors sm:flex-row sm:items-center sm:justify-between ${
        selected ? 'border-primary ring-1 ring-primary/30' : 'border-slate-200/80'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {/* Compare selection checkbox */}
        <button
          type="button"
          onClick={onToggleSelect}
          aria-pressed={selected}
          aria-label="选择该评估进行对比"
          disabled={!isReady}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
            selected
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white text-transparent hover:border-slate-400'
          } disabled:opacity-40`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Target context */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TargetBadge kind={context.kind} />
            <EvaluationStateChip state={evaluation.state} />
          </div>

          {context.status === 'loading' && (
            <p className="mt-2 animate-pulse text-sm text-slate-400">正在加载目标信息…</p>
          )}

          {context.status === 'error' && (
            <p className="mt-2 text-sm text-slate-500">目标信息加载失败。</p>
          )}

          {isMissing && (
            <p className="mt-2 text-sm text-slate-500">
              该评估的目标已移除或不可访问，可删除此评估。
            </p>
          )}

          {isReady && (
            <>
              <Link
                href={`/products/${context.productId}`}
                className="mt-2 block truncate text-base font-semibold text-slate-900 hover:text-primary"
                title={context.label}
              >
                {context.label}
              </Link>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {context.kind === 'supplier' && context.orgName
                  ? `${context.orgName} · ${context.productName}`
                  : context.productName}
              </p>
            </>
          )}

          {evaluation.note && (
            <p className="mt-2 truncate text-xs italic text-slate-400">备注：{evaluation.note}</p>
          )}
        </div>
      </div>

      {/* Contextual actions: Missing target -> only delete. Ready -> full actions. */}
      {isMissing || !isReady ? (
        <div className="flex gap-2 sm:flex-col sm:items-end">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            删除评估
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          {/* State transition (PATCH) */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">状态</span>
            <select
              value={evaluation.state}
              onChange={(e) => onStateChange(e.target.value as EvaluationState)}
              aria-label={`更新 ${context.label} 的评估状态`}
              className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {STATE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value as string}>
                  {getStateLabel(value as EvaluationState)}（{label}）
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onConnect}
              aria-label={`对 ${context.label} 发起询价`}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14M5 19l9-6" />
              </svg>
              询价
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={`删除对 ${context.label} 的评估`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-red-200 px-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}