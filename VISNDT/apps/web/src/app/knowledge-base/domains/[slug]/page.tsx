import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDomainBySlug, getEntries } from '@/services/knowledge-base.service';
import type { KnowledgeDomainDetail, KnowledgeEntryListItem } from '@/types/knowledge-base';
import { buildPageMetadata } from '@/lib/seo-config';
import { absoluteUrl, buildBreadcrumbListJsonLd, JsonLdScript } from '@/lib/seo';

interface DomainPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: DomainPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const domain = await getDomainBySlug(slug);
    return buildPageMetadata({
      title: `${domain.name} – 知识中心`,
      description: domain.description ?? `工业检测${domain.name}领域知识，共${domain._count?.knowledgeEntries ?? 0}个知识条目。`,
      path: `/knowledge-base/domains/${slug}`,
    });
  } catch {
    return { title: '知识领域', description: '' };
  }
}

export default async function KnowledgeDomainPage({ params }: DomainPageProps) {
  const { slug } = await params;

  let domain: KnowledgeDomainDetail;
  let entries: KnowledgeEntryListItem[] = [];

  try {
    domain = await getDomainBySlug(slug);
  } catch {
    notFound();
  }

  try {
    const result = await getEntries({ domainSlug: slug, pageSize: 50 });
    entries = result.data;
  } catch {
    entries = [];
  }

  const breadcrumbItems = [
    { name: '首页', url: absoluteUrl('/') },
    { name: '知识中心', url: absoluteUrl('/knowledge-base') },
    { name: domain.name, url: absoluteUrl(`/knowledge-base/domains/${slug}`) },
  ];

  return (
    <div>
      <JsonLdScript data={buildBreadcrumbListJsonLd(breadcrumbItems)} />
      {/* Domain Hero */}
      <section className="bg-industrial-dark text-white py-10 sm:py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-md opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3">
            {domain.name}
          </h1>
          {domain.description && (
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
              {domain.description}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6 sm:mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
            首页
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/knowledge-base" className="hover:text-primary transition-colors whitespace-nowrap">
            知识中心
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-foreground truncate">{domain.name}</span>
        </nav>

        {/* Categories */}
        {domain.categories && domain.categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">知识分类</h2>
            <div className="flex flex-wrap gap-2">
              {domain.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-slate-100 text-slate-600"
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs text-slate-400">({cat._count?.entries ?? 0})</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Entries */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
            知识条目
            <span className="text-sm font-normal text-slate-400 ml-2">({entries.length})</span>
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg">该领域暂无已发布的知识条目。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/knowledge-base/${entry.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-md transition-all"
                >
                  {entry.category && (
                    <span className="inline-block text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded mb-2">
                      {entry.category.name}
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