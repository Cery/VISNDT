'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categories';
import Link from 'next/link';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { translateCategoryName } from '@/lib/translate';

export default function CategoriesPage() {
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const categories = categoriesData?.data ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">产品分类</h1>
        <p className="text-muted-foreground mt-1">
          按分类浏览工业检测设备
        </p>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : '加载分类失败'}
        />
      ) : categories.length === 0 ? (
        <EmptyState message="暂无分类" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white p-6"
            >
              <h2 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {translateCategoryName(cat.name)}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {cat.slug}
              </p>
              {cat.children && cat.children.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.children.map((child) => (
                    <span
                      key={child.id}
                      className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                    >
                      {translateCategoryName(child.name)}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center text-sm font-medium text-primary">
                <span>浏览产品</span>
                <span className="ml-1 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}