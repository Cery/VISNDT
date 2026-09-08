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
import PageContainer from '@/components/common/PageContainer';
import RelevantEngineeringDiscovery from '@/components/engineering/RelevantEngineeringDiscovery';
import { stripGovernanceLabels } from '@/lib/display-text';
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

/** 文章/方案封面缩略图 FileAsset id：优先封面，其次媒体首图；无则 null（卡片降级纯文字） */
function contentCover(content: Content): string | null {
  if (content.coverImage?.id) return content.coverImage.id;
  return content.media?.find((m) => m.type === 'IMAGE')?.fileAsset?.id ?? null;
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
    // 842 WP-7 Discoverability（P2-841-02 详情树收口）：
    //   /knowledge/[slug] 为 ContentType.KNOWLEDGE 的 legacy 内容详情树；
    //   /knowledge-base/[slug]（Knowledge Base 条目）为已确立的知识中心 canonical 权威。
    //   两套为独立数据源（内容文章 vs 结构化知识条目），不能安全 redirect 到非等价对象，
    //   故本 legacy 详情树与 /knowledge 列表保持一致声明 noindex（不独立争索引入口，
    //   仅供内部引用继续可达），由 /knowledge-base/* 作为唯一公开知识索引面。
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
      // 842 WP-7：legacy 详情树声明 noindex（配合上方注释，/knowledge-base/* 为唯一知识索引入口）
      robots: { index: false, follow: true },
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

  // Other knowledge in the same content channel — cross-content discovery continuity.
  let otherKnowledge: Content[] = [];
  try {
    const res = await getContentList({ type: 'KNOWLEDGE', pageSize: 8, sort: 'publishedAt', order: 'desc' });
    otherKnowledge = res.data.filter((k) => k.slug !== slug).slice(0, 3);
  } catch {
    otherKnowledge = [];
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
    <PageContainer variant="content" paddingY={32}>
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
      {/* Breadcrumb — 846 §53: Home → Domain → Object */}
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

      {/* 846 §49 — 1280 外层 + 主文 720–800 阅读栏 + 侧栏 */}
      <div className="lg:flex lg:gap-8">
        {/* Main reading column */}
        <article className="flex-1 min-w-0 lg:max-w-[780px]">
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
              {stripGovernanceLabels(content.summary)}
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

          {/* 正文 — 846：字号 16–18 / 行高 1.7–1.9 阅读优化（由 MarkdownRenderer class 承载） */}
          <div className="mb-8">
            <MarkdownRenderer content={stripGovernanceLabels(content.content)} />
          </div>

          <MediaGallery media={content.media} />

          {/* Commercial conversion — 主文底部 */}
          <div className="mt-10 space-y-4">
            <ContentProductCTA contextType="knowledge" />
            <DemandCTA contextType="knowledge" targetLabel={content.title} />
          </div>

          <div className="mt-10 pt-8 border-t border-slate-200">
            <Link
              href="/knowledge"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
            >
              <span>更多技术知识</span>
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </article>

        {/* Sidebar column 280–320px */}
        <aside className="lg:w-[280px] lg:shrink-0 mt-10 lg:mt-0">
          <RelevantEngineeringDiscovery
            capabilityAnchor={content.title}
            narrow
            groups={[
              {
                label: '相关检测产品',
                mono: 'PRODUCT',
                items: relatedProducts.map((p) => ({
                  href: `/products/${p.id}`,
                  title: p.name,
                  sub: p.status === 'ACTIVE' ? '可用' : undefined,
                  fileAssetId: p.primaryMedia?.fileAssetId ?? null,
                })),
                seeAllHref: '/products',
              },
              {
                label: '相关技术知识',
                mono: 'KNOWLEDGE',
                items: otherKnowledge.map((k) => ({
                  href: `/knowledge/${k.slug}`,
                  title: k.title,
                  fileAssetId: contentCover(k),
                })),
                seeAllHref: '/knowledge',
              },
              {
                label: '相关解决方案',
                mono: 'SOLUTION',
                items: relatedSolutions.map((s) => ({
                  href: `/solutions/${s.slug}`,
                  title: s.title,
                  fileAssetId: contentCover(s),
                })),
                seeAllHref: '/solutions',
              },
            ]}
            nextActions={[
              { href: '/search', label: '统一检索相关参数' },
              { href: '/products/compare', label: '评估对比检测能力' },
              { href: '/solutions', label: '继续查看解决方案' },
            ]}
          />
        </aside>
      </div>
    </PageContainer>
  );
}