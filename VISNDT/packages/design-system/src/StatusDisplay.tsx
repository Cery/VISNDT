import type { ReactNode } from 'react';
import { SOFTER_TONE_STYLE, type Tone } from './shared';

export type StatusPresentation = 'tag' | 'badge' | 'text';

export interface StatusDisplayProps {
  /** 原始业务状态字符串或直接语义色调 */
  status?: string | null;
  tone?: Tone;
  label?: ReactNode;
  /** tag=浅底标签（默认），badge=实心圆点，text=纯文着色 */
  variant?: StatusPresentation;
  dot?: boolean;
  className?: string;
}

/** 统一状态呈现（语义治理载体，跨 Web/Admin）。 */
export default function StatusDisplay({ status, tone, label, variant = 'tag', dot = true, className }: StatusDisplayProps) {
  const t = tone ?? (resolveGuarded(status) as Tone);
  const s = SOFTER_TONE_STYLE[t];
  const text: ReactNode = label ?? status ?? t;
  const shared: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '18px',
  };

  if (variant === 'text') {
    return (
      <span className={className} style={{ ...shared, color: s.fg }}>{text}</span>
    );
  }
  if (variant === 'badge') {
    return (
      <span className={className} style={{ ...shared, display: 'inline-flex', alignItems: 'center', gap: 6, color: s.fg }}>
        <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: s.fg, display: 'inline-block', opacity: 0.9 }} />
        {text}
      </span>
    );
  }
  return (
    <span
      className={className}
      style={{
        ...shared,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        borderRadius: 6,
        padding: '2px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block', opacity: 0.9 }} />
      )}
      {text}
    </span>
  );
}

function resolveGuarded(status?: string | null): Tone {
  // 轻量内联映射（避免与本包强耦合引入额外导出循环）
  const key = (status ?? '').trim().toUpperCase();
  if (!key) return 'neutral';
  const map: Record<string, Tone> = {
    ACTIVE: 'success', PUBLISHED: 'success', ACCEPTED: 'success', APPROVED: 'success', COMPLETED: 'success',
    SUBMITTED: 'info', PROCESSING: 'info', IN_PROGRESS: 'info', OPEN: 'info', UNDER_REVIEW: 'info',
    PENDING: 'warning', PENDING_REVIEW: 'warning', UNREAD: 'warning', WARNING: 'warning',
    REJECTED: 'error', CANCELLED: 'error', FAILED: 'error', ERROR: 'error', BLOCKED: 'error', SUSPENDED: 'error',
    DRAFT: 'neutral', CLOSED: 'neutral', DISABLED: 'neutral', ARCHIVED: 'neutral', EXPIRED: 'neutral',
  };
  return map[key] ?? 'neutral';
}