'use client';

import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  onClear?: () => void;
  placeholder?: string;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  onClear,
  placeholder = '搜索产品...',
  initialValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external initialValue changes (e.g. URL restore)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onClear?.();
    onSearch('');
    inputRef.current?.focus();
  };

  const hasValue = value.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder || '搜索产品关键词'}
          className="w-full pl-4 pr-9 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="清除搜索"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3l8 8M11 3l-8 8" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
      >
        搜索
      </button>
    </form>
  );
}