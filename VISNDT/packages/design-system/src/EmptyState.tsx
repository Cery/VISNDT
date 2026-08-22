import type { ReactNode } from 'react';
import { colors, radius, spacing } from '@visndt/design-tokens';

export interface EmptyStateProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

/** 统一空态（消灭各端 EmptyState 差异 + SEO 友好）。 */
export default function EmptyState({ title = '暂无数据', description, icon, action, compact = false, className }: EmptyStateProps) {
  return (
    <div
      className={className}
      role="status"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        textAlign: 'center',
        padding: compact ? spacing[6] : spacing[12],
      }}
    >
      {icon && (
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.lg,
            background: colors.neutral['100'],
            color: colors.neutral['400'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            marginBottom: spacing[1],
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ fontWeight: 600, fontSize: 15, color: colors.neutral['700'] }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: colors.neutral['400'], maxWidth: 360 }}>{description}</div>}
      {action && <div style={{ marginTop: spacing[2] }}>{action}</div>}
    </div>
  );
}