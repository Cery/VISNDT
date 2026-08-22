import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * /robots.txt
 *
 * 公开站抓取策略：
 * - 允许抓取全部公开页面
 * - 禁止抓取 /search（动态查询页，按策略不收录）与 /api/（内部接口）
 * - 指向 sitemap.xml
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/search'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}