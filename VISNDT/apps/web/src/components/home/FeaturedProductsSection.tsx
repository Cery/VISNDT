'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api/products';
import ProductCard from '@/components/product/ProductCard';

export default function FeaturedProductsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ status: 'ACTIVE', page: 1, pageSize: 4 }),
  });

  const products = data?.data ?? [];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              推荐产品
            </h2>
            <p className="text-slate-500">
              探索我们的工业检测设备精选
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            查看全部产品 →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-white p-4 animate-pulse"
              >
                <div className="aspect-video bg-slate-100 rounded-md mb-4" />
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
            className="inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            查看全部产品 →
          </Link>
        </div>
      </div>
    </section>
  );
}