import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * /robots.txt
 *
 * 842 WP-7 Discoverability — 公开站抓取 / 索引边界：
 * - 允许抓取全部公开 Discovery 页面（Home / Search / Products / Categories /
 *   Knowledge-base / Solutions / Suppliers / Articles / Business / About …）
 * - 禁止抓取内部与非公开面：/api/（内部接口）、/search（动态查询页，按策略不收录不索引）、
 *   /login /register（认证）、/dashboard（买家/供应商工作台入口）、/workspace（买方/供应商
 *   工作区私有面）。这些面不属于公开内容类目，对搜索引擎不友好也不应被索引。
 * - 指向 sitemap.xml（仅公开 PUBLISHED 对象）。
 *
 * 未配置 /admin：Admin 治理台为独立前端应用（独立源），不在本站 robots 范围。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/search',
        '/login',
        '/register',
        '/dashboard',
        '/workspace',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}