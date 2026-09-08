'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getContentList } from '@/services/content.service';
import SectionHeader from '@/components/brand/SectionHeader';
import PageContainer from '@/components/common/PageContainer';

/**
 * 835 Platform UIUX — 首页「解决方案」改为数据驱动的工程应用发现面（834 §17-A / §4-H）。
 * Before：硬编码 6 个 icon-card（假 slug aerospace/pipeline...，偏离真实内容 slug），
 *         marketing intro + 装饰 Hero + 卡片墙，且 href 全指向 /solutions 列表，从不触达方案详情。
 * After：从既有权威 Content API（type=SOLUTION）实时取真，逐条可由 /solutions/[slug] 到达详情；
 *         数据枯竭时给出 0 态「当前暂无检索到的应用方案」，不靠装饰撑场面。
 * 复用既有 canonical /solutions 路由，无新增 Domain / API / Schema。
 */
export default function SolutionsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-solutions'],
    queryFn: () => getContentList({ type: 'SOLUTION', pageSize: 6, sort: 'publishedAt', order: 'desc' }),
    // 与 FeaturedProductsSection 一致的目录焦点回归自动刷新
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  const solutions = data?.data ?? [];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-100">
      <PageContainer variant="content">
        <SectionHeader
          eyebrow="应用方案"
          title="工业检测解决方案"
          subtitle="从检测问题出发，定位应用方案、所需能力与落地产品。"
          className="mb-10 animate-slide-up"
        />

        {isLoading ? (
          <div className="divide-y divide-slate-100 border-y border-slate-200/80">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-3">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-2 animate-pulse" />
                <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-slate-400">
            <p>无法加载解决方案，请稍后重试。</p>
          </div>
        ) : solutions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 border-y border-slate-200/80">
            <p className="text-sm">当前暂无检索到的应用方案，可浏览产品注册表或进入统一检索继续发现。</p>
            <Link href="/products" className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80">
              前往检测产品注册表 →
            </Link>
          </div>
        ) : (
          // 紧凑工程 rail（方案名 + 摘要 + mono 序号），非 icon 营销卡墙
          <div className="divide-y divide-slate-100 border-y border-slate-200/80">
            {solutions.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group flex items-center gap-4 py-3 hover:bg-surface-1 transition-colors"
              >
                <span className="w-10 font-mono text-xs text-slate-400 tabular-nums shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors">
                    {s.title}
                  </span>
                  {s.summary && (
                    <span className="block text-xs text-slate-500 mt-0.5 leading-snug line-clamp-1">{s.summary}</span>
                  )}
                </span>
                <svg
                  className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 text-right">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            进入解决方案中心
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}