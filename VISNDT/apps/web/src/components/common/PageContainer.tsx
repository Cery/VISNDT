import type { ReactNode } from 'react';
import { container } from '@visndt/design-tokens';

export type ContainerVariant = 'content' | 'wide' | 'reading';

export interface PageContainerProps {
  children?: ReactNode;
  /** content(1280, 默认) / wide(1480) / reading(760-820) */
  variant?: ContainerVariant;
  className?: string;
  /** 垂直留白（px，默认 32 = spacing 8） */
  paddingY?: number;
}

const WIDTH: Record<ContainerVariant, number> = {
  content: container.width.content,
  wide: container.width.wide,
  reading: container.width.reading.max,
};

/**
 * M33.1 Visual Foundation — Web 统一 Page Container（726 §8.1 / TG-03）。
 * 复用一个 design-tokens 事实源，375/768/1024/1440 响应式留白由 CSS clamp 处理。
 */
export default function PageContainer({
  children,
  variant = 'content',
  className,
  paddingY = 32,
}: PageContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        maxWidth: WIDTH[variant],
        marginInline: 'auto',
        paddingTop: paddingY,
        paddingBottom: paddingY,
        paddingInline: 'clamp(16px, 4vw, 32px)',
        boxSizing: 'border-box',
      }}
      data-page-container={variant}
    >
      {children}
    </div>
  );
}