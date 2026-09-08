import type { Metadata } from 'next';
import Link from 'next/link';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { buildPageMetadata } from '@/lib/seo-config';
import ContentCard from '@/components/content/ContentCard';
import EmptyState from '@/components/common/EmptyState';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import PageContainer from '@/components/common/PageContainer';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';

export const metadata: Metadata = buildPageMetadata({
  title: '工业检测解决方案',
  description: '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
  path: '/solutions',
});

/**
 * 802_M39 — Solution list recomposition.
 *
 * The page no longer renders through the generic ContentListLayout. It is an
 * Engineering Solution Discovery Surface:
 *
 *   Engineering Problem → Inspection Context → Required Capability
 *        → Solution Index → Capability Providers → Connection
 *
 * This is a page-level structural recomposition (new section architecture,
 * engineering-context header, cross-surface discovery nav, discovery journey
 * trail and next-action). Data source (getContentList type=SOLUTION), route
 * semantics and Content cards are unchanged. It is not a marketing landing page.
 */
export default async function SolutionsPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'SOLUTION', pageSize: 50 });
    contents = result.data;
  } catch {
    contents = [];
  }

  const solutionCount = contents.length;

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Engineering Context Header — problem → inspection context → capability framing */}
      <div className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
        <PageContainer variant="content" paddingY={40}>
          <div className="max-w-4xl relative">
            <IndustrialBadge label="工程解决方案 · 发现面" tone="cyan" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-5 tracking-tight">
              工业检测解决方案
            </h1>
            {/* Engineering problem → required capability journey line (mono) */}
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
              <span className="text-slate-400">PROBLEM</span>
              <span className="text-slate-600"> → </span>
              <span className="text-industrial-cyan">CONTEXT</span>
              <span className="text-slate-600"> → </span>
              <span className="text-slate-400">CAPABILITY</span>
              <span className="text-slate-600"> → </span>
              <span className="text-slate-400">PROVIDER</span>
              <span className="text-slate-600"> → </span>
              <span className="text-slate-400">CONNECTION</span>
            </p>
            <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
              面向航空航天、汽车、能源、管道、电子与半导体等关键工业领域的无损检测与视觉检测工程方案——
              从工程问题出发，定位所需检测能力、适用产品与能力提供方。
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {String(solutionCount).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400">已收录工程解决方案</span>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer variant="content" paddingY={32}>
        {/* Cross-surface discovery — solutions sit inside the engineering discovery ecosystem */}
        <div className="mb-8">
          <EngineeringDiscoveryNav activeLabel="解决方案" />
        </div>

        {/* Engineering context quick entry — governed capabilities / products / knowledge / provider / search */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
            从工程语境进入
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/categories', label: '能力分类', mono: 'CAP' },
              { href: '/products', label: '检测产品', mono: 'PRD' },
              { href: '/knowledge-base', label: '工程知识', mono: 'KNW' },
              { href: '/search', label: '统一检索', mono: 'SRC' },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-surface-1 px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest text-industrial-cyan">
                  {t.mono}
                </span>
                <span>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {contents.length === 0 ? (
          <EmptyState
            icon="package"
            title="暂无已发布的解决方案"
            message="解决方案内容正在筹备中"
            description="面向航空航天、汽车、能源等关键工业领域的检测方案将陆续上线。可先通过统一检索定位检测能力与方案语境。"
          />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-5 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                <span className="text-industrial-cyan">SOLUTION INDEX</span>
                <span className="mx-2 text-slate-300">/</span>
                Engineering Solution Registry
              </span>
              <span className="ml-auto font-mono text-xs text-slate-500 tabular-nums">
                共 {solutionCount} 个解决方案
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
              {contents.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* Next action — carry the solver onward into evaluation & connection */}
        <div className="mt-10 rounded-xl border border-slate-200/80 bg-surface-1 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">对检测问题的下一步工程发现</p>
              <p className="text-sm text-muted-foreground mt-1">
                收敛方案后，进入能力分类界定检测范围，或通过统一检索核对参数、产品与供应商。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                统一检索<span aria-hidden="true">→</span>
              </Link>
              <Link href="/products/compare" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                评估对比<span aria-hidden="true">→</span>
              </Link>
              <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                能力分类<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}