import type { Metadata } from 'next';
import HomeDiscoveryLedge from '@/components/home/HomeDiscoveryLedge';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import KnowledgeCenterSection from '@/components/home/KnowledgeCenterSection';
import InquiryCTA from '@/components/home/InquiryCTA';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, buildOrganizationJsonLd, buildWebSiteJsonLd, JsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} – 工业检测能力发现平台`,
  description: SITE_DESCRIPTION,
  // M38 统一 Discoverability：首页为最高权重点（sitemap priority 1.0），
  // 补全 canonical + robots 索引边界，闭合公开首页的机器可读规范地址。
  alternates: { canonical: `${SITE_URL}/` },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} – 工业检测能力发现平台`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={buildOrganizationJsonLd()} />
      <JsonLdScript data={buildWebSiteJsonLd()} />
      {/* 846 §6.2 Final Section Order: Discovery → Featured Products → Solutions → Knowledge → Demand → Footer。
          §71 CategorySection（完整分类墙）已从 Home 移除，完整分类收敛到 /categories。 */}
      <HomeDiscoveryLedge />
      <FeaturedProductsSection />
      <SolutionsSection />
      <KnowledgeCenterSection />
      <InquiryCTA />
    </>
  );
}