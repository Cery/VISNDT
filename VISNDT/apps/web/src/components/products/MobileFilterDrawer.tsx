'use client';

import { useEffect, type ReactNode } from 'react';

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * 移动端筛选抽屉（CSS-first，无第三方动画依赖）。
 * 由侧滑面板 + 遮罩组成，支持 Esc 关闭、遮罩点击关闭、打开时锁定 body 滚动。
 * 仅消费既有的 ProductFilter，不改动后端筛选逻辑。
 */
export default function MobileFilterDrawer({
  open,
  onClose,
  title,
  children,
}: MobileFilterDrawerProps) {
  // 打开时锁定 body 滚动，避免抽屉背后内容滚动
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lg:hidden">
      {/* 遮罩 */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 面板 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white shadow-industrial-lg flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭筛选"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 overscroll-contain">
          {children}
        </div>
        <div className="px-4 py-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            查看结果
          </button>
        </div>
      </div>
    </div>
  );
}