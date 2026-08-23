'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchDomain } from '@/services/search.service';
import SearchSuggestionDropdown from '@/components/search/SearchSuggestionDropdown';

const SEARCH_DOMAINS: { value: SearchDomain; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'product', label: '产品' },
  { value: 'supplier-product', label: '供应商型号' },
  { value: 'knowledge', label: '知识' },
  { value: 'solution', label: '方案' },
  { value: 'supplier', label: '供应商' },
];

interface GlobalSearchBarProps {
  /** Placeholder text */
  placeholder?: string;
  /** Initial keyword */
  initialKeyword?: string;
  /** Initial search type */
  initialType?: SearchDomain;
  /** Callback when search is triggered */
  onSearch?: (keyword: string, type: SearchDomain) => void;
  /** Show type selector dropdown */
  showTypeSelector?: boolean;
}

export default function GlobalSearchBar({
  placeholder = '搜索工业检测设备、知识、方案...',
  initialKeyword = '',
  initialType = 'all',
  onSearch,
  showTypeSelector = true,
}: GlobalSearchBarProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchType, setSearchType] = useState<SearchDomain>(initialType);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typeMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close type menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        setTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTypeLabel =
    SEARCH_DOMAINS.find((d) => d.value === searchType)?.label ?? '全部';

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = keyword.trim();
      if (!trimmed) return;
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(trimmed, searchType);
      } else {
        const params = new URLSearchParams();
        params.set('q', trimmed);
        params.set('type', searchType);
        router.push(`/search?${params.toString()}`);
      }
    },
    [keyword, searchType, onSearch, router],
  );

  const handleClear = useCallback(() => {
    setKeyword('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleSuggestionSelect = useCallback((name: string) => {
    setKeyword(name);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const handleInputFocus = useCallback(() => {
    if (keyword.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [keyword]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setKeyword(value);
      if (value.trim().length >= 2) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    },
    [],
  );

  const hasValue = keyword.length > 0;

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-0">
      <div className="relative flex items-center flex-1 min-w-0">
        {/* Type Selector */}
        {showTypeSelector && (
          <div className="relative flex-shrink-0" ref={typeMenuRef}>
            <button
              type="button"
              onClick={() => setTypeMenuOpen(!typeMenuOpen)}
              className="flex items-center gap-1 h-11 px-3 text-sm font-medium text-slate-600 bg-slate-50 border border-r-0 border-slate-200 rounded-l-lg hover:bg-slate-100 transition-colors"
            >
              <span className="truncate max-w-[48px]">{currentTypeLabel}</span>
              <svg
                className={`w-3 h-3 text-slate-400 transition-transform ${typeMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {typeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                {SEARCH_DOMAINS.map((domain) => (
                  <button
                    key={domain.value}
                    type="button"
                    onClick={() => {
                      setSearchType(domain.value);
                      setTypeMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      searchType === domain.value
                        ? 'text-primary bg-primary/5 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {domain.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={`w-full h-11 px-3.5 text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
              showTypeSelector ? 'rounded-r-lg' : 'rounded-lg'
            }`}
          />

          {/* Search Suggestion Dropdown */}
          <SearchSuggestionDropdown
            keyword={keyword}
            visible={showSuggestions}
            onSelect={handleSuggestionSelect}
            onClose={() => setShowSuggestions(false)}
          />

          {/* Clear Button */}
          {hasValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="清除搜索"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="flex-shrink-0 h-11 px-5 ml-2 bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-industrial-sm"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span className="hidden sm:inline">搜索</span>
      </button>
    </form>
  );
}