import type { Metadata } from 'next';
import Link from 'next/link';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import { SITE_URL } from '@/lib/seo';
import ContentCard from '@/components/content/ContentCard';
import EmptyState from '@/components/common/EmptyState';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import PageContainer from '@/components/common/PageContainer';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';

export const metadata: Metadata = {
  title: '知识中心',
  description:
    '为工业检测专业人士提供的技术文章、检测指南、应用案例和设备选型指南。',
  // 797: 补全 /knowledge 列表页 canonical（详情页已有，列表页缺失）
  alternates: { canonical: `${SITE_URL}/knowledge` },
  openGraph: {
    title: '知识中心 – 工业检测技术知识',
    description:
      '为工业检测专业人士提供的技术文章、检测指南、应用案例和设备选型指南。',
    type: 'website',
    url: `${SITE_URL}/knowledge`,
  },
};

/**
 * 804_M39 — Knowledge list recomposition (WP-3A.4 platformization alignment).
 *
 * The page no longer renders as an isolated content channel. It is aligned with
 * the cross-surface engineering discovery ecosystem (same pattern as /solutions):
 *
 *   Engineering Problem → Inspection Context → Knowledge
 *        → Capability / Product / Solution / Search
 *
 * Data source (getContentList type=KNOWLEDGE), route semantics and Content cards
 * are unchanged. This is a page-level structural recomposition reusing existing
 * Foundation components (EngineeringDiscoveryNav / IndustrialBadge / PageContainer).
 */
export default async function KnowledgePage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'KNOWLEDGE', pageSize: 50 });
    contents = result.data;
  } catch {
    // API unavailable — render empty state, keep hero visible
    contents = [];
  }

  const knowledgeCount = contents.length;

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Engineering Context Header — knowledge as technical information discovery surface */}
      <div className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
        <PageContainer variant="content" paddingY={40}>
          <div className="max-w-4xl relative">
            <IndustrialBadge label="工程信息发现 · 技术知识" tone="cyan" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-5 tracking-tight">
              技术知识中心
            </h1>
            {/* Knowledge journey line — understanding → capability → solution (mono) */}
            <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
              <span className="text-slate-400">WHY</span>
              <span className="text-slate-600"> → </span>
              <span className="text-industrial-cyan">KNOWLEDGE</span>
              <span className="text-slate-600"> → </span>
              <span className="text-slate-400">CAPABILITY</span>
              <span className="text-slate-600"> → </span>
              <span className="text-slate-400">SOLUTION</span>
            </p>
            <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
              面向工业检测专业人士的技术指南、应用案例与设备选型知识。从「为什么 / 怎么理解」出发，
              沿知识语境收敛到检测能力、产品与解决方案——而非仅浏览一份文章清单。
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="font-mono text-lg font-bold text-white tabular-nums">
                {String(knowledgeCount).padStart(2, '0')}
              </span>
              <span className="text-xs text-slate-400">已收录技术知识</span>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer variant="content" paddingY={32}>
        {/* Cross-surface discovery — knowledge sits inside the engineering discovery ecosystem */}
        <div className="mb-8">
          <EngineeringDiscoveryNav activeLabel="知识中心" />
        </div>

        {/* Engineering context quick entry — governed capabilities / products / solutions / provider / search */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500 mb-3">
            从知识语境进入
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/categories', label: '能力分类', mono: 'CAP' },
              { href: '/products', label: '检测产品', mono: 'PRD' },
              { href: '/solutions', label: '解决方案', mono: 'SOL' },
              { href: '/search?type=supplier-product', label: '能力提供方', mono: 'SPL' },
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
            icon="document"
            title="知识中心"
            message="暂无已发布的知识内容"
            description="技术文章、检测指南与应用案例正在筹备中，敬请期待。"
          />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="h-5 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                <span className="text-industrial-cyan">KNOWLEDGE INDEX</span>
                <span className="mx-2 text-slate-300">/</span>
                Technical Knowledge Registry
              </span>
              <span className="ml-auto font-mono text-xs text-slate-500 tabular-nums">
                共 {knowledgeCount} 篇技术知识
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {contents.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* Next action — carry the reader onward into evaluation & discovery */}
        <div className="mt-10 rounded-xl border border-slate-200/80 bg-surface-1 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">对技术知识的下一步工程发现</p>
              <p className="text-sm text-muted-foreground mt-1">
                理解检测原理与参数后，进入能力分类界定检测范围，或通过统一检索核对参数、产品与解决方案。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                统一检索<span aria-hidden="true">→</span>
              </Link>
              <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                检测产品<span aria-hidden="true">→</span>
              </Link>
              <Link href="/solutions" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                解决方案<span aria-hidden="true">→</span>
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
