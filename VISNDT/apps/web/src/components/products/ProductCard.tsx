import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-lg hover:-translate-y-1 transition-all duration-300 bg-white p-4"
    >
      {/* Placeholder image */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-industrial-slate rounded-md mb-3 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">暂无图片</span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.model && (
          <p className="font-mono text-xs text-muted-foreground">型号：{product.model}</p>
        )}

        {product.category && (
          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
            {translateCategoryName(product.category.name)}
          </span>
        )}

        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        )}
      </div>
    </Link>
  );
}