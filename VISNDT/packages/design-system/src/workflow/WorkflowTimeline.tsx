import type { CSSProperties } from 'react';
import { radius, spacing, typography } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE } from '../shared';
import WorkflowStep from './WorkflowStep';
import type { PresentationStep } from './status-presentation';

export interface WorkflowTimelineProps {
  /** 按顺序排列的时间线步骤（含状态） */
  steps: PresentationStep[];
  /** 面板标题 */
  title?: string;
  /** 展示节点状态徽标 */
  showStateLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** 垂直「业务流程时间线」：历史节点 / 当前节点 / 下一节点（纯展示）。 */
export default function WorkflowTimeline({
  steps,
  title,
  showStateLabel = true,
  className,
  style,
}: WorkflowTimelineProps) {
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
            alignItems: 'center',
            gap: spacing[2],
            fontSize: typography.fontSize.sm,
            fontWeight: 600,
            color: '#0f172a',
            marginBottom: spacing[4],
          }}
        >
          {title}
        </div>
      )}
      <div>
        {steps.map((step, index) => (
          <WorkflowStep
            key={step.key}
            step={step}
            isLast={index === steps.length - 1}
            showStateLabel={showStateLabel}
          />
        ))}
      </div>
    </div>
  );
}