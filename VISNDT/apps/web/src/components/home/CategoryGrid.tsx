import Link from 'next/link';
import type { ProductCategory } from '@/types/category';
import { translateCategoryName } from '@/lib/translate';

interface CategoryGridProps {
  categories: ProductCategory[];
  isLoading?: boolean;
}

export default function CategoryGrid({ categories, isLoading }: CategoryGridProps) {
  if (isLoading) {
    return (
      <section className="py-20 bg-industrial-slate">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-8">产品分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 p-6 animate-pulse"
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
    <section className="py-20 bg-industrial-slate">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl font-extrabold mb-8">产品分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                {translateCategoryName(cat.name)}
              </h3>
              {cat.children && cat.children.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {cat.children.length} 个子分类
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}