import { Card, Skeleton } from 'antd';
import type { ReactNode } from 'react';
import { TONE_TO_HEX, type SemanticTone } from '../design-system/tokens';

interface KpiCardProps {
  title: string;
  value: number | string;
  /** 顶部强调色条 / 图标色，缺省按 tone 推断 */
  icon?: ReactNode;
  /** 语义色调（影响强调色 + 数值色） */
  tone?: SemanticTone;
  /** 强调色（覆盖 tone 推断） */
  accent?: string;
  /** 数字单位后缀（如 % / 项 / 个） */
  suffix?: ReactNode;
  /** 业务含义说明（运营信息层级：数字背后的意义） */
  hint?: ReactNode;
  /** 状态辅助说明（如「3 活跃」「2 未读」） */
  meta?: ReactNode;
  /** 状态徽标色调（用于 meta 着色） */
  metaTone?: SemanticTone;
  loading?: boolean;
  onClick?: () => void;
}

/**
 * 运营驾驶舱 KPI 卡片 —— 从「数字 + 标题」升级为：
 * Metric → Value → Trend/Status → Business Meaning 的语义化表达。
 *
 * 仅做展示层增强，不修改统计接口。
 */
export default function KpiCard({
  title,
  value,
  icon,
  tone = 'primary',
  accent,
  suffix,
  hint,
  meta,
  metaTone,
  loading = false,
  onClick,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 1 }} />
      </Card>
    );
  }

  const resolvedAccent = accent ?? TONE_TO_HEX[tone];

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        borderTop: `3px solid ${resolvedAccent}`,
        cursor: onClick ? 'pointer' : undefined,
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{title}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
              {value}
            </span>
            {suffix && (
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{suffix}</span>
            )}
          </div>
          {hint && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 1.5 }}>
              {hint}
            </div>
          )}
          {meta && (
            <div
              style={{
                fontSize: 12,
                color: metaTone ? TONE_TO_HEX[metaTone] : '#64748b',
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              {meta}
            </div>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: resolvedAccent,
              background: `${resolvedAccent}14`,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}