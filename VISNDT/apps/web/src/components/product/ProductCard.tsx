import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';
import HighlightText from '@/components/products/HighlightText';

interface ProductCardProps {
  product: Product;
  /** 搜索关键词（用于高亮匹配） */
  searchKeyword?: string;
  /** 是否已加入对比列表 */
  isCompared?: boolean;
  /** 对比切换回调 */
  onCompareToggle?: (id: string) => void;
}

export default function ProductCard({
  product,
  searchKeyword,
  isCompared = false,
  onCompareToggle,
}: ProductCardProps) {
  const categoryName = translateCategoryName(product.category?.name ?? '');

  return (
    <div className="group relative">
      {/* Compare checkbox */}
      {onCompareToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onCompareToggle(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isCompared
              ? 'bg-primary border-primary text-white'
              : 'border-slate-300 bg-white/80 hover:border-primary'
          }`}
          aria-label={isCompared ? '取消对比' : '加入对比'}
        >
          {isCompared && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      )}

      <Link
        href={`/products/${product.id}`}
        className="block rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1 transition-all duration-300 bg-white p-4 min-h-[160px]"
      >
        {/* Image placeholder */}
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-industrial-slate rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          <svg
            className="w-10 h-10 text-slate-300 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <div className="space-y-2">
          {/* Product name */}
          <h3 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
            {searchKeyword ? (
              <HighlightText text={product.name} keyword={searchKeyword} />
            ) : (
              product.name
            )}
          </h3>

          {/* Model & Category row */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.model && (
              <span className="font-mono text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                {product.model}
              </span>
            )}
            {categoryName && (
              <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                {categoryName}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}