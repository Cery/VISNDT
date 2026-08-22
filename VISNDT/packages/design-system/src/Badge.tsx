import type { ReactNode } from 'react';
import { radius, spacing } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE, type Tone } from './shared';

/** Badge：带数量圆点的标记（右上角计数 / 状态点）。 */
export interface BadgeProps {
  count?: number | ReactNode;
  tone?: Tone;
  dot?: boolean;
  overflow?: number;
  children?: ReactNode;
  className?: string;
}

export default function Badge({
  count,
  tone = 'primary',
  dot = false,
  overflow = 99,
  children,
  className,
}: BadgeProps) {
  const s = SOFTER_TONE_STYLE[tone];
  const showCount = count && Number(count) > 0;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} className={className}>
      {children}
      {(dot || showCount) && (
        <span
          aria-label={dot ? undefined : String(count)}
          style={{
            position: 'absolute',
            top: dot ? -2 : -6,
            right: dot ? -2 : -6,
            minWidth: dot ? 8 : 18,
            height: dot ? 8 : 18,
            borderRadius: dot ? '50%' : radius.full,
            background: s.fg,
            color: '#ffffff',
            fontSize: 11,
            fontWeight: 600,
            padding: dot ? 0 : `0 ${spacing[1]}px`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            boxShadow: '0 0 0 2px #ffffff',
          }}
        >
          {!dot && showCount && Number(count) > overflow ? `${overflow}+` : count}
        </span>
      )}
    </span>
  );
}