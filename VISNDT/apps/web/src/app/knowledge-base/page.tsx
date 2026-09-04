import type { Metadata } from 'next';
import Link from 'next/link';
import { getDomains, getEntries } from '@/services/knowledge-base.service';
import type { KnowledgeDomain, KnowledgeEntryListItem } from '@/types/knowledge-base';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';
import EmptyState from '@/components/common/EmptyState';
import IndustrialBadge from '@/components/brand/IndustrialBadge';
import { buildPageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildPageMetadata({
  title: '知识中心 – 工业检测专业知识库',
  description: '结构化的工业检测知识体系，涵盖检测技术、检测场景、设备应用、行业应用、检测方法及参数指导等领域。',
  path: '/knowledge-base',
  keywords: ['工业检测', '知识库', '检测技术', '检测方法', '参数指导'],
});

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** 803_M39 — 工程信息发现主链：从工程问题出发 → 知识领域 → 技术信息 → 关联能力 → 产品与方案 → 下一步发现。 */
const ENGINEERING_DISCOVERY_CHAIN = [
  { mono: 'Q', label: '工程问题', hint: '明确检测对象与判定需求', key: 'q' },
  { mono: 'K', label: '知识领域', hint: '定位技术主题与分类', key: 'k' },
  { mono: 'T', label: '技术信息', hint: '检测原理 / 参数 / 方法', key: 't' },
  { mono: 'C', label: '关联能力', hint: '界定所需检测能力', key: 'c' },
  { mono: 'P', label: '产品与方案', hint: '评估适用设备与方案', key: 'p' },
];

export default async function KnowledgeBaseHomePage() {
  let domains: KnowledgeDomain[] = [];
  let entries: KnowledgeEntryListItem[] = [];
  let entriesTotal = 0;

  try {
    const [domainsResult, entriesResult] = await Promise.all([
      getDomains(),
      getEntries({ pageSize: 9 }),
    ]);
    domains = domainsResult;
    entries = entriesResult.data;
    entriesTotal = entriesResult.total;
  } catch {
    // API unavailable
  }

  return (
    <div className="min-h-screen bg-surface-0">
      {/* 803_M39 — Engineering Information Discovery 语境头：问题 → 领域 → 技术信息 → 能力 → 产品/方案 主链 */}
      <section className="bg-industrial-dark relative overflow-hidden border-b border-slate-200/80">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-20" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-primary/0 via-industrial-cyan/50 to-primary/0" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative">
          <IndustrialBadge label="工程信息发现 · 知识资产" tone="cyan" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
            工业检测知识中心
          </h1>
          {/* 工程问题 → 下一步发现 mono 主链（历史环境信息层级，非营销叙事） */}
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
            <span className="text-slate-400">QUESTION</span>
            <span className="text-slate-600"> → </span>
            <span className="text-industrial-cyan">DOMAIN</span>
            <span className="text-slate-600"> → </span>
            <span className="text-slate-400">TECH</span>
            <span className="text-slate-600"> → </span>
            <span className="text-slate-400">CAPABILITY</span>
            <span className="text-slate-600"> → </span>
            <span className="text-slate-400">SOLUTION</span>
          </p>
          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            从工程问题出发，定位检测技术主题、参数解读与检测方法；再沿主链收敛到关联能力、产品与方案，
            继续向工程评估与连接推进——而非仅浏览一份文章清单。
          </p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Cross-surface engineering-information discovery */}
        <div className="mb-8">
          <EngineeringDiscoveryNav activeLabel="知识中心" />
        </div>

        {/* 803_M39 — 工程信息发现主链 band：问题 → 领域 → 技术 → 能力 → 方案/产品 */}
        <section className="mb-10 rounded-xl border border-slate-200/80 bg-surface-1 overflow-hidden">
          <div className="bg-industrial-dark/95 px-4 py-3 flex items-center gap-3">
            <span className="h-3 w-1 rounded-sm bg-industrial-cyan" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate-300">
              ENGINEERING INFORMATION DISCOVERY CHAIN
            </span>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest text-slate-500 ml-auto">
              QUESTION · DOMAIN · TECH · CAPABILITY · SOLUTION
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-100 border-t border-slate-100">
            {ENGINEERING_DISCOVERY_CHAIN.map((s) => (
              <div key={s.mono} className="px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-industrial-cyan">{s.mono}</p>
                <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 803_M39 — 工程语境快捷入口：从知识语境进入既有发现面（能力分类 / 产品 / 方案 / 提供方 / 检索） */}
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

        {/* Domain Navigation — 工程知识领域（问题→主题 定位） */}
        {domains.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-5 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
                <span className="text-industrial-cyan">KNOWLEDGE DOMAIN</span>
                <span className="mx-2 text-slate-300">/</span>
                Technical Topic Index
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {domains.map((domain) => (
                <Link
                  key={domain.id}
                  href={`/knowledge-base/domains/${domain.slug}`}
                  className="group block p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {domain.name}
                  </h3>
                  {domain.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{domain.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                    <span>{domain._count?.categories ?? 0} CAT</span>
                    <span>{domain._count?.knowledgeEntries ?? 0} KBC</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Entries — 技术信息（关联能力/主题定位） */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-5 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
              <span className="text-industrial-cyan">TECHNICAL INFORMATION</span>
              <span className="mx-2 text-slate-300">/</span>
              Knowledge Entries
            </span>
            {entriesTotal > 9 && (
              <span className="ml-auto font-mono text-xs text-slate-500 tabular-nums">
                共 {entriesTotal} 条
              </span>
            )}
          </div>

          {entries.length === 0 ? (
            <EmptyState
              icon="document"
              title="暂无已发布的知识条目"
              message="知识中心内容将随工程信息资产的收录持续沉淀。"
              description="可先通过统一检索定位检测技术、参数解读与应用语境，或将您的检测问题转化为结构化检索起点。"
              action={{ label: '前往统一检索', href: '/search' }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/knowledge-base/${entry.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  {entry.domain && (
                    <span className="inline-block text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded mb-2">
                      {entry.domain.name}
                    </span>
                  )}
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {entry.title}
                  </h3>
                  {entry.summary && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{entry.summary}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{entry.author?.name ?? ''}</span>
                    <span>{entry.publishedAt ? formatDate(entry.publishedAt) : ''}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 803_M39 — Next Discovery：把求解者沿工程信息主链继续推进（评估 / 方案 / 连接） */}
        <div className="mt-10 rounded-xl border border-slate-200/80 bg-surface-1 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">对检测问题的下一步工程发现</p>
              <p className="text-sm text-muted-foreground mt-1">
                定位技术信息后，进入能力分类界定检测范围、查看检测产品参数，或通过统一检索收敛能力与提供方。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                能力分类<span aria-hidden="true">→</span>
              </Link>
              <Link href="/products" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                检测产品<span aria-hidden="true">→</span>
              </Link>
              <Link href="/solutions" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                解决方案<span aria-hidden="true">→</span>
              </Link>
              <Link href="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80">
                统一检索<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}