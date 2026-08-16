import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContentBySlug } from '@/services/content.service';
import TrackOnMount from '@/components/analytics/TrackOnMount';
import {
  SITE_DESCRIPTION,
  absoluteUrl,
  contentImageUrl,
  buildContentJsonLd,
  buildBreadcrumbListJsonLd,
  JsonLdScript,
} from '@/lib/seo';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import ContentProductCTA from '@/components/common/ContentProductCTA';

interface SolutionDetailPageProps {
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

/** 解决方案详情页动态 SEO Metadata（来源：seoTitle / seoDescription / title / summary / coverImage） */
export async function generateMetadata({
  params,
}: SolutionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const content = await getContentBySlug(slug);
    const title = content.seoTitle || content.title;
    const description =
      content.seoDescription ||
      content.summary?.slice(0, 160) ||
      SITE_DESCRIPTION;
    const canonical = absoluteUrl(`/solutions/${slug}`);
    // OG image：优先封面，其次媒体首图
    const image =
      contentImageUrl(content.coverImage?.id) ??
      contentImageUrl(
        content.media?.find((m) => m.type === 'IMAGE')?.fileAsset?.id,
      );
    const keywords = content.seoKeywords?.split(/[,，]/).filter(Boolean);
    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonical,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return {
      title: '解决方案详情',
      description: SITE_DESCRIPTION,
    };
  }
}

export default async function SolutionDetailPage({
  params,
}: SolutionDetailPageProps) {
  const { slug } = await params;

  let solution;
  try {
    solution = await getContentBySlug(slug);
  } catch {
    notFound();
  }

  // JSON-LD Structured Data（TechArticle；无敏感字段，无内部 ID）
  const jsonLd = buildContentJsonLd({
    type: 'TechArticle',
    title: solution.seoTitle || solution.title,
    description: solution.seoDescription || solution.summary,
    url: absoluteUrl(`/solutions/${slug}`),
    image:
      contentImageUrl(solution.coverImage?.id) ??
      contentImageUrl(
        solution.media?.find((m) => m.type === 'IMAGE')?.fileAsset?.id,
      ),
    datePublished: solution.publishedAt ?? undefined,
    dateModified: solution.updatedAt,
    authorName: solution.author?.name,
  });

  return (
    <div className="max-w-[820px] mx-auto px-6 py-10">
      <TrackOnMount
        event="content_view"
        targetId={solution.id}
        source="/solutions/[slug]"
        metadata={{ contentType: solution.type, contentTitle: solution.title }}
      />
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={buildBreadcrumbListJsonLd([
        { name: '首页', url: absoluteUrl('/') },
        { name: '解决方案', url: absoluteUrl('/solutions') },
        { name: solution.title, url: absoluteUrl(`/solutions/${slug}`) },
      ])} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/solutions" className="hover:text-primary transition-colors">
          解决方案
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[240px]">{solution.title}</span>
      </nav>

      <article>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          {solution.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-slate-400 mb-8">
          {solution.author?.name && <span>{solution.author.name}</span>}
          {solution.publishedAt && <span>发布于 {formatDate(solution.publishedAt)}</span>}
        </div>

        {solution.summary && (
          <p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
            {solution.summary}
          </p>
        )}

        {/* Tag Chips */}
        {solution.tags && solution.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-slate-400 mr-1">标签：</span>
            {solution.tags.map(({ tag }) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mb-8">
          <MarkdownRenderer content={solution.content} />
        </div>
      </article>

      {/* Commercial CTA */}
      <div className="mt-8 mb-8">
        <ContentProductCTA contextType="solution" />
      </div>

      {/* More from this type */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <Link
          href="/solutions"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
        >
          <span>更多行业方案</span>
          <span className="text-xs">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}