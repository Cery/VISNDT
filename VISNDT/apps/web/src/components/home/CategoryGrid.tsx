import Link from 'next/link';
import type { ProductCategory } from '@/types/category';

interface CategoryGridProps {
  categories: ProductCategory[];
  isLoading?: boolean;
}

export default function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Product Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border bg-white p-6 animate-pulse"
              >
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Product Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group rounded-lg border bg-white p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
              {cat.children && cat.children.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {cat.children.length} subcategories
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}