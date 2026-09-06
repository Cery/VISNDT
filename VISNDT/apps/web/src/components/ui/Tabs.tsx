'use client';

import { useRef } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';

export interface TabItem {
  key: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (key: string) => void;
}

/**
 * VISNDT 基础 Tabs Primitive —— ARIA tablist/tab/tabpanel + 方向键切换。
 */
export function Tabs({ items, value, onChange }: TabsProps) {
  const activeKey = value ?? items[0]?.key ?? '';
  const listRef = useRef<HTMLDivElement>(null);

  const onKey = (e: KeyboardEvent, index: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const enabled = items.map((it) => !it.disabled).reduce<number[]>((acc, d, i) => (d ? [...acc, i] : acc), []);
    const pos = enabled.indexOf(index);
    const next = enabled[(pos + dir + enabled.length) % enabled.length];
    const btn = listRef.current?.querySelector<HTMLButtonElement>(`[data-tab-key="${items[next]?.key}"]`);
    btn?.focus();
    onChange?.(items[next].key);
  };

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label="选项卡"
        className="flex gap-1 border-b border-border"
      >
        {items.map((item, i) => {
          const selected = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              data-tab-key={item.key}
              id={`tab-${item.key}`}
              aria-selected={selected}
              aria-controls={`panel-${item.key}`}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange?.(item.key)}
              onKeyDown={(e) => onKey(e, i)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected
                  ? 'border-primary font-medium text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`panel-${item.key}`}
          aria-labelledby={`tab-${item.key}`}
          hidden={item.key !== activeKey}
          className="pt-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}