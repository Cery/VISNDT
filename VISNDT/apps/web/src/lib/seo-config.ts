/**
 * Unified SEO Metadata Config Layer
 *
 * 统一公开站 SEO 元数据生成规则（Title / Description / Canonical / OG / Twitter）。
 * 属于页面展示层能力，只消费 lib/seo.tsx 的公开常量，不接入任何业务数据访问。
 *
 * 规则（与根布局 title.template 兼容）：
 * - Title：页面返回纯标题，由根布局模板统一追加 ` | VISNDT`
 * - Description：缺省回退到 SITE_DESCRIPTION
 * - Canonical：基于 SITE_URL 与 path 的绝对 URL（唯一规范地址）
 * - Keywords：缺省回退到 SITE_KEYWORDS
 */
import type { Metadata } from 'next';
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  absoluteUrl,
} from './seo';

/** 站点级 SEO 命名常量（供复用，避免散落硬编码） */
export const SEO_CONFIG = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  defaultTitle: `${SITE_NAME} – 工业检测能力发现平台`,
  defaultDescription: SITE_DESCRIPTION,
  defaultKeywords: SITE_KEYWORDS,
};

export interface PageSeoInput {
  /** 页面标题（纯标题，由根布局模板追加站点名） */
  title?: string;
  /** 页面描述（缺省回退 SITE_DESCRIPTION） */
  description?: string;
  /** 页面路径（用于 canonical / OG url），如 `/articles` */
  path: string;
  /** 页面关键词（缺省回退 SITE_KEYWORDS） */
  keywords?: string[];
  /** 是否禁止索引（搜索/内部等不期望被收录的页面置 true） */
  noIndex?: boolean;
  /** OG 配图绝对 URL 列表（可选） */
  images?: string[];
}

/**
 * 统一构建页面 Metadata。
 * 覆盖 title / description / keywords / robots / canonical / openGraph / twitter。
 * 与根布局的 title.template（`%s | VISNDT`）配合，保持全站标题一致性。
 */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  const fullTitle = input.title ?? SEO_CONFIG.defaultTitle;
  const description = input.description ?? SEO_CONFIG.defaultDescription;
  const canonical = absoluteUrl(input.path);

  return {
    title: input.title ?? SEO_CONFIG.defaultTitle,
    description,
    keywords: input.keywords ?? SEO_CONFIG.defaultKeywords,
    alternates: { canonical },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: canonical,
      ...(input.images && input.images.length > 0
        ? { images: input.images }
        : {}),
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  };
}