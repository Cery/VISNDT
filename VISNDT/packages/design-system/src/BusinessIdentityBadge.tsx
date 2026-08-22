import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { colors, radius, spacing, typography } from '@visndt/design-tokens';
import {
  deriveIdentity,
  identityMeta,
  shortIdentity,
  type BusinessEntityType,
} from '@visndt/identity-contract';

export interface BusinessIdentityBadgeProps {
  /** 实体类型（PRODUCT/DEMAND/RFQ/OFFER/ORGANIZATION/USER/ASSET/CONTENT） */
  type: BusinessEntityType;
  /** 现有数据库 UUID */
  id: string;
  /** 记录创建时间（决定 YYYYMMDD 段，缺省取当天） */
  createdAt?: string | Date;
  /** 展示形态：tag（默认，语义标签）/ plain（纯等宽文本）/ compact（短编号） */
  variant?: 'tag' | 'plain' | 'compact';
  /** 是否在编号前显示实体中文名 */
  label?: boolean;
  /** 是否可点击复制（默认 true） */
  copyable?: boolean;
  /** 悬停说明（默认 true） */
  tooltip?: boolean;
  /** 语义色调 */
  tone?: 'primary' | 'neutral' | 'info';
  className?: string;
  style?: CSSProperties;
}

const TONE_STYLE: Record<NonNullable<BusinessIdentityBadgeProps['tone']>, { bg: string; fg: string; border: string }> = {
  primary: { bg: '#eff6ff', fg: '#1d4ed8', border: '#bfdbfe' },
  neutral: { bg: colors.neutral['100'], fg: colors.neutral['600'], border: colors.neutral['200'] },
  info: { bg: '#ecfeff', fg: '#0e7490', border: '#cffafe' },
};

/**
 * 统一 Business Identity Number 展示层（React，跨 Web/Admin 复用）。
 * 由 `@visndt/identity-contract` 派生编号，继承 640 Design System token。
 * 支持：标识形态、实体名、复制、悬停说明、紧凑短编号。
 */
export default function BusinessIdentityBadge({
  type,
  id,
  createdAt,
  variant = 'tag',
  label = false,
  copyable = true,
  tooltip = true,
  tone = 'primary',
  className,
  style,
}: BusinessIdentityBadgeProps) {
  const [copied, setCopied] = useState(false);
  if (!id) {
    return <span className={className} style={{ color: colors.neutral['400'], fontSize: 12 }}>—</span>;
  }

  const identity = deriveIdentity({ type, id, createdAt });
  const meta = identityMeta(type);
  const display =
    variant === 'compact'
      ? shortIdentity({ type, id })
      : variant === 'plain'
        ? identity.identity
        : identity.identity;

  const t = TONE_STYLE[tone];
  const asTag = variant === 'tag';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(identity.identity);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* 剪贴板不可用时静默 */
    }
  };

  const inner: ReactNode = asTag ? (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.border}`,
        borderRadius: radius.sm,
        padding: `2px ${spacing[2]}px`,
        fontSize: 11.5,
        fontFamily: typography.fontFamily.mono,
        fontWeight: 500,
        lineHeight: '18px',
        whiteSpace: 'nowrap',
        cursor: copyable ? 'pointer' : 'default',
        ...style,
      }}
      onClick={copyable ? handleCopy : undefined}
      title={tooltip ? `${meta.label}业务编号（点击复制）` : undefined}
    >
      {label && (
        <span
          style={{
            fontFamily: typography.fontFamily.sans,
            fontWeight: 600,
            marginRight: 2,
            color: t.fg,
            opacity: 0.85,
          }}
        >
          {meta.label}
        </span>
      )}
      {copied ? '已复制' : display}
    </span>
  ) : (
    <code
      className={className}
      style={{
        fontFamily: typography.fontFamily.mono,
        fontSize: 11.5,
        color: t.fg,
        background: 'transparent',
        cursor: copyable ? 'pointer' : 'default',
        ...style,
      }}
      onClick={copyable ? handleCopy : undefined}
      title={tooltip ? `${meta.label}业务编号${copyable ? '（点击复制）' : ''}` : undefined}
    >
      {copied ? '已复制' : display}
    </code>
  );

  return inner;
}