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

  // 静态核心路由
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/') },
    { url: url('/products') },
    { url: url('/knowledge-base') },
    { url: url('/knowledge') },
    { url: url('/solutions') },
    { url: url('/articles') },
    { url: url('/insights') },
    { url: url('/business') },
    { url: url('/about') },
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
      });
    });
  } catch {
    // 知识库条目拉取失败时跳过
  }

  // 3. 内容详情页（Knowledge / Article / Insight / Solution）
  const contentTypes = ['KNOWLEDGE', 'ARTICLE', 'INSIGHT', 'SOLUTION'] as const;
  const contentPaths: Record<string, string> = {
    KNOWLEDGE: '/knowledge',
    ARTICLE: '/articles',
    INSIGHT: '/insights',
    SOLUTION: '/solutions',
  };

  for (const type of contentTypes) {
    try {
      const result = await getContentList({ type, page: 1, pageSize: 500 });
      (result.data ?? []).forEach((c) => {
        dynamicRoutes.push({
          url: url(`${contentPaths[type]}/${c.slug}`),
          lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
        });
      });
    } catch {
      // 该类型内容拉取失败时跳过
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}