'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/api/categories';

export default function CategorySection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const categories = data?.data ?? [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            产品分类
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            按标准化产品分类浏览工业检测设备
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-6 animate-pulse"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg mb-4" />
                <div className="h-5 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-slate-400">
            <p>无法加载分类，请稍后重试。</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>暂无分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="group rounded-lg border border-slate-200 p-6 hover:border-slate-400 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {cat.slug}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}