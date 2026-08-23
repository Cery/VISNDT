'use client';

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchDomain } from '@/services/search.service';

interface SearchTypeTab {
  value: SearchDomain;
  label: string;
  icon: React.ReactNode;
}

const TABS: SearchTypeTab[] = [
  {
    value: 'all',
    label: '全部',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    value: 'product',
    label: '产品',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    value: 'supplier-product',
    label: '供应商型号',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    value: 'knowledge',
    label: '知识',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    value: 'solution',
    label: '方案',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
      </svg>
    ),
  },
  {
    value: 'supplier',
    label: '供应商',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

interface SearchTypeTabsProps {
  activeType: SearchDomain;
  query: string;
  /** Result counts per tab for badge display */
  counts?: Partial<Record<SearchDomain, number>>;
}

export default function SearchTypeTabs({ activeType, query, counts }: SearchTypeTabsProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  // Check scroll position for shadow indicators
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setShowLeftShadow(el.scrollLeft > 4);
      setShowRightShadow(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const handleTabChange = (type: SearchDomain) => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (type !== 'all') {
      params.set('type', type);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative">
      {/* Left shadow indicator */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      )}

      {/* Scrollable tabs */}
      <nav
        ref={scrollRef}
        className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide border-b border-slate-200 pb-0 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {TABS.map((tab) => {
          const isActive = activeType === tab.value;
          const count = tab.value === 'all' ? undefined : counts?.[tab.value];

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTabChange(tab.value)}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors flex-shrink-0 ${
                isActive
                  ? 'text-primary bg-primary/5'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {/* Icon — hidden on smallest screens */}
              <span className="hidden sm:inline-flex">{tab.icon}</span>
              {tab.label}
              {count !== undefined && count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold rounded-full ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right shadow indicator */}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
}