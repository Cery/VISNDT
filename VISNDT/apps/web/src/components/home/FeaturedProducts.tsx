import Link from 'next/link';
import ProductGrid from '@/components/products/ProductGrid';
import type { Product } from '@/types/product';

interface FeaturedProductsProps {
  products: Product[];
  isLoading?: boolean;
}

export default function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Explore our selection of industrial inspection equipment
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            View All →
          </Link>
        </div>
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </section>
  );
}