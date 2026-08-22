import type { ReactNode } from 'react';
import { colors, spacing } from '@visndt/design-tokens';

export interface LayoutContainerProps {
  children?: ReactNode;
  /** 最大内容宽度 */
  maxWidth?: number;
  /** 垂直留白 */
  paddingY?: number;
  paddingX?: number;
  className?: string;
}

/** 统一内容容器（水平居中 + 最大宽度 + 定界留白）。 */
export default function LayoutContainer({
  children,
  maxWidth = 1200,
  paddingY = spacing[8],
  paddingX = spacing[4],
  className,
}: LayoutContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth,
        marginInline: 'auto',
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        boxSizing: 'border-box',
        color: colors.neutral['900'],
      }}
    >
      {children}
    </div>
  );
}