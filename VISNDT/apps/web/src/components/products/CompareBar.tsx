'use client';

import Link from 'next/link';

interface CompareBarProps {
  compareIds: string[];
  products: { id: string; name: string }[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export default function CompareBar({
  compareIds,
  products,
  onRemove,
  onClear,
}: CompareBarProps) {
  if (compareIds.length === 0) return null;

  const selectedProducts = compareIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as { id: string; name: string }[];

  const compareUrl = `/products/compare?ids=${compareIds.join(',')}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-industrial-lg pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
            已选择 {compareIds.length} 个产品
          </span>
          <div className="flex items-center gap-2 overflow-x-auto min-w-0">
            {selectedProducts.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >
                <span className="max-w-[120px] truncate">{p.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="hover:text-primary/70 flex-shrink-0"
                  aria-label={`移除 ${p.name}`}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M2 2l6 6M8 2l-6 6" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            清空
          </button>
          <Link
            href={compareUrl}
            className={`
              inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${compareIds.length >= 2
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
              }
            `}
            aria-disabled={compareIds.length < 2}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 4h12M1 10h12M3 1v12M11 1v12" />
            </svg>
            开始对比
          </Link>
        </div>
      </div>
    </div>
  );
}