import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getContentList } from '@/services/content.service';
import { getProducts } from '@/services/product.service';
import { getEntries } from '@/services/knowledge-base.service';

/**
 * /sitemap.xml
 *
 * 收录所有公开 PUBLISHED 内容资产，覆盖：
 * - 静态核心页（首页、产品列表、知识库、解决方案、文章、洞察、业务、关于）
 * - 产品详情页（Product）
 * - 知识库条目页（KnowledgeEntry）
 * - 内容详情页（Knowledge / Article / Insight / Solution）
 *
 * 注意：
 * - /search 动态查询页不收录（按 SEO 策略）
 * - 各数据源拉取失败时仅跳过对应路由，不阻断 sitemap 生成
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  // 静态核心路由（含 SEO 元数据：更新频率 + 优先级）
  // M38 GA: 能力分类（/categories）= 高价值公开能力发现索引面，纳入 sitemap 索引边界
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'daily', priority: 1.0 },
    { url: url('/products'), changeFrequency: 'daily', priority: 0.9 },
    { url: url('/categories'), changeFrequency: 'daily', priority: 0.8 },
    { url: url('/knowledge-base'), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/knowledge'), changeFrequency: 'weekly', priority: 0.4 },
    { url: url('/solutions'), changeFrequency: 'weekly', priority: 0.8 },
    { url: url('/articles'), changeFrequency: 'weekly', priority: 0.7 },
    { url: url('/business'), changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/about'), changeFrequency: 'yearly', priority: 0.4 },
  ];

  // 动态路由收集
  const dynamicRoutes: MetadataRoute.Sitemap = [];

  // 1. 产品详情页
  try {
    const products = await getProducts({ page: 1, pageSize: 500 });
    (products.data ?? []).forEach((p) => {
      dynamicRoutes.push({
        url: url(`/products/${p.id}`),
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch {
    // 产品拉取失败时跳过
  }

  // 2. 知识库条目
  try {
    const entries = await getEntries({ page: 1, pageSize: 500 });
    (entries.data ?? []).forEach((e) => {
      dynamicRoutes.push({
        url: url(`/knowledge-base/${e.slug}`),
        lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch {
    // 知识库条目拉取失败时跳过
  }

  // 3. 内容详情页（Knowledge / Article / Solution）
  //    Insight 内容（ContentType.INSIGHT）不作为公开 SEO 落地页收录（788：Insight = Contextual Annotation，
  //    非公开内容频道，无独立 sitemap / canonical / 外部可发现；其公开详情面已退役/重定向）。
  const contentTypes = ['KNOWLEDGE', 'ARTICLE', 'SOLUTION'] as const;
  const contentPaths: Record<string, string> = {
    KNOWLEDGE: '/knowledge',
    ARTICLE: '/articles',
    SOLUTION: '/solutions',
  };
  const contentPriority: Record<string, number> = {
    KNOWLEDGE: 0.4,
    ARTICLE: 0.6,
    SOLUTION: 0.7,
  };

  for (const type of contentTypes) {
    try {
      const result = await getContentList({ type, page: 1, pageSize: 500 });
      (result.data ?? []).forEach((c) => {
        dynamicRoutes.push({
          url: url(`${contentPaths[type]}/${c.slug}`),
          lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
          changeFrequency: 'weekly',
          priority: contentPriority[type] ?? 0.5,
        });
      });
    } catch {
      // 该类型内容拉取失败时跳过
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}