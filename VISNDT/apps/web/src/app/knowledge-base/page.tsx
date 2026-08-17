import type { Metadata } from 'next';
import Link from 'next/link';
import { getDomains, getEntries } from '@/services/knowledge-base.service';
import type { KnowledgeDomain, KnowledgeEntryListItem } from '@/types/knowledge-base';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '知识库 – 工业检测知识体系',
  description: '结构化的工业检测知识体系，涵盖检测技术、检测场景、设备应用、行业应用、检测方法及参数指导等领域。',
  openGraph: {
    title: '知识库 – 工业检测知识体系',
    description: '结构化的工业检测知识体系，涵盖检测技术、检测场景、设备应用、行业应用、检测方法及参数指导等领域。',
    type: 'website',
    url: `${SITE_URL}/knowledge-base`,
  },
};

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

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
    <div>
      {/* Hero */}
      <section className="bg-industrial-dark text-white py-12 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-industrial-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            工业检测<span className="text-industrial-cyan">知识库</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            结构化的工业检测知识体系，为检测专业人士提供系统化的技术参考与方案指导。
          </p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Domain Navigation */}
        {domains.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">知识领域</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {domains.map((domain) => (
                <Link
                  key={domain.id}
                  href={`/knowledge-base/domains/${domain.slug}`}
                  className="group block p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {domain.name}
                  </h3>
                  {domain.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{domain.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>{domain._count?.categories ?? 0} 个分类</span>
                    <span>{domain._count?.knowledgeEntries ?? 0} 个条目</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Entries */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              最新知识条目
            </h2>
            {entriesTotal > 9 && (
              <span className="text-sm text-slate-400">共 {entriesTotal} 条</span>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg">暂无已发布的知识条目，敬请期待。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/knowledge-base/${entry.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-md transition-all"
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
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{entry.author?.name ?? ''}</span>
                    <span>{entry.publishedAt ? formatDate(entry.publishedAt) : ''}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}