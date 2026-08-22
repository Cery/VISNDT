import type { ReactNode } from 'react';
import { colors, spacing } from '@visndt/design-tokens';

export interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  /** 对齐方式 */
  align?: 'left' | 'center';
  /** 是否启用工业风强调条 */
  accent?: boolean;
  /** 右侧操作区 */
  action?: ReactNode;
  className?: string;
  /** 语义分级 1-3（行业惯例，控制字号） */
  level?: 1 | 2 | 3;
}

/** 统一章节标题（消灭三套 SectionHeader）。 */
export default function SectionHeader({
  title,
  subtitle,
  description,
  align = 'left',
  accent = true,
  action,
  className,
  level = 2,
}: SectionHeaderProps) {
  const titleSize = level === 1 ? 30 : level === 2 ? 24 : 20;
  const subSize = level === 1 ? 16 : 15;
  const justify = align === 'center' ? 'center' : 'space-between';
  const textAlign = align === 'center' ? 'center' : 'left';
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: textAlign,
        gap: spacing[2],
        textAlign,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: justify,
          gap: spacing[4],
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          {accent && (
            <span aria-hidden="true" style={{ width: 4, height: titleSize - 6, borderRadius: 2, background: colors.primary, flexShrink: 0 }} />
          )}
          <div>
            <h2
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: titleSize,
                lineHeight: 1.25,
                color: colors.neutral['900'],
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <div style={{ fontSize: subSize, color: colors.neutral['500'], marginTop: 2 }}>{subtitle}</div>
            )}
          </div>
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {description && (
        <p style={{ margin: 0, fontSize: 14, color: colors.neutral['500'], maxWidth: align === 'center' ? 560 : undefined }}>
          {description}
        </p>
      )}
    </div>
  );
}