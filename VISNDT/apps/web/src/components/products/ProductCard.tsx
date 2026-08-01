import Link from 'next/link';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-lg border bg-white p-4 hover:shadow-md transition-shadow"
    >
      {/* Placeholder image */}
      <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No Image</span>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.model && (
          <p className="text-xs text-muted-foreground">Model: {product.model}</p>
        )}

        {product.category && (
          <span className="inline-block text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {product.category.name}
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