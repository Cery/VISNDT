import type { CSSProperties, ReactNode } from 'react';
import { radius, spacing, typography } from '@visndt/design-tokens';
import { SOFTER_TONE_STYLE, type Tone } from '../shared';

export interface NextActionHintProps {
  /** 当前所处阶段描述 */
  current?: string;
  /** 下一步建议动作（非自动执行） */
  action?: string;
  /** 语义色调（缺省按 action 自动取 info） */
  tone?: Tone;
  /** 可选附加内容（例如去操作的链接） */
  extra?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** 统一「下一步操作提示」（当前状态 + 下一步建议，不触发状态变更）。 */
export default function NextActionHint({
  current,
  action,
  tone = 'info',
  extra,
  className,
  style,
}: NextActionHintProps) {
  const s = SOFTER_TONE_STYLE[tone];
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[3],
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: radius.md,
        padding: `${spacing[3]}px ${spacing[4]}px`,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: s.fg,
          flexShrink: 0,
        }}
      />
      <div style={{ fontSize: 12, color: s.fg, flex: 1, minWidth: 0 }}>
        {current && (
          <span style={{ fontWeight: 600 }}>{current} · </span>
        )}
        <span>{action ?? '暂无待办动作'}</span>
      </div>
      {extra && <div style={{ flexShrink: 0 }}>{extra}</div>}
    </div>
  );
}