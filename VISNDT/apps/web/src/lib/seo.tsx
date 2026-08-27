/**
 * Public Website SEO Metadata Foundation
 *
 * 集中定义公开站 SEO 元数据基础常量，供根布局与各 Server 页面复用。
 * SEO Metadata 属于页面展示层能力，不接入任何业务数据访问。
 */

/** 站点名称 */
export const SITE_NAME = 'VISNDT';

/** 站点对外域名（生产环境需通过 NEXT_PUBLIC_SITE_URL 覆写） */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://visndt.example.com';

/** 站点默认描述 */
export const SITE_DESCRIPTION =
  'VISNDT是一个专业的工业检测能力发现平台——发现检测能力、能力型号、技术知识与解决方案，支持需求发布、平台撮合与询价协作。';

/** 站点全局关键词 */
export const SITE_KEYWORDS = [
  '工业检测能力',
  '能力发现',
  '无损检测',
  'NDT',
  '工业检测',
  '检测能力',
  '能力型号',
  '技术知识',
  '检测方案',
  'VISNDT',
];

/**
 * 构建内容详情页的绝对 URL（用于 canonical / OpenGraph url / JSON-LD url）。
 * 基于生产域名 SITE_URL，保证爬虫可访问。
 */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

/**
 * 构建内容封面/首图的可公开访问 URL。
 * 文件经 GET /files/:id/download（预签名重定向）访问，OG 抓取可跟随重定向。
 * 无可用图片时返回 null（调用方省略该字段）。
 */
export function contentImageUrl(fileAssetId?: string | null): string | null {
  if (!fileAssetId) return null;
  return absoluteUrl(`/files/${fileAssetId}/download`);
}

/**
 * 构建内容详情页 JSON-LD Structured Data。
 * 仅暴露无敏感的展示字段（标题/描述/作者/日期/URL/图片），不含内部 ID 与 storageKey。
 * - Knowledge → Article
 * - Solution → TechArticle
 */
export interface ContentJsonLdInput {
  type: 'Article' | 'TechArticle';
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
}

export function buildContentJsonLd(input: ContentJsonLdInput): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': input.type,
    headline: input.title,
    url: input.url,
  };

  if (input.description) jsonLd.description = input.description;
  if (input.image) jsonLd.image = input.image;
  if (input.datePublished) jsonLd.datePublished = input.datePublished;
  if (input.dateModified) jsonLd.dateModified = input.dateModified;

  if (input.authorName) {
    jsonLd.author = {
      '@type': 'Organization',
      name: input.authorName,
    };
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: SITE_NAME,
  };

  return jsonLd;
}

/**
 * 构建 Organization JSON-LD（首页使用）。
 * 基于 SITE_NAME / SITE_URL 等公开常量生成，不访问数据库。
 */
export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: absoluteUrl('/logo.png'),
  };
}

/**
 * 构建 WebSite JSON-LD（首页使用）。
 * 包含 SearchAction 以帮助搜索引擎理解站内搜索能力。
 */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/search?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 构建 Product JSON-LD（产品详情页使用）。
 * 仅基于 Product 已有公开字段，不包含价格、库存等交易字段。
 */
export interface ProductJsonLdInput {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  brand?: string | null;
  category?: string | null;
  model?: string | null;
}

export function buildProductJsonLd(input: ProductJsonLdInput): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    url: input.url,
  };

  if (input.description) jsonLd.description = input.description;
  if (input.image) jsonLd.image = input.image;
  if (input.model) jsonLd.model = input.model;

  if (input.brand) {
    jsonLd.brand = {
      '@type': 'Brand',
      name: input.brand,
    };
  }

  if (input.category) {
    jsonLd.category = input.category;
  }

  return jsonLd;
}

/**
 * 构建 BreadcrumbList JSON-LD。
 * items 按层级顺序排列，最后一项为当前页。
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbListJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 渲染 JSON-LD 的 <script> 标签（Server Component 使用）。
 * 自动过滤 undefined 值，确保合法 JSON 输出。
 */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * 构建 KnowledgeEntry JSON-LD（知识库条目详情页使用）。
 * 基于 KnowledgeEntry 公开字段，映射为 Article schema。
 */
export interface KnowledgeEntryJsonLdInput {
  title: string;
  description?: string | null;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string | null;
  domainName?: string | null;
  categoryName?: string | null;
}

export function buildKnowledgeEntryJsonLd(input: KnowledgeEntryJsonLdInput): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    url: input.url,
  };

  if (input.description) jsonLd.description = input.description;
  if (input.datePublished) jsonLd.datePublished = input.datePublished;
  if (input.dateModified) jsonLd.dateModified = input.dateModified;

  if (input.authorName) {
    jsonLd.author = {
      '@type': 'Organization',
      name: input.authorName,
    };
  }

  jsonLd.publisher = {
    '@type': 'Organization',
    name: SITE_NAME,
  };

  // Add domain/category as articleSection for SEO
  if (input.domainName && input.categoryName) {
    jsonLd.articleSection = `${input.domainName} - ${input.categoryName}`;
  } else if (input.domainName) {
    jsonLd.articleSection = input.domainName;
  }

  return jsonLd;
}