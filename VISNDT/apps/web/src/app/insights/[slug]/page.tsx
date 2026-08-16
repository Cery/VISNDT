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
import MediaGallery from '@/components/content/MediaGallery';
import ContentProductCTA from '@/components/common/ContentProductCTA';

interface InsightDetailPageProps {
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

export async function generateMetadata({
  params,
}: InsightDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const content = await getContentBySlug(slug);
    const title = content.seoTitle || content.title;
    const description =
      content.seoDescription ||
      content.summary?.slice(0, 160) ||
      SITE_DESCRIPTION;
    const canonical = absoluteUrl(`/insights/${slug}`);
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
        type: 'article',
        url: canonical,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return {
      title: '行业洞察详情',
      description: SITE_DESCRIPTION,
    };
  }
}

export default async function InsightDetailPage({
  params,
}: InsightDetailPageProps) {
  const { slug } = await params;

  let content;
  try {
    content = await getContentBySlug(slug);
  } catch {
    notFound();
  }

  const jsonLd = buildContentJsonLd({
    type: 'TechArticle',
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.summary,
    url: absoluteUrl(`/insights/${slug}`),
    image:
      contentImageUrl(content.coverImage?.id) ??
      contentImageUrl(
        content.media?.find((m) => m.type === 'IMAGE')?.fileAsset?.id,
      ),
    datePublished: content.publishedAt ?? undefined,
    dateModified: content.updatedAt,
    authorName: content.author?.name,
  });

  return (
    <div className="max-w-[820px] mx-auto px-6 py-10">
      <TrackOnMount
        event="content_view"
        targetId={content.id}
        source="/insights/[slug]"
        metadata={{ contentType: content.type, contentTitle: content.title }}
      />
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={buildBreadcrumbListJsonLd([
        { name: '首页', url: absoluteUrl('/') },
        { name: '行业洞察', url: absoluteUrl('/insights') },
        { name: content.title, url: absoluteUrl(`/insights/${slug}`) },
      ])} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/insights" className="hover:text-primary transition-colors">
          行业洞察
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[240px]">{content.title}</span>
      </nav>

      <article>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          {content.title}
        </h1>

        <div className="flex items-center gap-3 text-sm text-slate-400 mb-8">
          {content.author?.name && <span>{content.author.name}</span>}
          {content.publishedAt && <span>发布于 {formatDate(content.publishedAt)}</span>}
        </div>

        {content.summary && (
          <p className="text-base text-slate-600 leading-relaxed mb-8 border-l-4 border-primary/30 pl-4">
            {content.summary}
          </p>
        )}

        {/* Tag Chips */}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-slate-400 mr-1">标签：</span>
            {content.tags.map(({ tag }) => (
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
          <MarkdownRenderer content={content.content} />
        </div>

        <MediaGallery media={content.media} />
      </article>

      {/* Commercial CTA */}
      <div className="mt-8 mb-8">
        <ContentProductCTA contextType="insight" />
      </div>

      {/* More from this type */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <Link
          href="/insights"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
        >
          <span>更多行业洞察</span>
          <span className="text-xs">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}