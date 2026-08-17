'use client';

import { useState } from 'react';
import type { SearchDomain } from '@/services/search.service';

/** Content type filter options */
export const CONTENT_TYPE_FILTERS = [
  { value: 'ARTICLE', label: '文章' },
  { value: 'INSIGHT', label: '洞察' },
  { value: 'SOLUTION', label: '方案' },
] as const;

export type ContentTypeFilter = (typeof CONTENT_TYPE_FILTERS)[number]['value'] | undefined;

/** Filter state */
export interface SearchFilterState {
  contentType: ContentTypeFilter;
  active: boolean;
}

interface SearchFilterProps {
  activeType: SearchDomain;
  filter: SearchFilterState;
  onChange: (filter: SearchFilterState) => void;
  /** Show/hide filter based on active tab */
  className?: string;
}

export default function SearchFilter({ activeType, filter, onChange, className = '' }: SearchFilterProps) {
  const [expanded, setExpanded] = useState(false);

  const handleContentTypeChange = (value: ContentTypeFilter) => {
    const newFilter = { ...filter, contentType: filter.contentType === value ? undefined : value };
    newFilter.active = newFilter.contentType !== undefined;
    onChange(newFilter);
  };

  const handleClearAll = () => {
    onChange({ contentType: undefined, active: false });
  };

  // Only show content type filter for 'all' or 'content' tabs
  const showContentTypeFilter = activeType === 'all' || activeType === 'knowledge' || activeType === 'solution';

  const hasActiveFilters = filter.active;

  return (
    <div className={`${className}`}>
      {/* Desktop: horizontal filter bar */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {/* Content Type Filter */}
        {showContentTypeFilter && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-1">类型:</span>
            {CONTENT_TYPE_FILTERS.map((ct) => {
              const isActive = filter.contentType === ct.value;
              return (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => handleContentTypeChange(ct.value)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {ct.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Divider */}
        {showContentTypeFilter && (
          <span className="w-px h-4 bg-slate-200 mx-1" />
        )}

        {/* Active filter count + clear */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* Mobile: collapsible filter */}
      <div className="md:hidden">
        {!expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              hasActiveFilters
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-slate-200 text-slate-500'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            筛选{hasActiveFilters ? ` (${filter.contentType ? 1 : 0})` : ''}
          </button>
        )}

        {expanded && (
          <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">筛选</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Type Filter */}
            {showContentTypeFilter && (
              <div className="mb-3">
                <span className="text-xs text-slate-400 block mb-2">内容类型</span>
                <div className="flex flex-wrap gap-2">
                  {CONTENT_TYPE_FILTERS.map((ct) => {
                    const isActive = filter.contentType === ct.value;
                    return (
                      <button
                        key={ct.value}
                        type="button"
                        onClick={() => handleContentTypeChange(ct.value)}
                        className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {ct.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="flex-1 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  清除筛选
                </button>
              )}
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="flex-1 px-3 py-1.5 text-xs text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}