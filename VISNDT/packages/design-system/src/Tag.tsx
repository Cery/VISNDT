import type { ReactNode } from 'react';
import { radius, spacing } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE, type Tone } from './shared';

export interface TagProps {
  tone?: Tone;
  children?: ReactNode;
  dot?: boolean;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

/** Tag：语义标签（浅底深文，状态语义治理载体）。 */
export default function Tag({ tone = 'neutral', children, dot = false, closable = false, onClose, className }: TagProps) {
  const s = SOFTER_TONE_STYLE[tone];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        borderRadius: radius.sm,
        padding: `2px ${spacing[2]}px`,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: '18px',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', opacity: 0.9 }}
        />
      )}
      {children}
      {closable && (
        <button
          aria-label="close"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            marginLeft: 2,
            color: 'inherit',
            fontSize: 13,
            lineHeight: 1,
            display: 'inline-flex',
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}