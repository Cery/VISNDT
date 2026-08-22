/**
 * @visndt/design-system
 * VISNDT UI Primitive Layer v1.0
 *
 * 每个组件对应一个 code component + usage example（见 README / 组件注释）。
 * 主题兼容：仅依赖 @visndt/design-tokens，不引用宿主 CSS。
 */

// 本库为客户端可交互组件集合（含 useState 等 React Hook），标记为 Client Component。
'use client';

export { default as Button } from './Button';
export type { ButtonProps } from './Button';

export { default as Input } from './Input';
export type { InputProps } from './Input';

export { default as Card } from './Card';
export type { CardProps } from './Card';

export { default as Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { default as Tag } from './Tag';
export type { TagProps } from './Tag';

export { default as SectionHeader } from './SectionHeader';
export type { SectionHeaderProps } from './SectionHeader';

export { default as Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { default as EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { default as LoadingState, VDS_KEYFRAMES } from './LoadingState';
export type { LoadingStateProps } from './LoadingState';

export { default as StatusDisplay } from './StatusDisplay';
export type { StatusDisplayProps } from './StatusDisplay';

export { default as IconWrapper } from './IconWrapper';
export type { IconWrapperProps } from './IconWrapper';

export { default as LayoutContainer } from './LayoutContainer';
export type { LayoutContainerProps } from './LayoutContainer';

export { default as BusinessIdentityBadge } from './BusinessIdentityBadge';
export type { BusinessIdentityBadgeProps } from './BusinessIdentityBadge';

export { default as WorkflowTimeline } from './workflow/WorkflowTimeline';
export type { WorkflowTimelineProps } from './workflow/WorkflowTimeline';

export { default as WorkflowStep } from './workflow/WorkflowStep';
export type { WorkflowStepProps } from './workflow/WorkflowStep';

export { default as StatusProgress } from './workflow/StatusProgress';
export type { StatusProgressProps } from './workflow/StatusProgress';

export { default as MatchExplanationCard } from './workflow/MatchExplanationCard';
export type { MatchExplanationCardProps, MatchFactor } from './workflow/MatchExplanationCard';

export { default as NextActionHint } from './workflow/NextActionHint';
export type { NextActionHintProps } from './workflow/NextActionHint';

export {
  RFQ_STATUS_PRESENTATION,
  RFQ_TIMELINE_STEPS,
  DEMAND_STATUS_PRESENTATION,
  DEMAND_TIMELINE_STEPS,
  MATCH_STATUS_PRESENTATION,
  RFQ_RESPONSE_STATUS_PRESENTATION,
  buildRfqTimeline,
  buildDemandTimeline,
  presentStatus,
} from './workflow/status-presentation';
export type {
  StatusPresentation,
  PresentationStep,
  WorkflowStepDef,
  WorkflowStepState,
} from './workflow/status-presentation';

export { default as MediaGovernanceBadge } from './media/MediaGovernanceBadge';
export type { MediaGovernanceBadgeProps } from './media/MediaGovernanceBadge';

export { default as MediaLifecycleTimeline } from './media/MediaLifecycleTimeline';
export type { MediaLifecycleTimelineProps } from './media/MediaLifecycleTimeline';

export { default as MediaFileCard } from './media/MediaFileCard';
export type { MediaFileCardProps } from './media/MediaFileCard';

export {
  MEDIA_GOVERNANCE_PRESENTATION,
  MEDIA_LIFECYCLE_STEPS,
  MEDIA_LIFECYCLE_STAGE_INDEX,
  deriveMediaGovernanceState,
  buildMediaLifecycle,
} from './media/media-presentation';
export type {
  MediaGovernanceState,
  MediaStatusPresentation,
  MediaGovernanceInput,
  MediaLifecycleStage,
  MediaLifecycleStepDef,
} from './media/media-presentation';

export type { PrimitiveProps, Tone } from './shared';

export { default as RuleResultDisplay } from './rule/RuleResultDisplay';
export type { RuleResultDisplayProps, RuleResultDisplayData } from './rule/RuleResultDisplay';