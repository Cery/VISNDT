'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';
import CompareBar from './CompareBar';

interface RelatedProductsSectionProps {
  currentProductId: string;
  currentProductName: string;
  products: Product[];
}

const MAX_COMPARE = 4;

/**
 * Product Detail "相关产品" section (M24.1.8).
 *
 * Related products are resolved deterministically server-side (same
 * ProductCategory, ACTIVE only, current product excluded). This section only
 * adds the Compare Entry on top of that resolution by reusing the existing
 * ProductCard compare checkbox + CompareBar + /products/compare?ids= flow.
 *
 * No AI / ranking / supplier leakage. Compare is user-selected, never
 * auto-recommended.
 */
export default function RelatedProductsSection({
  currentProductId,
  currentProductName,
  products,
}: RelatedProductsSectionProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const removeCompare = (id: string) => {
    setCompareIds((prev) => prev.filter((i) => i !== id));
  };

  const clearCompare = () => setCompareIds([]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-8 text-center">
        <p className="text-sm text-slate-500">暂无相关产品</p>
        <p className="text-xs text-slate-400 mt-1">
          该产品所属分类下暂无其他在售产品。
        </p>
      </div>
    );
  }

  const compareCandidates = [
    { id: currentProductId, name: currentProductName },
    ...products.map((p) => ({ id: p.id, name: p.name })),
  ];

  return (
    <div>
      {/* Current product compare entry — allows comparing current vs related */}
      <div className="mb-4 flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-700">当前产品</p>
          <p className="text-xs text-slate-500 truncate">{currentProductName}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleCompare(currentProductId)}
          className="inline-flex items-center gap-2 text-sm shrink-0"
        >
          <span
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              compareIds.includes(currentProductId)
                ? 'bg-primary border-primary text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {compareIds.includes(currentProductId) && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 5l2 2 4-4" />
              </svg>
            )}
          </span>
          <span className={compareIds.includes(currentProductId) ? 'text-primary' : 'text-slate-600'}>
            加入比较
          </span>
        </button>
      </div>

      {/* Related products grid (reuses ProductCard compare checkbox) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isCompared={compareIds.includes(product.id)}
            onCompareToggle={toggleCompare}
          />
        ))}
      </div>

      {/* Floating compare bar (reuses existing compare flow) */}
      <CompareBar
        compareIds={compareIds}
        products={compareCandidates}
        onRemove={removeCompare}
        onClear={clearCompare}
      />
    </div>
  );
}