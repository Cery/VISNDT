import { getCategoryScenario } from '@/lib/capability-glossary';

/**
 * VISNDT Visual Language v1 — Application Scenario.
 *
 * 检测场景展示：基于确定性词表将「检测分类」推导为「检测场景」描述，
 * 属于展示层语义，不涉及 AI / 检索。
 */

interface ApplicationScenarioProps {
  /** 分类英文名（用于确定性推导检测场景） */
  categoryName?: string | null;
  /** 显式场景文本（可选，覆盖推导） */
  scenario?: string | null;
  /** 紧凑模式（用于产品卡片） */
  compact?: boolean;
  className?: string;
}

export default function ApplicationScenario({
  categoryName,
  scenario,
  compact = false,
  className = '',
}: ApplicationScenarioProps) {
  const text = scenario ?? (categoryName ? getCategoryScenario(categoryName) : null);
  if (!text) return null;

  if (compact) {
    return (
      <div className={`flex items-start gap-1.5 text-xs text-slate-500 ${className}`}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="mt-0.5 text-industrial-cyan shrink-0"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
        </svg>
        <span className="leading-snug line-clamp-2">{text}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 rounded-xl border border-industrial-cyan/15 bg-industrial-cyan/5 p-4 ${className}`}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-industrial-cyan shrink-0 mt-0.5"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
      </svg>
      <div>
        <p className="text-xs font-semibold text-industrial-cyan tracking-wider uppercase">检测场景</p>
        <p className="text-sm text-slate-600 mt-1">{text}</p>
      </div>
    </div>
  );
}