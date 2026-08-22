import StatusDisplay from '../StatusDisplay';
import type { Tone } from '../shared';
import type { MediaGovernanceState } from './media-presentation';
import { MEDIA_GOVERNANCE_PRESENTATION } from './media-presentation';

export interface MediaGovernanceBadgeProps {
  /** 治理展示状态 */
  state: MediaGovernanceState;
  /** 覆盖默认标签（默认取契约 label） */
  label?: string;
  variant?: 'tag' | 'badge' | 'text';
  className?: string;
}

/** SemanticTone → StatusDisplay Tone（复用 642 的映射方式，不新增颜色体系） */
const TONE_MAP: Record<string, Tone> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  cyan: 'info',
  primary: 'primary',
  violet: 'primary',
  neutral: 'neutral',
};

/** 治理状态徽标：由 MediaStatusPresentationContract 驱动的统一展示。 */
export default function MediaGovernanceBadge({
  state,
  label,
  variant = 'tag',
  className,
}: MediaGovernanceBadgeProps) {
  const p = MEDIA_GOVERNANCE_PRESENTATION[state];
  return (
    <StatusDisplay
      status={state}
      tone={TONE_MAP[p.tone]}
      label={label ?? p.label}
      variant={variant}
      className={className}
    />
  );
}