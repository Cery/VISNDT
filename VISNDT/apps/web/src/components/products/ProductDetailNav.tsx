'use client';

import { useState, useEffect } from 'react';
import type { ProductTab } from './ProductDetailTabs';

const NAV_ITEMS: { id: ProductTab; label: string }[] = [
  { id: 'overview', label: '产品概览' },
  { id: 'specifications', label: '技术参数' },
  { id: 'suppliers', label: '供应商' },
  { id: 'documents', label: '文档证书' },
  { id: 'knowledge', label: '相关知识' },
  { id: 'related', label: '相关产品' },
];

const ANCHOR_MAP: Record<ProductTab, string> = {
  overview: '#overview',
  specifications: '#specifications',
  suppliers: '#suppliers',
  documents: '#documents',
  knowledge: '#knowledge',
  related: '#related',
};

export default function ProductDetailNav() {
  const [activeSection, setActiveSection] = useState<ProductTab>('overview');

  // Track which section is currently in viewport via scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map((item) => {
        const el = document.getElementById(ANCHOR_MAP[item.id].replace('#', ''));
        return { id: item.id, el };
      });

      // Find the section whose top is closest to the top of viewport
      let current: ProductTab = 'overview';
      for (const section of sections) {
        if (!section.el) continue;
        const rect = section.el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = section.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (tab: ProductTab) => {
    const el = document.getElementById(ANCHOR_MAP[tab].replace('#', ''));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="hidden lg:block sticky top-24 w-48" aria-label="本页导航">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
        本页导航
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              className={`
                block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors
                ${
                  activeSection === item.id
                    ? 'text-primary bg-primary/5 font-medium'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}