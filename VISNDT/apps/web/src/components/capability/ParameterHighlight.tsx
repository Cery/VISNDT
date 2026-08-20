import { getParameterCapabilityHint } from '@/lib/capability-glossary';

/**
 * VISNDT Visual Language v1 — Parameter Highlight.
 *
 * 将「原始参数数值」升级为「能力解释」：命中词表时，在参数值下方以能力语义
 * 提示补充说明。纯展示层，不修改参数数据结构。
 */

interface ParameterHighlightProps {
  name: string;
  code?: string | null;
  className?: string;
}

export default function ParameterHighlight({ name, code, className = '' }: ParameterHighlightProps) {
  const hint = getParameterCapabilityHint(name, code);
  if (!hint) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-xs text-primary/80 ${className}`}>
      <span className="w-1 h-1 rotate-45 bg-primary/60 shrink-0" aria-hidden="true" />
      {hint}
    </span>
  );
}