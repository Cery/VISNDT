import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContentBySlug, getContentList } from '@/services/content.service';
import { getProducts } from '@/services/product.service';
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
import DemandCTA from '@/components/conversion/DemandCTA';
import RelatedProducts from '@/components/relation/RelatedProducts';
import RelatedSolutions from '@/components/relation/RelatedSolutions';
import type { Content } from '@/types/content';
import type { Product } from '@/types/product';

interface KnowledgeDetailPageProps {
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

/** 知识详情页动态 SEO Metadata（来源：seoTitle / seoDescription / title / summary / coverImage） */
export async function generateMetadata({
  params,
}: KnowledgeDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const content = await getContentBySlug(slug);
    const title = content.seoTitle || content.title;
    const description =
      content.seoDescription ||
      content.summary?.slice(0, 160) ||
      SITE_DESCRIPTION;
    const canonical = absoluteUrl(`/knowledge/${slug}`);
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
        type: 'article',
        url: canonical,
        ...(image ? { images: [image] } : {}),
      },
      twitter: {
        card: 'summary',
        title,
        description,
      },
    };
  } catch {
    return {
      title: '知识详情',
      description: SITE_DESCRIPTION,
    };
  }
}

export default async function KnowledgeDetailPage({
  params,
}: KnowledgeDetailPageProps) {
  const { slug } = await params;

  let content;
  try {
    content = await getContentBySlug(slug);
  } catch {
    notFound();
  }

  // Commercial relation feeds — deterministic, existing public APIs only.
  // All failures degrade gracefully and must never block the detail page.
  let relatedProducts: Product[] = [];
  try {
    const res = await getProducts({ pageSize: 6, sortBy: 'createdAt', sortOrder: 'desc' });
    relatedProducts = res.data;
  } catch {
    relatedProducts = [];
  }

  let relatedSolutions: Content[] = [];
  try {
    const res = await getContentList({ type: 'SOLUTION', pageSize: 6, sort: 'publishedAt', order: 'desc' });
    relatedSolutions = res.data;
  } catch {
    relatedSolutions = [];
  }

  // JSON-LD Structured Data（Article；无敏感字段，无内部 ID）
  const jsonLd = buildContentJsonLd({
    type: 'Article',
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.summary,
    url: absoluteUrl(`/knowledge/${slug}`),
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
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <TrackOnMount
        event="content_view"
        targetId={content.id}
        source="/knowledge/[slug]"
        metadata={{ contentType: content.type, contentTitle: content.title }}
      />
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={buildBreadcrumbListJsonLd([
        { name: '首页', url: absoluteUrl('/') },
        { name: '知识中心', url: absoluteUrl('/knowledge') },
        { name: content.title, url: absoluteUrl(`/knowledge/${slug}`) },
      ])} />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto">
        <Link href="/" className="hover:text-primary transition-colors whitespace-nowrap">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/knowledge" className="hover:text-primary transition-colors whitespace-nowrap">
          知识中心
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-foreground truncate max-w-[160px] sm:max-w-[240px]">{content.title}</span>
      </nav>

      <article>
        {/* Cover Image */}
        {content.coverImage && (
          <div className="mb-6 sm:mb-8 rounded-xl overflow-hidden">
            <img
              src={`/api/assets/${content.coverImage.id}/file`}
              alt={content.coverImage.fileName ?? content.title}
              className="w-full object-cover max-h-[400px]"
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          {content.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-slate-400 mb-6 sm:mb-8">
          {content.author?.name && <span>{content.author.name}</span>}
          {content.publishedAt && <span>发布于 {formatDate(content.publishedAt)}</span>}
          {content.estimatedReadTime && <span>{content.estimatedReadTime} 分钟阅读</span>}
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

      {/* Commercial relation feeds — deterministic product / solution discovery */}
      <RelatedProducts items={relatedProducts} className="mt-12" />
      <RelatedSolutions items={relatedSolutions} className="mt-2" />

      {/* Commercial conversion — application / demand entry */}
      <div className="mt-12 mb-8 space-y-4">
        <ContentProductCTA contextType="knowledge" />
        <DemandCTA contextType="knowledge" targetLabel={content.title} />
      </div>

      {/* More from this type */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
        >
          <span>更多技术知识</span>
          <span className="text-xs">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}