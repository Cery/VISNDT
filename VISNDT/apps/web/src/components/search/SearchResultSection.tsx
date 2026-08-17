import type { ReactNode } from 'react';

interface SearchResultSectionProps {
  title: string;
  count: number;
  children: ReactNode;
  /** Whether to show loading skeleton */
  loading?: boolean;
  /** Whether to show error state */
  error?: boolean;
}

export default function SearchResultSection({
  title,
  count,
  children,
  loading = false,
  error = false,
}: SearchResultSectionProps) {
  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          {title}
          {!loading && (
            <span className="text-xs sm:text-sm font-normal text-slate-400">
              ({count} 条结果)
            </span>
          )}
        </h2>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 p-5 animate-pulse"
            >
              <div className="h-5 bg-slate-100 rounded w-3/4 mb-3" />
              <div className="h-4 bg-slate-50 rounded w-full mb-2" />
              <div className="h-4 bg-slate-50 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-sm text-slate-400">
          <p>加载失败，请稍后重试</p>
        </div>
      )}

      {!loading && !error && count === 0 && (
        <div className="text-center py-8 text-sm text-slate-400">
          <p>暂无结果</p>
        </div>
      )}

      {!loading && !error && count > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {children}
        </div>
      )}
    </section>
  );
}