'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/category.service';
import { translateCategoryName } from '@/lib/translate';
import SectionHeader from '@/components/brand/SectionHeader';
import PageContainer from '@/components/common/PageContainer';

/**
 * M33.3 — 能力分类（726 Contract，Industrial Tech Visual Language）
 * Before（M32/M33.2）：普通 4 列 Card Grid，图标+标题+slug 均匀平铺 → 均匀卡片墙。
 * After：结构性重组为「能力分类中心」构图布局：
 *   - 左右 Split：左侧「分类叙事 + 能力数组」视觉锚点，右侧「分类铁轨 rail（mono 序号 + 技术标尺 + 参数芯片）」
 *   - 每个分类项：mono 序号 / 技术标尺刻度 / mono slug / 子类芯片 / 箭向
 *   - 服务信息层级：Primary(分类名) → Technical(slug/序号) → Metadata(子类)
 * 仅展示层重排；仍消费 getCategories 同一数据来源；href 不变（/products?categoryId=）。
 */
export default function CategorySection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(1, 100),
    // 811 Batch A (D1): 公共目录针对焦点回归自动刷新；staleTime(全局60s) 已约束，仅过期(query)时触发。
    // 811 修补 (D1 跟进): refetchOnMount:'always' —— 覆盖纯客户端路由跳转(标签页持续聚焦、无 focus 事件)时目录仍新鲜导致分类筛选残留。
    // 811 修补 (D1 收口): staleTime:0 —— 目录数据始终视为过期，切回标签页/重新进入页面即重拉，根治「首页分类版块不刷新」。
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  const categories = data?.data ?? [];

  return (
    <section className="py-20 md:py-24 bg-surface-1 overflow-hidden relative">
      {/* 低噪技术标尺（左缘），建立工业语义空间引导 */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px hidden lg:block"
        aria-hidden="true"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(37,99,235,0.35), transparent)' }}
      />
      <PageContainer variant="content">
        <SectionHeader
          eyebrow="能力分类"
          title="标准化能力分类体系"
          subtitle="以工业检测技术语义为索引，按能力分类定位高精度内窥镜、检测相机、测量系统与检测方案。"
          className="mb-14 animate-slide-up"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-surface-1 p-6 animate-pulse"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* 左：分类叙事 + 能力数组（视觉锚点） */}
            <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-surface-2 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/70 to-industrial-cyan/0" aria-hidden="true" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">classify</p>
                <h3 className="text-lg font-bold text-foreground mt-3 leading-snug">
                  按检测能力分类
                  <br />
                  快速定向技术方向
                </h3>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  分类即能力索引：从目录结构出发，进入对应产品与技术参数上下文，匹配目标检测能力。
                </p>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { label: '分类', k: String(categories.length).padStart(2, '0') },
                  { label: '子类', k: String(categories.reduce((n, c) => n + (c.children?.length ?? 0), 0)).padStart(2, '0') },
                  { label: '索引', k: '><' },
                ].map((v) => (
                  <div key={v.label} className="rounded-lg border border-slate-200/70 bg-surface-1 px-3 py-2">
                    <p className="font-mono text-lg font-bold text-foreground tabular-nums">{v.k}</p>
                    <p className="text-xs text-muted-foreground">{v.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 右：分类铁轨 rail（mono 序号 + 技术刻度 + 子类芯片） */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/products?categoryId=${cat.id}`}
                  className="group relative rounded-xl border border-slate-200/80 bg-surface-1 p-5 shadow-industrial-sm hover:shadow-industrial-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* mono 序号 + 技术刻度 */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 tabular-nums">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                      <kbd className="w-5 h-px bg-slate-200" />
                      <kbd className="w-2 h-px bg-primary/40" />
                      <kbd className="w-px h-2 bg-industrial-cyan/50" />
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mt-2 group-hover:text-primary transition-colors">
                    {translateCategoryName(cat.name)}
                  </h3>
                  {/* 技术 slug（mono） */}
                  <p className="font-mono text-xs text-muted-foreground mt-1 truncate">{cat.slug}</p>

                  {/* 子类芯片 rail */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.children.slice(0, 4).map((child) => (
                        <span
                          key={child.id}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {translateCategoryName(child.name)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 箭向 */}
                  <span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
                    进入能力分类
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </section>
  );
}