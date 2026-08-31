'use client';

import { useEffect, useState } from 'react';

/**
 * M32.2 — Web 轻量 Toast（无第三方依赖）。
 * 模块级 store + 单一 ToastViewport：可在任意地方调用 `toast.success('...')`。
 * 语义色对齐 VISNDT_COLOR_SYSTEM（success #10B981 / error #EF4444 /
 * info #0EA5E9 / warning #F59E0B）。fixed 定位带安全区，置于 CompareBar 上方。
 */

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
}

type Listener = (items: ToastItem[]) => void;

let itemsList: ToastItem[] = [];
const listeners = new Set<Listener>();
let seq = 0;

function publish() {
  for (const l of listeners) l(itemsList);
}

function push(tone: ToastTone, title: string) {
  const id = ++seq;
  itemsList = [...itemsList, { id, tone, title }].slice(-4);
  publish();
  window.setTimeout(() => {
    itemsList = itemsList.filter((t) => t.id !== id);
    publish();
  }, 3500);
}

export const toast = {
  success: (title: string) => push('success', title),
  error: (title: string) => push('error', title),
  info: (title: string) => push('info', title),
  warning: (title: string) => push('warning', title),
};

const TONE_CLASS: Record<ToastTone, { border: string; icon: string; text: string }> = {
  success: {
    border: 'border-emerald-500/40',
    icon: 'text-emerald-600',
    text: 'text-emerald-700',
  },
  error: {
    border: 'border-red-500/40',
    icon: 'text-red-600',
    text: 'text-red-700',
  },
  info: {
    border: 'border-sky-500/40',
    icon: 'text-sky-600',
    text: 'text-sky-700',
  },
  warning: {
    border: 'border-amber-500/40',
    icon: 'text-amber-600',
    text: 'text-amber-700',
  },
};

const ICON_PATH: Record<ToastTone, string> = {
  success: 'M5 13l4 4L19 7',
  error: 'M6 6l12 12M18 6L6 18',
  info: 'M12 8v4M12 16h.01',
  warning: 'M12 9v3M12 16h.01',
};

export function ToastViewport() {
  const [list, setList] = useState<ToastItem[]>([]);

  useEffect(() => {
    const sub: Listener = (it) => setList([...it]);
    listeners.add(sub);
    sub(itemsList);
    return () => {
      listeners.delete(sub);
    };
  }, []);

  if (list.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4"
    >
      {list.map((item) => {
        const c = TONE_CLASS[item.tone];
        return (
          <div
            key={item.id}
            className={`pointer-events-auto w-full max-w-sm rounded-lg border ${c.border} bg-white px-4 py-3 shadow-industrial-lg flex items-start gap-2.5`}
            role="status"
          >
            <svg
              className={`mt-0.5 h-5 w-5 shrink-0 ${c.icon}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={ICON_PATH[item.tone]} />
            </svg>
            <span className={`text-sm font-medium ${c.text}`}>{item.title}</span>
          </div>
        );
      })}
    </div>
  );
}