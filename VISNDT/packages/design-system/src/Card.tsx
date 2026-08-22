import type { ReactNode } from 'react';
import { colors, radius, spacing, shadow, border } from '@visndt/design-tokens';
import { TONE_STYLE, type PrimitiveProps, type Tone } from './shared';

export interface CardProps extends Omit<PrimitiveProps, 'as'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: number | 'none';
  bordered?: boolean;
  /** 顶部强调条色调（工业感） */
  accent?: Tone | undefined;
}

export default function Card({
  title,
  subtitle,
  extra,
  onClick,
  hoverable = false,
  padding = spacing[4],
  bordered = true,
  accent,
  className,
  style,
  children,
}: CardProps) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
        background: colors.surfaces.cardBg,
        borderRadius: radius.lg,
        border: bordered ? `1px solid ${border.color.default}` : '1px solid transparent',
        boxShadow: hoverable ? shadow.md : shadow.sm,
        padding: padding === 'none' ? 0 : padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        ...style,
      }}
      onMouseEnter={undefined}
    >
      {accent && (
        <span
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 3, borderRadius: '0 0 3px 3px', background: TONE_STYLE[accent].bg }}
        />
      )}
      {(title || extra) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
          <div>
            {title && <div style={{ fontWeight: 600, fontSize: 15, color: colors.neutral['900'] }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12, color: colors.neutral['400'], marginTop: 2 }}>{subtitle}</div>}
          </div>
          {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
        </div>
      )}
      {children}
    </div>
  );
}