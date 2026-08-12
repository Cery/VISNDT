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
  'VISNDT是一个专业的工业无损检测设备平台——发现高精度内窥镜、检测相机和测量系统，支持需求发布、平台撮合与询价协作。';

/** 站点全局关键词 */
export const SITE_KEYWORDS = [
  '工业内窥镜',
  '无损检测',
  'NDT',
  '检测设备',
  '内窥镜',
  '测量系统',
  '工业检测',
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