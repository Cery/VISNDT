import { Tag } from 'antd';
import type { ReactNode } from 'react';
import {
  resolveStatusTone,
  TONE_TO_ANTD_COLOR,
  type SemanticTone,
} from './tokens';

interface StatusTagProps {
  /** 原始业务状态字符串（如 PUBLISHED / PENDING / REJECTED） */
  status?: string | null;
  /** 可选：直接指定语义色调，覆盖 status 推断 */
  tone?: SemanticTone;
  /** 展示文案，缺省时回退为 status 原值 */
  label?: ReactNode;
  /** 是否显示状态圆点标记 */
  dot?: boolean;
}

/**
 * VISNDT 语义状态标签 —— 统一的「状态语义治理」载体。
 * 页面内禁止再自行定义颜色；所有状态统一经 resolveStatusTone 映射为：
 * SUCCESS / WARNING / ERROR / INFO / NEUTRAL。
 */
export default function StatusTag({
  status,
  tone,
  label,
  dot = true,
}: StatusTagProps) {
  const resolved = tone ?? resolveStatusTone(status);
  const color = TONE_TO_ANTD_COLOR[resolved];
  const text = label ?? (status ?? resolved);

  return (
    <Tag
      color={color}
      style={dot ? { display: 'inline-flex', alignItems: 'center', gap: 4 } : undefined}
    >
      {dot && (
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            display: 'inline-block',
            opacity: 0.9,
          }}
        />
      )}
      {text}
    </Tag>
  );
}