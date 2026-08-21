import type { Product } from '@/types/product';
import ProductCard from '@/components/products/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import Link from 'next/link';

interface RelatedProductsProps {
  items: Product[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  emptyDescription?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

/**
 * RelatedProducts — reusable product-capability feed for commercial pages.
 *
 * Renders active published Product cards (ProductCard routes to /products/:id).
 * Data is supplied deterministically by the page via the existing public
 * Products API. No AI / keyword recommendation is performed here.
 */
export default function RelatedProducts({
  items,
  title = '相关检测设备',
  subtitle = '可满足相关检测需求的产品能力',
  emptyMessage = '暂无相关产品',
  emptyDescription = '对应产品能力正在筹备中。',
  viewAllHref = '/products',
  viewAllLabel = '浏览更多设备',
  className,
}: RelatedProductsProps) {
  return (
    <section className={`mt-12 pt-8 border-t border-slate-200 ${className ?? ''}`}>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && items.length > 0 && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors shrink-0"
          >
            {viewAllLabel}
            <span className="text-xs">&rarr;</span>
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="package"
          message={emptyMessage}
          description={emptyDescription}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}