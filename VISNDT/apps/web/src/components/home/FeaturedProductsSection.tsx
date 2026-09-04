'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/product.service';
import ProductCard from '@/components/products/ProductCard';
import SectionHeader from '@/components/brand/SectionHeader';

export default function FeaturedProductsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ status: 'ACTIVE', page: 1, pageSize: 4 }),
    // 811 Batch A (D1): 公共目录焦点回归自动刷新（与 categories 一致）。
    // 811 修补 (D1 跟进): refetchOnMount:'always' 覆盖客户端路由跳转时目录残留。
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  const products = data?.data ?? [];

  return (
    <section className="py-20 bg-industrial-slate">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader
            title="推荐产品"
            subtitle="探索我们的工业检测设备精选"
            align="left"
            className="animate-slide-up"
          />
          <Link
            href="/products"
            className="hidden sm:inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            查看全部产品 →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-industrial-sm animate-pulse"
              >
                <div className="aspect-video bg-slate-100 rounded-lg mb-4" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-slate-400">
            <p>无法加载产品，请稍后重试。</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>暂无产品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            查看全部产品 →
          </Link>
        </div>
      </div>
    </section>
  );
}