import type { Product } from '@/types/product';
import ProductCard from './ProductCard';
import EmptyState from '@/components/common/EmptyState';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  /** 总结果数（用于显示结果统计） */
  totalCount?: number;
  /** 是否有激活的筛选条件 */
  hasActiveFilters?: boolean;
  /** 当前搜索关键词（用于高亮 + 上下文展示） */
  searchKeyword?: string;
  /** 当前页码 */
  currentPage?: number;
  /** 每页数量 */
  pageSize?: number;
}

export default function ProductGrid({
  products,
  isLoading,
  totalCount,
  hasActiveFilters,
  searchKeyword,
  currentPage,
  pageSize: _pageSize = 12,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div>
        {/* Skeleton header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-4 animate-pulse"
            >
              <div className="aspect-video bg-muted rounded-md mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={hasActiveFilters ? 'search' : 'package'}
        message={hasActiveFilters ? '未找到匹配产品' : '暂无产品'}
        description={
          hasActiveFilters
            ? searchKeyword
              ? `未找到与「${searchKeyword}」相关的产品。请尝试调整关键词或清除筛选条件后重新搜索。`
              : '当前筛选条件没有匹配的产品。请尝试调整筛选条件或清除筛选后重新搜索。'
            : '产品目录正在建设中，敬请期待更多产品上线。'
        }
      />
    );
  }

  // Build search context string
  const searchContext = searchKeyword ? `搜索「${searchKeyword}」` : '';

  return (
    <div>
      {/* Result count header with search context */}
      {totalCount !== undefined && (
        <div className="mb-4 text-sm text-slate-500">
          {searchContext ? (
            <>
              {searchContext}，共{' '}
              <span className="font-medium text-slate-700">{totalCount}</span>{' '}
              个产品
            </>
          ) : (
            <>
              共{' '}
              <span className="font-medium text-slate-700">{totalCount}</span>{' '}
              个产品
            </>
          )}
          {currentPage && totalCount > 0 && (
            <span className="text-slate-400 ml-2">
              · 第 {currentPage} 页
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} searchKeyword={searchKeyword} />
        ))}
      </div>
    </div>
  );
}