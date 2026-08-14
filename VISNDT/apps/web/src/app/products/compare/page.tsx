'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/services/product.service';
import { getParameterGroups } from '@/services/parameter-group.service';
import CompareTable from '@/components/products/CompareTable';
import ErrorState from '@/components/common/ErrorState';
import Loading from '@/components/common/Loading';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get('ids') ?? '';

  const ids = useMemo(() => {
    return idsParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 4);
  }, [idsParam]);

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['compare-products', ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => getProduct(id)));
      return results;
    },
    enabled: ids.length > 0,
  });

  const { data: parameterGroups } = useQuery({
    queryKey: ['parameter-groups'],
    queryFn: () => getParameterGroups(),
  });

  const validProducts = products ?? [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          产品列表
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground">产品对比</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">产品对比</h1>
        <p className="text-muted-foreground mt-1">
          对比 {validProducts.length} 个产品的技术参数
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-20">
          <Loading />
        </div>
      )}

      {/* Error */}
      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : '加载产品对比失败'}
        />
      )}

      {/* Empty / Insufficient */}
      {!isLoading && !isError && validProducts.length < 2 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
              <path d="M4 12h24M4 22h24M8 4v24M24 4v24" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">
            {validProducts.length === 0 ? '未选择产品' : '至少需要选择 2 个产品'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            在产品列表页点击产品卡片右上角的复选框，选择 2-4 个产品进行对比。
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3l-4 4 4 4" />
            </svg>
            返回产品列表
          </Link>
        </div>
      )}

      {/* Compare Table */}
      {!isLoading && !isError && validProducts.length >= 2 && (
        <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6">
          <CompareTable
            products={validProducts}
            parameterGroups={parameterGroups ?? []}
          />
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <Loading />
        </div>
      }
    >
      <ComparePageContent />
    </Suspense>
  );
}