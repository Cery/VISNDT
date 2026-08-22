import { cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { colors, radius } from '@visndt/design-tokens';

export interface IconWrapperProps {
  children?: ReactNode;
  /** 图标尺寸（px） */
  size?: number;
  color?: string;
  /** 是否加容器背景（工业模块感） */
  container?: boolean;
  containerTone?: 'primary' | 'neutral' | 'none';
  className?: string;
  title?: string;
}

const CONTAINER_BG: Record<string, string | undefined> = {
  primary: '#eff6ff',
  neutral: colors.neutral['100'],
  none: undefined,
};

/**
 * 统一图标包装：
 * - 统一尺寸/颜色
 * - 可选容器背景（Nav/Sidebar 模块感）
 * - 自定义 SVG/Lucide 图标统一注入 color（fill=currentColor 的图标生效）
 */
export default function IconWrapper({
  children,
  size = 20,
  color = colors.neutral['500'],
  container = false,
  containerTone = 'neutral',
  className,
  title,
}: IconWrapperProps) {
  const node = numberOfChildren(children);
  const inner = isValidElement(node)
    ? cloneElement(node as React.ReactElement<{ size?: number | string; color?: string; 'aria-hidden'?: boolean }>, {
        size,
        color,
        'aria-hidden': true,
      })
    : node;
  return (
    <span
      className={className}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: container ? size + 16 : undefined,
        height: container ? size + 16 : undefined,
        borderRadius: container ? radius.md : undefined,
        background: container ? CONTAINER_BG[containerTone] : undefined,
        color,
        flexShrink: 0,
      }}
    >
      {inner}
    </span>
  );
}

function numberOfChildren(children: ReactNode): ReactNode {
  if (Array.isArray(children)) return children[0];
  return children;
}