import type { ProductParameterValue } from '@/types/product';
import { getParameterCapabilityHint } from '@/lib/capability-glossary';

/**
 * VISNDT Visual Language v1 — Capability Summary.
 *
 * 产品「核心能力 / 技术特点」摘要：从技术参数聚合出确定性的能力解释要点。
 * 纯展示层聚合，不涉及 AI / 评分 / 检索。
 */

interface CapabilitySummaryProps {
  /** 产品技术参数（不含 null；详情页透传 parameterValues） */
  parameters?: ProductParameterValue[];
  className?: string;
}

export default function CapabilitySummary({ parameters = [], className = '' }: CapabilitySummaryProps) {
  const hints = parameters
    .map((pv) => getParameterCapabilityHint(pv.parameterDefinition.name, pv.parameterDefinition.code))
    .filter((h): h is string => Boolean(h))
    .filter((h, i, arr) => arr.indexOf(h) === i)
    .slice(0, 4);

  if (hints.length === 0) return null;

  return (
    <div className={`rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rotate-45 bg-primary" aria-hidden="true" />
        核心能力
      </h3>
      <ul className="space-y-2">
        {hints.map((h, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="w-1 h-1 rotate-45 bg-industrial-cyan mt-1.5 shrink-0" aria-hidden="true" />
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}