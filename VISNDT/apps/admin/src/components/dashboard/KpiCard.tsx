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
 * M33.2 — Executive KPI StatCard（726 §12 / KPI Contract）
 * 信息层级：Executive Label → Metric（mono + tabular-nums，TG-05 数据数字强调）
 *           → Trend/Status（语义色）→ Operational Meaning。
 * 通用 icon 容器（固定 40px、统一对齐）；无 emoji；仅展示层增强，不改统计接口。
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
  const metaColor = metaTone ? TONE_TO_HEX[metaTone] : 'inherit';

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className="vds-surface-elevated"
      style={{
        borderTop: `3px solid ${resolvedAccent}`,
        cursor: onClick ? 'pointer' : undefined,
        height: '100%',
        borderRadius: 12,
      }}
    >
      {/* Label 行：title + icon 容器（统一 40px 圆角图标，无 emoji） */}
      <div
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}
      >
        <div style={{ minWidth: 0, fontSize: 13, color: '#64748b', fontWeight: 500 }}>{title}</div>
        {icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              color: resolvedAccent,
              background: `${resolvedAccent}14`,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Metric 行：mono + tabular-nums 数值强调（TG-05） */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: "'JetBrains Mono', 'SFMono-Regular', Consolas, monospace",
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </span>
        {suffix && (
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500, fontFamily: 'inherit' }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Trend / Status：语义色 meta（运营含义的即时状态） */}
      {meta && (
        <div style={{ fontSize: 12, color: metaColor, marginTop: 8, fontWeight: 500 }}>{meta}</div>
      )}

      {/* Operational Meaning：数字背后的业务意义 */}
      {hint && (
        <div
          style={{
            fontSize: 12,
            color: '#94a3b8',
            marginTop: 6,
            lineHeight: 1.5,
            borderTop: `1px solid #f1f5f9`,
            paddingTop: 8,
          }}
        >
          {hint}
        </div>
      )}
    </Card>
  );
}