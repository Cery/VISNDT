'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@visndt/design-system';

type Tone = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmTone?: Tone;
  loading?: boolean;
  /** 焦点关闭后可回退到的元素（Focus Return，缺省回退到打开本弹窗前的 activeElement） */
  triggerRef?: React.RefObject<HTMLElement | null>;
  wide?: boolean;
}

/**
 * VISNDT 基础 Modal Primitive（WP-2 §15）：
 * Title / Body / Footer / Close / Confirm / Cancel / Loading / Error(children 承载) /
 * Dialog 语义 + Escape + Focus Return + 移动端全屏行为。
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  confirmLabel = '确定',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
  confirmTone = 'primary',
  loading = false,
  triggerRef,
  wide = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(() => {
    if (triggerRef?.current) triggerRef.current.focus();
    else (document.activeElement as HTMLElement | null)?.focus?.();
  });
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActive = useRef<Element | null>(null);

  // Escape + 焦点管理
  useEffect(() => {
    if (!open) return;
    previousActive.current = document.activeElement;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      if (previousActive.current instanceof HTMLElement) previousActive.current.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  const footerNode = footer ?? (
    <>
      <Button variant="ghost" onClick={() => { onCancel?.(); onClose(); }}>{cancelLabel}</Button>
      <Button tone={confirmTone} loading={loading} onClick={() => { onConfirm?.(); }}>{confirmLabel}</Button>
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      <div
        className="absolute inset-0 bg-[rgba(15,23,42,0.5)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="document"
        className={`relative z-10 w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto bg-background px-4 pb-5 pt-4 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:rounded-xl sm:px-5`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-foreground">{children}</div>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2">{footerNode}</div>
      </div>
    </div>,
    document.body,
  );
}