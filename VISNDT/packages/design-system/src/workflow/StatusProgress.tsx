import type { CSSProperties } from 'react';
import { radius, spacing, typography } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE } from '../shared';
import type { WorkflowStepDef, WorkflowStepState } from './status-presentation';

export interface StatusProgressProps {
  /** 阶段定义（按执行顺序） */
  stages: WorkflowStepDef[];
  /** 各阶段状态（长度与 stages 一致） */
  states: WorkflowStepState[];
  /** 面板标题 */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

/** 水平「阶段进度条」：直观展示推进到第几阶段（纯展示）。 */
export default function StatusProgress({
  stages,
  states,
  title,
  className,
  style,
}: StatusProgressProps) {
  if (stages.length === 0) return null;

  const total = stages.length;
  const progressed = states.filter((s) => s === 'completed' || s === 'current').length;

  return (
    <div
      className={className}
      style={{
        background: '#fff',
        border: `1px solid ${SOFTER_TONE_STYLE.neutral.border}`,
        borderRadius: radius.lg,
        padding: spacing[6],
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            fontSize: typography.fontSize.sm,
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: spacing[4],
          }}
        >
          <span>{title}</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
            {Math.round((progressed / total) * 100)}%
          </span>
        </div>
      )}

      {/* 分段进度条 */}
      <div style={{ display: 'flex', gap: 4 }}>
        {stages.map((stage, index) => {
          const state = states[index] ?? 'pending';
          const s = SOFTER_TONE_STYLE[state === 'pending' ? 'neutral' : state === 'current' ? 'primary' : 'success'];
          return (
            <span
              key={stage.key}
              style={{
                flex: 1,
                height: 6,
                borderRadius: radius.full,
                background: state === 'pending' ? SOFTER_TONE_STYLE.neutral.border : s.fg,
                opacity: state === 'pending' ? 1 : 0.9,
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* 阶段标签 */}
      <div style={{ display: 'flex', gap: 4, marginTop: spacing[2] }}>
        {stages.map((stage, index) => {
          const state = states[index] ?? 'pending';
          const active = state === 'current';
          return (
            <span
              key={stage.key}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                color: active ? SOFTER_TONE_STYLE.primary.fg : '#64748b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {stage.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}