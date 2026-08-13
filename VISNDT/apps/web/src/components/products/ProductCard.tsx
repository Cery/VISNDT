import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';
import HighlightText from './HighlightText';

interface ProductCardProps {
  product: Product;
  /** Current search keyword for highlighting (frontend only) */
  searchKeyword?: string;
}

export default function ProductCard({ product, searchKeyword }: ProductCardProps) {
  return (
    <div className="group block rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1 transition-all duration-300 bg-white p-4">
      <Link href={`/products/${product.id}`} className="block">
        {/* Placeholder image */}
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-industrial-slate rounded-md mb-3 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">暂无图片</span>
        </div>

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