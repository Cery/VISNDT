import type { CSSProperties } from 'react';
import { radius, spacing, typography } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE } from '../shared';
import type { PresentationStep, WorkflowStepState } from './status-presentation';

/** 单步节点状态 → 视觉（色 / 填充） */
const STATE_STYLE: Record<
  WorkflowStepState,
  { fg: string; bg: string; border: string; solid: boolean }
> = {
  completed: { fg: SOFTER_TONE_STYLE.success.fg, bg: SOFTER_TONE_STYLE.success.bg, border: SOFTER_TONE_STYLE.success.fg, solid: true },
  current: { fg: SOFTER_TONE_STYLE.primary.fg, bg: SOFTER_TONE_STYLE.primary.bg, border: SOFTER_TONE_STYLE.primary.fg, solid: false },
  pending: { fg: SOFTER_TONE_STYLE.neutral.fg, bg: SOFTER_TONE_STYLE.neutral.bg, border: SOFTER_TONE_STYLE.neutral.border, solid: false },
};

const STATE_LABEL: Record<WorkflowStepState, string> = {
  completed: '已完成',
  current: '当前',
  pending: '未开始',
};

export interface WorkflowStepProps {
  step: PresentationStep;
  isLast?: boolean;
  /** 是否展示节点状态徽标（当前/已完成/未开始） */
  showStateLabel?: boolean;
  className?: string;
}

/** 单条时间线节点（纯展示）。 */
export default function WorkflowStep({
  step,
  isLast = false,
  showStateLabel = true,
  className,
}: WorkflowStepProps) {
  const s = STATE_STYLE[step.state];

  const node: React.CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: s.solid ? 'none' : `2px solid ${s.border}`,
    background: s.solid ? s.fg : '#fff',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    flexDirection: 'column',
  };
  const innerDot: React.CSSProperties = step.state === 'current'
    ? { width: 6, height: 6, borderRadius: '50%', background: s.fg, display: 'block' }
    : { width: step.state === 'completed' ? 8 : 4, height: step.state === 'completed' ? 4 : 4, borderRadius: step.state === 'completed' ? '50%' : '50%', display: 'block' };
  const isCurrent = step.state === 'current';
  if (isCurrent) innerDot.border = `3px solid ${s.bg}`;

  return (
    <div className={className} style={{ display: 'flex', gap: spacing[3], position: 'relative' }}>
      {/* 左：节点 + 纵向连接线 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
        <span style={{ ...node, ...(isCurrent ? { boxShadow: `0 0 0 4px ${s.bg}` } : {}) }} aria-hidden="true">
          <span style={innerDot} aria-hidden="true" />
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            style={{
              flex: 1,
              width: 2,
              minHeight: 20,
              background: step.state === 'pending' ? SOFTER_TONE_STYLE.neutral.border : s.fg,
              opacity: 0.55,
              marginTop: 2,
            }}
          />
        )}
      </div>

      {/* 右：内容 */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : spacing[6] }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing[2] }}>
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: 600, color: isCurrent ? SOFTER_TONE_STYLE.primary.fg : '#0f172a' }}>
            {step.label}
          </span>
          {showStateLabel && (
            <span style={{ fontSize: 11, color: s.fg, fontWeight: 500 }}>{STATE_LABEL[step.state]}</span>
          )}
          {step.date && (
            <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>
              {new Date(step.date).toLocaleDateString()}
            </span>
          )}
        </div>
        {step.description && (
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{step.description}</div>
        )}
      </div>
    </div>
  );
}