'use client';

/**
 * VISNDT Visual Language v1 — Engineering Context Tags (M35).
 *
 * Application / Detection Object 语义标签展示：两者均为 SEMANTIC / DERIVED，
 * 由现有 Product / Category 确定性派生，不创建任何独立 Entity / Schema。
 * 纯展示层组件；flex-wrap 布局，避免新增水平溢出（375 可用）。
 */

interface EngineeringContextTagsProps {
  /** 检测应用场景（分类确定性推导，可为空）。 */
  application?: string | null;
  /** 检测对象（分类确定性推导的语义角色，可为空）。 */
  detectionObject?: string | null;
  className?: string;
}

export default function EngineeringContextTags({
  application,
  detectionObject,
  className = '',
}: EngineeringContextTagsProps) {
  const hasApplication = Boolean(application);
  const hasDetectionObject = Boolean(detectionObject);

  if (!hasApplication && !hasDetectionObject) return null;

  return (
    <div
      className={`flex flex-wrap items-start gap-2 rounded-xl border border-slate-200/80 bg-white/70 p-3 ${className}`}
    >
      {hasApplication && (
        <span className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-industrial-cyan/20 bg-industrial-cyan/10 px-2.5 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-industrial-cyan">
            应用
          </span>
          <span className="text-xs text-slate-700">{application}</span>
        </span>
      )}
      {hasDetectionObject && (
        <span className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-industrial-amber/20 bg-industrial-amber/10 px-2.5 py-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-industrial-amber">
            检测对象
          </span>
          <span className="text-xs text-slate-700">{detectionObject}</span>
        </span>
      )}
    </div>
  );
}