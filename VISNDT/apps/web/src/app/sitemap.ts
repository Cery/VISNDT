import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getContentList } from '@/services/content.service';

/**
 * /sitemap.xml
 * 仅收录 PUBLISHED 内容（公开 API 只返回 PUBLISHED）。
 * 包含静态核心页 + 知识中心/解决方案详情页。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  // 静态核心路由
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/') },
    { url: url('/knowledge') },
    { url: url('/solutions') },
    { url: url('/products') },
    { url: url('/business') },
    { url: url('/about') },
  ];

  // 拉取 PUBLISHED 内容（公开 API，仅已发布内容）
  let contentRoutes: MetadataRoute.Sitemap = [];
  try {
    const [knowledge, solutions] = await Promise.all([
      getContentList({ type: 'KNOWLEDGE', page: 1, pageSize: 100 }),
      getContentList({ type: 'SOLUTION', page: 1, pageSize: 100 }),
    ]);

    contentRoutes = [
      ...(knowledge.data ?? []).map((c) => ({
        url: url(`/knowledge/${c.slug}`),
        lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
      })),
      ...(solutions.data ?? []).map((c) => ({
        url: url(`/solutions/${c.slug}`),
        lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
      })),
    ];
  } catch {
    // 内容拉取失败时仅返回静态路由，不阻断 sitemap 生成
  }

  return [...staticRoutes, ...contentRoutes];
}