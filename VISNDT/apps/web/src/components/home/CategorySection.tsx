'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/category.service';
import { translateCategoryName } from '@/lib/translate';

export default function CategorySection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
  });

  const categories = data?.data ?? [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-14 animate-slide-up">
          <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
            产品分类
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            按标准化分类浏览
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            涵盖工业内窥镜、测量系统、检测相机等专业设备分类
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 p-6 animate-pulse"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="group rounded-xl border border-slate-200/80 p-6 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-industrial-cyan/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-primary"
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

                <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {translateCategoryName(cat.name)}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
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