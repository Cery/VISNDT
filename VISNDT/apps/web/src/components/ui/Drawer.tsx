'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@visndt/design-system';

type Tone = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** bottom = 移动端底部抽屉；right = 桌面右侧滑出 */
  placement?: 'right' | 'bottom';
  headerFooter?: boolean;
  loading?: boolean;
}

/**
 * VISNDT 基础 Drawer Primitive（WP-2 §15）：
 * Title / Body / Footer / Close / Loading + Dialog 语义 + Escape + Focus Return + 移动端行为。
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  placement = 'right',
  headerFooter = true,
  loading = false,
}: DrawerProps) {
  const headerBtnRef = useRef<HTMLButtonElement>(null);
  const previousActive = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    previousActive.current = document.activeElement;
    const t = window.setTimeout(() => headerBtnRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      if (previousActive.current instanceof HTMLElement) previousActive.current.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isBottom = placement === 'bottom';

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      <div className="absolute inset-0 bg-[rgba(15,23,42,0.5)]" onClick={onClose} aria-hidden="true" />
      <div
        role="document"
        className={`absolute z-10 flex flex-col bg-background shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${
          isBottom
            ? 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-xl'
            : 'inset-y-0 right-0 w-full max-w-md'
        }`}
      >
        {headerFooter && (
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <button
              ref={headerBtnRef}
              type="button"
              aria-label="关闭"
              onClick={onClose}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-4 text-sm text-foreground">
          {loading ? (
            <div role="status" className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
              <span>加载中…</span>
            </div>
          ) : (
            children
          )}
        </div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}