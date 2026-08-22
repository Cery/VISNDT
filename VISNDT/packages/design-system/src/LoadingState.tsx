import type { ReactNode } from 'react';
import { colors, motion, spacing } from '@visndt/design-tokens';

export interface LoadingStateProps {
  label?: ReactNode;
  /** spinner | skeleton | fullscreen(-ish 内联) */
  variant?: 'spinner' | 'skeleton' | 'inline';
  lines?: number;
  className?: string;
}

/** 统一加载态。 */
export default function LoadingState({ label = '加载中…', variant = 'spinner', lines = 3, className }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className={className} role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: spacing[2], color: colors.neutral['400'], fontSize: 13 }}>
        <Spinner size={16} />
        {label}
      </div>
    );
  }
  if (variant === 'skeleton') {
    return (
      <div className={className} role="status" aria-label={String(label)} style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            style={{
              height: 14,
              borderRadius: 6,
              background: `linear-gradient(90deg, ${colors.neutral['100']} 25%, ${colors.neutral['200']} 37%, ${colors.neutral['100']} 63%)`,
              backgroundSize: '400% 100%',
              animation: `vds-skeleton ${motion.duration.slow * 3}ms ${motion.easing.standard} infinite`,
              width: i === lines - 1 ? '60%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={className}
      role="status"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing[3], padding: spacing[8] }}
    >
      <Spinner size={28} />
      {label && <span style={{ fontSize: 13, color: colors.neutral['400'] }}>{label}</span>}
    </div>
  );
}

function Spinner({ size }: { size: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `2px solid ${colors.neutral['200']}`,
        borderTopColor: colors.primary,
        display: 'inline-block',
        animation: 'vds-spin 800ms linear infinite',
      }}
    />
  );
}

export const VDS_KEYFRAMES = `
@keyframes vds-spin { to { transform: rotate(360deg); } }
@keyframes vds-skeleton { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }
`;