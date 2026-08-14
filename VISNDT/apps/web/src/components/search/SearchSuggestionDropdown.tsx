'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getProductSuggestions } from '@/services/search.service';
import type { Product } from '@/types/product';

interface SearchSuggestionDropdownProps {
  keyword: string;
  visible: boolean;
  onSelect: (keyword: string) => void;
  onClose: () => void;
}

export default function SearchSuggestionDropdown({
  keyword,
  visible,
  onSelect,
  onClose,
}: SearchSuggestionDropdownProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!visible || keyword.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      const results = await getProductSuggestions(keyword);
      setSuggestions(results);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [keyword, visible]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  const handleSelect = useCallback(
    (productName: string) => {
      onSelect(productName);
      onClose();
    },
    [onSelect, onClose],
  );

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 overflow-hidden"
    >
      {loading && (
        <div className="px-4 py-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
            搜索中...
          </span>
        </div>
      )}

      {!loading && suggestions.length === 0 && keyword.length >= 2 && (
        <div className="px-4 py-3 text-sm text-slate-400">未找到匹配的产品</div>
      )}

      {!loading && suggestions.length > 0 && (
        <ul className="py-1">
          {suggestions.map((product) => (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => handleSelect(product.name)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-400 flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <span className="truncate">{product.name}</span>
                {product.model && (
                  <span className="text-xs text-slate-400 truncate flex-shrink-0">
                    {product.model}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        产品名称建议（基于现有产品目录）
      </div>
    </div>
  );
}