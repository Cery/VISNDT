import type { ReactNode } from 'react';

/**
 * 工业蓝图设计语言共用容器（对齐 visndt_home_redesign.html `.wrap`）：
 * `max-width:1180px` + 水平 `28px`（响应式）留白。
 */
export default function BlueprintContainer({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1180,
        marginInline: 'auto',
        paddingInline: 'clamp(20px, 4vw, 28px)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}