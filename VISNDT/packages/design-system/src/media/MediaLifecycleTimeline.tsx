import type { CSSProperties } from 'react';
import WorkflowTimeline from '../workflow/WorkflowTimeline';
import { buildMediaLifecycle, type MediaGovernanceInput } from './media-presentation';

export interface MediaLifecycleTimelineProps {
  /** 既有 FileAsset 子集字段（含 createdAt） */
  input: MediaGovernanceInput & { createdAt?: string | null };
  title?: string;
  showStateLabel?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * 媒体生命周期时间线（Presentation State，非数据库状态机）。
 * 由既有字段确定性推导，展示 Created → Referenced → Displayed → Maintained → Archived Candidate。
 * 复用 642 WorkflowTimeline。
 */
export default function MediaLifecycleTimeline({
  input,
  title = '媒体生命周期',
  showStateLabel = true,
  className,
  style,
}: MediaLifecycleTimelineProps) {
  const steps = buildMediaLifecycle(input);
  return (
    <WorkflowTimeline
      title={title}
      steps={steps}
      showStateLabel={showStateLabel}
      className={className}
      style={style}
    />
  );
}