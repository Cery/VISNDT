'use client';

import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/category.service';
import Link from 'next/link';
import Loading from '@/components/common/Loading';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { translateCategoryName } from '@/lib/translate';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import SectionHeader from '@/components/brand/SectionHeader';
import PageContainer from '@/components/common/PageContainer';

/**
 * M33.3 — 能力分类（/categories，726 Contract，Industrial Tech Visual Language）
 * Before（M32/M33.2）：普通列表页（h1 + 说明 + 3 列卡片，图标缺失、无技术语义、层级扁平）。
 * After：结构性重组为「工业检测能力分类体验」：
 *   - Dark Technical Header 带（Brand Context + 能力语义 Intro + mono 分类/子类数据锚点）
 *   - SectionHeader（能力分类导航入口层级）
 *   - 分类列表：Split 构图 rail——每个分类项含 mono 序号/能力刻度/技术 slug/子类芯片/进入箭向
 *   - 与 Product Center 统一视觉语言（dark band + 低噪网格 + 数字标签 + 统一 glyph 标尺）
 * 数据来源（getCategories）、Loading/Error/Empty 状态、href（/products?categoryId=）完全不变；仅展示层重构。
 */
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
    <div className="min-h-screen bg-surface-0">
      {/* Dark Technical Header */}
      <div className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
        <PageContainer variant="content" paddingY={40}>
          <div className="max-w-4xl relative">
            <IndustrialBadge label="能力分类 · 分类导航" tone="cyan" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-5 tracking-tight">
            能力分类
          </h1>
          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            按工业检测能力分类索引注册能力——从分类结构定位检测能力、技术参数与检测场景，实现确定性能力发现。
          </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="font-mono text-lg font-bold text-white tabular-nums">
                  {String(categories.length).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400">能力分类</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
                <span className="font-mono text-lg font-bold text-white tabular-nums">
                  {String(categories.reduce((n, c) => n + (c.children?.length ?? 0), 0)).padStart(2, '0')}
                </span>
                <span className="text-xs text-slate-400">子类能力</span>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer variant="content" paddingY={32}>
        <SectionHeader
          eyebrow="CAPABILITY CLASSIFICATION"
          title="能力分类索引"
          subtitle="从工业检测技术语义出发，按能力分类索引注册能力、技术参数与检测方案。"
          className="mb-10 animate-slide-up"
        />

        {isLoading ? (
          <Loading />
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : '加载分类失败'}
          />
        ) : categories.length === 0 ? (
          <EmptyState message="暂无分类" />
        ) : (
          <>
            {/* Technical directory ledger — indexed industrial capability directory frame */}
            <div className="mb-5 rounded-lg border border-slate-200/80 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-industrial-dark/95">
                <span className="h-3 w-1 rounded-sm bg-industrial-cyan" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
                  CAPABILITY
                </span>
                <span className="text-slate-600">/</span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-industrial-cyan">
                  Capability Registry Index
                </span>
                <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-slate-500 hidden md:inline">
                  NO · ROUTE · SUB-CAP
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  className="group relative rounded-xl border border-slate-200/80 bg-surface-1 p-6 shadow-industrial-sm hover:shadow-industrial-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* mono 序号 + 技术刻度 */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                      <kbd className="w-6 h-px bg-slate-200" />
                      <kbd className="w-2 h-px bg-primary/40" />
                      <kbd className="w-px h-2 bg-industrial-cyan/50" />
                    </span>
                  </div>

                  <h2 className="font-semibold text-lg text-foreground mt-2 group-hover:text-primary transition-colors">
                    {translateCategoryName(cat.name)} 检测能力
                  </h2>
                  {/* Technical route descriptor — mono grouping derived from existing slug */}
                  <div className="mt-1.5 flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 shrink-0">
                      {cat.slug.replace(/-/g, ' ')} · CAPABILITY
                    </span>
                  </div>

                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.children.slice(0, 5).map((child) => (
                        <span
                          key={child.id}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {translateCategoryName(child.name)} 能力
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer — technical sub-capability metric + entry */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      SUB-CAP {String(cat.children?.length ?? 0).padStart(2, '0')}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary">
                      浏览能力索引
                      <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}