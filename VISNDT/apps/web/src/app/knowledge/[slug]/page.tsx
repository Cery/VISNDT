import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getContentBySlug } from '@/services/content.service';
import {
  SITE_DESCRIPTION,
  absoluteUrl,
  contentImageUrl,
  buildContentJsonLd,
} from '@/lib/seo';
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer';
import MediaGallery from '@/components/content/MediaGallery';

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
    <div className="max-w-[820px] mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span className="text-slate-300">/</span>
        <Link href="/knowledge" className="hover:text-primary transition-colors">
          知识中心
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

        <div className="mb-8">
          <MarkdownRenderer content={content.content} />
        </div>

        <MediaGallery media={content.media} />
      </article>
    </div>
  );
}