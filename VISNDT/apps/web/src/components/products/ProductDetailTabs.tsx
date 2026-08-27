'use client';

import { useState, useEffect, useCallback } from 'react';

export type ProductTab = 'overview' | 'specifications' | 'suppliers' | 'supplier-models' | 'documents' | 'knowledge' | 'related';

interface TabDefinition {
  id: ProductTab;
  label: string;
  anchor: string;
}

const TABS: TabDefinition[] = [
  { id: 'overview', label: '能力概览', anchor: '#overview' },
  { id: 'specifications', label: '技术参数', anchor: '#specifications' },
  { id: 'supplier-models', label: '能力型号', anchor: '#supplier-models' },
  { id: 'suppliers', label: '能力提供商', anchor: '#suppliers' },
  { id: 'documents', label: '文档证书', anchor: '#documents' },
  { id: 'knowledge', label: '相关知识', anchor: '#knowledge' },
  { id: 'related', label: '相关能力', anchor: '#related' },
];

interface ProductDetailTabsProps {
  children: (activeTab: ProductTab) => React.ReactNode;
  defaultTab?: ProductTab;
}

export default function ProductDetailTabs({
  children,
  defaultTab = 'overview',
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<ProductTab>(defaultTab);

  // Sync tab from URL hash on mount and hash change
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const matched = TABS.find((t) => t.anchor.replace('#', '') === hash);
      if (matched) {
        setActiveTab(matched.id);
      }
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const handleTabClick = useCallback((tab: ProductTab) => {
    setActiveTab(tab);
    const def = TABS.find((t) => t.id === tab);
    if (def) {
      window.location.hash = def.anchor;
    }
  }, []);

  return (
    <div>
      {/* Tab Bar — desktop: horizontal tabs, mobile: horizontal scroll */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 mb-8 overflow-x-auto">
        <nav className="flex gap-0 min-w-max" role="tablist" aria-label="能力详情导航">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {children(activeTab)}
      </div>
    </div>
  );
}