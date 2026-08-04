import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const categoryName = translateCategoryName(product.category?.name ?? '');

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1 transition-all duration-300 bg-white p-4"
    >
      {/* Image placeholder */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-industrial-slate rounded-md mb-4 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-slate-300"
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

      <div className="space-y-1.5">
        <h3 className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.model && (
          <p className="font-mono text-xs text-slate-400">Model: {product.model}</p>
        )}

        {categoryName && (
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {categoryName}
          </span>
        )}
      </div>
    </Link>
  );
}