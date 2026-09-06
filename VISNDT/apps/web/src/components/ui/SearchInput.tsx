'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { inputBase, focusRing } from './fieldStyles';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'label'> {
  label?: ReactNode;
  /** 是否处于加载态（右下转圈，并屏蔽清除） */
  loading?: boolean;
  /** 是否展示清除按钮 */
  clearable?: boolean;
  onClear?: () => void;
}

/**
 * VISNDT 通用 Search Primitive（对接 WP-2 §13 Search Contract）。
 * Input + Search Icon + Clear + Loading + Keyboard + Empty（Empty 由宿主在结果为空时渲染）。
 * 仅建立通用能力，不实现 /search 业务增强。
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, loading = false, clearable = true, onClear, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = rest.id ?? `vds-search-${autoId}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>}
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={ref}
          id={id}
          type="search"
          role="searchbox"
          className={`${inputBase} ${focusRing} pl-9 ${clearable ? 'pr-9' : ''} ${className ?? ''}`}
          {...rest}
        />
        {loading ? (
          <Loader2
            aria-hidden="true"
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        ) : clearable && rest.value ? (
          <button
            type="button"
            aria-label="清空搜索"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
});