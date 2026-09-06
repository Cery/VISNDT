'use client';

import type { ReactNode, ElementType, CSSProperties } from 'react';
import { container } from '@visndt/design-tokens';

/* ============================================================
 * Responsive / Layout Primitives（WP-2 §18）。
 * Container / Grid / Stack / Flex / Visibility。
 * 断点画面板 375 / 768 / 1024 / 1440：容器留白随断点渐变。
 * ============================================================ */

function gapClass(gap: number): string {
  // Tailwind 3 gap 尺度（spacing scale）：数字 `n` → n * 4px
  switch (gap) {
    case 1: return 'gap-1';
    case 2: return 'gap-2';
    case 3: return 'gap-3';
    case 4: return 'gap-4';
    case 5: return 'gap-5';
    case 6: return 'gap-6';
    case 8: return 'gap-8';
    case 10: return 'gap-10';
    case 12: return 'gap-12';
    default: return 'gap-4';
  }
}

function gridColsClass(n: number): string {
  switch (n) {
    case 1: return 'grid-cols-1';
    case 2: return 'grid-cols-2';
    case 3: return 'grid-cols-3';
    case 4: return 'grid-cols-4';
    case 5: return 'grid-cols-5';
    case 6: return 'grid-cols-6';
    default: return 'grid-cols-1';
  }
}

export interface ContainerProps {
  children: ReactNode;
  size?: 'content' | 'wide' | 'full';
  className?: string;
  style?: CSSProperties;
}

export function Container({ children, size = 'content', className, style }: ContainerProps) {
  const maxWidth =
    size === 'full' ? null : size === 'wide' ? container.width.wide : container.width.content;
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${className ?? ''}`}
      style={maxWidth ? { maxWidth, ...style } : style}
    >
      {children}
    </div>
  );
}

export interface GridProps {
  children: ReactNode;
  /** 以小屏一列为基准，随断点扩展（响应式列数） */
  cols?: { base?: number; sm?: number; md?: number; lg?: number };
  gap?: number;
  className?: string;
}

export function Grid({ children, cols = {}, gap = 4, className }: GridProps) {
  const { base = 1, sm, md, lg } = cols;
  const cls = [
    'grid',
    gridColsClass(base),
    sm ? `sm:${gridColsClass(sm)}` : '',
    md ? `md:${gridColsClass(md)}` : '',
    lg ? `lg:${gridColsClass(lg)}` : '',
    gapClass(gap),
    className ?? '',
  ].filter(Boolean).join(' ');
  return <div className={cls}>{children}</div>;
}

export interface StackProps {
  children: ReactNode;
  gap?: number;
  as?: ElementType;
  className?: string;
}

export function Stack({ children, gap = 4, as: Tag = 'div', className }: StackProps) {
  return <Tag className={`flex flex-col ${gapClass(gap)} ${className ?? ''}`}>{children}</Tag>;
}

export interface FlexProps {
  children: ReactNode;
  gap?: number;
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export function Flex({ children, gap = 4, wrap = false, justify = 'start', align = 'center', className }: FlexProps) {
  const j = { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between', around: 'justify-around' }[justify];
  const a = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch' }[align];
  return (
    <div className={`flex ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${j} ${a} ${gapClass(gap)} ${className ?? ''}`}>
      {children}
    </div>
  );
}

export interface VisibilityProps {
  children: ReactNode;
  /** mobile = 仅移动端显示；desktop = 仅桌面显示 */
  only?: 'mobile' | 'desktop';
  className?: string;
}

export function Visibility({ children, only = 'mobile', className }: VisibilityProps) {
  return (
    <div className={`${only === 'mobile' ? 'flex sm:hidden' : 'hidden sm:flex'} ${className ?? ''}`}>
      {children}
    </div>
  );
}