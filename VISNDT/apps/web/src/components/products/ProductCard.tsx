import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';
import MediaImage from '@/components/common/MediaImage';
import HighlightText from './HighlightText';

interface ProductCardProps {
  product: Product;
  /** Current search keyword for highlighting (frontend only) */
  searchKeyword?: string;
  /** Whether this product is selected for comparison */
  isCompared?: boolean;
  /** Compare toggle callback */
  onCompareToggle?: (id: string) => void;
}

export default function ProductCard({
  product,
  searchKeyword,
  isCompared = false,
  onCompareToggle,
}: ProductCardProps) {
  return (
    <div className="group block rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1 transition-all duration-300 bg-white p-4 relative">
      {/* Compare Checkbox */}
      {onCompareToggle && (
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle(product.id);
            }}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${isCompared
                ? 'bg-primary border-primary text-white'
                : 'border-slate-300 hover:border-primary bg-white'
              }
            `}
            aria-label={isCompared ? `取消对比 ${product.name}` : `对比 ${product.name}`}
          >
            {isCompared && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 5l2 2 4-4" />
              </svg>
            )}
          </button>
        </div>
      )}
      <Link href={`/products/${product.id}`} className="block">
        {/* Primary image (Capability Discovery Card, media fallback) */}
        <MediaImage
          fileAssetId={product.primaryMedia?.fileAssetId}
          alt={product.primaryMedia?.title || product.name}
          seed={product.id}
          className="aspect-video w-full object-cover rounded-md mb-3 bg-muted"
        />

        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
            <HighlightText text={product.name} keyword={searchKeyword ?? ''} />
          </h3>

          {product.model && (
            <p className="font-mono text-xs text-muted-foreground">
              型号：<HighlightText text={product.model} keyword={searchKeyword ?? ''} />
            </p>
          )}

          {product.category && (
            <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {translateCategoryName(product.category.name)}
            </span>
          )}

          {/* Key parameters (Capability Discovery Card) */}
          {Array.isArray(product.keyParameters) && (
            <div className="mt-2">
              {product.keyParameters.length > 0 ? (
                <ul className="space-y-1">
                  {product.keyParameters.map((kp) => (
                    <li
                      key={kp.parameterDefinitionId}
                      className="flex items-baseline justify-between gap-2 text-xs"
                    >
                      <span className="text-muted-foreground shrink-0">{kp.name}</span>
                      <span className="font-medium text-slate-700 text-right truncate">
                        {kp.value}
                        {kp.unit ? <span className="text-slate-400 ml-0.5">{kp.unit}</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">暂无参数信息</p>
              )}
            </div>
          )}

          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              <HighlightText text={product.description} keyword={searchKeyword ?? ''} />
            </p>
          )}
        </div>
      </Link>

      {/* Supplier Discovery Entry — links to product detail (supplier section via #suppliers anchor) */}
      <div className="pt-2 mt-2 border-t border-slate-100">
        <Link
          href={`/products/${product.id}#suppliers`}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M2 4.5C2 3.67 2.67 3 3.5 3h5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5v-3z" />
            <path d="M4 6h4M4 8h2" />
          </svg>
          查看供应商能力
        </Link>
      </div>
    </div>
  );
}