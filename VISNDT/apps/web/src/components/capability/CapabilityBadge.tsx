/**
 * VISNDT Visual Language v1 — Capability Badge.
 *
 * 能力属性标签：比 CapabilityLabel 多一个工业节点头前缀与可选能力解释 tooltip，
 * 用于表达「能力标签 / 分类入口 / 技术特点」等能力语义。
 */

interface CapabilityBadgeProps {
  label: string;
  /** 能力属性语义色调 */
  tone?: 'cyan' | 'amber' | 'primary' | 'neutral';
  /** 可选能力解释（title / tooltip） */
  hint?: string;
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<CapabilityBadgeProps['tone']>, string> = {
  cyan: 'bg-industrial-cyan/10 text-industrial-cyan border-industrial-cyan/20',
  amber: 'bg-industrial-amber/10 text-industrial-amber border-industrial-amber/20',
  primary: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function CapabilityBadge({
  label,
  tone = 'cyan',
  hint,
  className = '',
}: CapabilityBadgeProps) {
  return (
    <span
      title={hint}
      className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium border ${TONE_CLASSES[tone]} ${className}`}
    >
      <span className="w-1 h-1 rotate-45 bg-current shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}