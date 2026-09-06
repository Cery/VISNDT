'use client';

import type { ReactNode } from 'react';
import { Drawer } from '@/components/ui/Drawer';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * 移动端筛选抽屉（WP-3A.2 · §17/§21 Foundation 复用）。
 * 直接复用 Foundation `Drawer` 原语（移动端取 bottom sheet 形态），
 * 由 Drawer 统一承载：Dialog 语义 + Escape + 焦点返回 + body 滚动锁定。
 * 移除此前 CSS-first 的自建左侧抽屉实现，不再重复造 Drawer。
 * 仅消费既有的 ProductFilter，不改动后端筛选逻辑。
 */
export default function MobileFilterDrawer({
  open,
  onClose,
  title,
  children,
}: MobileFilterDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      placement="bottom"
      headerFooter
      footer={
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          查看结果
        </button>
      }
    >
      {children}
    </Drawer>
  );
}