import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEntryBySlug, getEntryRelatedProducts } from '@/services/knowledge-base.service';
import type { KnowledgeEntryDetail, RelatedProductItem } from '@/types/knowledge-base';
import RelevantEngineeringDiscovery from '@/components/engineering/RelevantEngineeringDiscovery';
import { SITE_URL, absoluteUrl, buildKnowledgeEntryJsonLd, buildBreadcrumbListJsonLd, JsonLdScript } from '@/lib/seo';

interface EntryDetailPageProps {
  params: Promise<{ slug: string }>;
}

interface StructuredSection {
  title?: string;
  content?: string;
  items?: string[];
  table?: {
    headers?: string[];
    rows?: string[][];
  };
}

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const RELATION_TYPE_LABELS: Record<string, string> = {
  RELATED: '相关',
  CHILD: '子条目',
  PARENT: '父条目',
  PREREQUISITE: '前置知识',
  FOLLOWUP: '后续知识',
};

const REFERENCE_TYPE_LABELS: Record<string, string> = {
  SOURCE: '来源',
  RELATED: '相关',
  SUPPLEMENT: '补充',
};

export async function generateMetadata({ params }: EntryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const entry = await getEntryBySlug(slug);
    const title = entry.seoTitle || entry.title;
    const description = entry.seoDescription || entry.summary?.slice(0, 160) || '';
    const keywords = entry.seoKeywords?.split(/[,，]/).filter(Boolean);
    return {
      title,
      description,
      keywords,
      alternates: { canonical: `${SITE_URL}/knowledge-base/${slug}` },
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${SITE_URL}/knowledge-base/${slug}`,
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch {
    return { title: '知识条目', description: '' };
  }
}

export default async function KnowledgeEntryDetailPage({ params }: EntryDetailPageProps) {
  const { slug } = await params;

  let entry: KnowledgeEntryDetail;
  try {
    entry = await getEntryBySlug(slug);
  } catch {
    notFound();
  }

  let relatedProducts: RelatedProductItem[] = [];
  try {
    relatedProducts = await getEntryRelatedProducts(slug);
  } catch {
    relatedProducts = [];
  }

  const allRelations = [
    ...(entry.sourceRelations ?? []).map((r) => ({ ...r, direction: 'source' as const })),
    ...(entry.targetRelations ?? []).map((r) => ({ ...r, direction: 'target' as const })),
  ];

  // JSON-LD Structured Data
  const entryUrl = absoluteUrl(`/knowledge-base/${slug}`);
  const entryJsonLd = buildKnowledgeEntryJsonLd({
    title: entry.seoTitle || entry.title,
    description: entry.seoDescription || entry.summary,
    url: entryUrl,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    authorName: entry.author?.name,
    domainName: entry.domain?.name,
    categoryName: entry.category?.name,
  });

  const breadcrumbItems = [
    { name: '首页', url: absoluteUrl('/') },
    { name: '知识中心', url: absoluteUrl('/knowledge-base') },
  ];
  if (entry.domain) {
    breadcrumbItems.push({
      name: entry.domain.name,
      url: absoluteUrl(`/knowledge-base/domains/${entry.domain.slug}`),
    });
  }
  breadcrumbItems.push({ name: entry.title, url: entryUrl });

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <JsonLdScript data={entryJsonLd} />
      <JsonLdScript data={buildBreadcrumbListJsonLd(breadcrumbItems)} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-4 sm:mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/knowledge-base" className="hover:text-primary transition-colors whitespace-nowrap">
          知识中心
        </Link>
        {entry.domain && (
          <>
            <span className="text-slate-300">/</span>
            <Link
              href={`/knowledge-base/domains/${entry.domain.slug}`}
              className="hover:text-primary transition-colors whitespace-nowrap"
            >
              {entry.domain.name}
            </Link>
          </>
        )}
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[160px] sm:max-w-[240px]">{entry.title}</span>
      </nav>

      <article>
        {/* Domain & Category Tags */}
        <div className="flex items-center gap-2 mb-3">
          {entry.domain && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
              {entry.domain.name}
            </span>
          )}
          {entry.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              {entry.category.name}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          {entry.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-400 mb-6 sm:mb-8">
          {entry.author?.name && <span>{entry.author.name}</span>}
          {entry.publishedAt && <span>发布于 {formatDate(entry.publishedAt)}</span>}
        </div>

        {entry.summary && (
          <p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
            {entry.summary}
          </p>
        )}

        {/* Structured Body */}
        {entry.structuredBody && (
          <div className="mb-10">
            {Array.isArray(entry.structuredBody.sections) ? (
              <div className="space-y-6">
                {entry.structuredBody.sections.map((section: StructuredSection, idx: number) => (
                  <section key={idx}>
                    {section.title && (
                      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                        {section.title}
                      </h2>
                    )}
                    {section.content && (
                      <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </div>
                    )}
                    {section.items && Array.isArray(section.items) && (
                      <ul className="list-disc list-inside space-y-1 text-base text-slate-700 pl-2">
                        {section.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {section.table && typeof section.table === 'object' && (
                      <div className="overflow-x-auto mt-2">
                        <table className="w-full text-sm border border-slate-200 rounded-lg">
                          {section.table.headers && (
                            <thead>
                              <tr className="bg-slate-50">
                                {section.table.headers.map((h: string, i: number) => (
                                  <th key={i} className="px-3 py-2 text-left font-medium text-slate-600 border-b border-slate-200">
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          {section.table.rows && (
                            <tbody>
                              {section.table.rows.map((row: string[], ri: number) => (
                                <tr key={ri} className="border-b border-slate-100 last:border-0">
                                  {row.map((cell: string, ci: number) => (
                                    <td key={ci} className="px-3 py-2 text-slate-700">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            ) : (
              <pre className="text-sm text-slate-500 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">
                {JSON.stringify(entry.structuredBody, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Content References */}
        {entry.contentRefs && entry.contentRefs.length > 0 && (
          <section className="mb-10 p-4 sm:p-6 bg-slate-50 rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">参考内容</h2>
            <div className="space-y-3">
              {entry.contentRefs.map((ref) => (
                <div key={ref.id} className="flex items-start gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-600 mt-0.5 shrink-0">
                    {REFERENCE_TYPE_LABELS[ref.referenceType] ?? ref.referenceType}
                  </span>
                  <Link
                    href={`/${ref.content.type.toLowerCase()}/${ref.content.slug}`}
                    className="text-sm text-primary hover:text-primary/80 transition-colors line-clamp-1"
                  >
                    {ref.content.title}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Knowledge Relations */}
        {allRelations.length > 0 && (
          <section className="mb-10 p-4 sm:p-6 bg-slate-50 rounded-xl">
            <h2 className="text-lg font-bold text-foreground mb-4">知识关联</h2>
            <div className="space-y-3">
              {allRelations.map((rel) => {
                const relatedEntry =
                  rel.direction === 'source'
                    ? rel.target
                    : rel.source;
                const label =
                  rel.direction === 'source'
                    ? RELATION_TYPE_LABELS[rel.relationType] ?? rel.relationType
                    : rel.relationType === 'CHILD'
                      ? '父条目'
                      : rel.relationType === 'PARENT'
                        ? '子条目'
                        : RELATION_TYPE_LABELS[rel.relationType] ?? rel.relationType;

                return (
                  <div key={rel.id} className="flex items-start gap-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-600 mt-0.5 shrink-0">
                      {label}
                    </span>
                    {relatedEntry ? (
                      <Link
                        href={`/knowledge-base/${relatedEntry.slug}`}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        {relatedEntry.title}
                        {rel.description && (
                          <span className="text-slate-400 ml-1">— {rel.description}</span>
                        )}
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-400">(已下架)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </article>

      {/* 802_M39 — Relevant Engineering Discovery：把“相关产品”重构为分组的“相关工程发现”——
          把知识关联与相关检测能力产品折叠为单一发现面，提供工程相关性框架 + 跨面下一步发现。
          非购物推荐，未引入 recommendation domain。 */}
      <RelevantEngineeringDiscovery
        capabilityAnchor={entry.title}
        groups={[
          {
            label: '相关检测能力产品',
            mono: 'PRODUCT',
            items: relatedProducts.map((p) => ({
              href: `/products/${p.id}`,
              title: p.name,
              sub: p.status === 'ACTIVE' ? '可用' : undefined,
            })),
            seeAllHref: '/products',
          },
          {
            label: '关联技术知识',
            mono: 'KNOWLEDGE',
            items: allRelations
              .map((rel) => {
                const re = rel.direction === 'source' ? rel.target : rel.source;
                return re
                  ? { href: `/knowledge-base/${re.slug}`, title: re.title }
                  : null;
              })
              .filter(Boolean) as { href: string; title: string }[],
            seeAllHref: '/knowledge-base',
          },
        ]}
        nextActions={[
          { href: '/search', label: '统一检索相关参数' },
          { href: '/products/compare', label: '评估对比检测能力' },
          { href: '/categories', label: '回到能力分类' },
        ]}
      />

      {/* Back to Knowledge Base */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <Link
          href="/knowledge-base"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
        >
          <span>返回知识中心</span>
          <span className="text-xs">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}