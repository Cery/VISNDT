'use client';

import { useRouter } from 'next/navigation';
import type { SearchDomain } from '@/services/search.service';

interface SearchTypeTab {
  value: SearchDomain;
  label: string;
}

const TABS: SearchTypeTab[] = [
  { value: 'all', label: '全部' },
  { value: 'product', label: '产品' },
  { value: 'knowledge', label: '知识' },
  { value: 'solution', label: '方案' },
  { value: 'supplier', label: '供应商' },
];

interface SearchTypeTabsProps {
  activeType: SearchDomain;
  query: string;
  /** Result counts per tab for badge display */
  counts?: Partial<Record<SearchDomain, number>>;
}

export default function SearchTypeTabs({ activeType, query, counts }: SearchTypeTabsProps) {
  const router = useRouter();

  const handleTabChange = (type: SearchDomain) => {
    const params = new URLSearchParams();
    params.set('q', query);
    if (type !== 'all') {
      params.set('type', type);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <nav className="flex items-center gap-1 border-b border-slate-200 pb-0 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeType === tab.value;
        const count = tab.value === 'all' ? undefined : counts?.[tab.value];

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
              isActive
                ? 'text-primary bg-primary/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
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
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}