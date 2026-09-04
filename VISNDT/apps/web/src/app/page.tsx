import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import PlatformJourneySection from '@/components/home/PlatformJourneySection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import PlatformFlowSection from '@/components/home/PlatformFlowSection';
import KnowledgeCenterSection from '@/components/home/KnowledgeCenterSection';
import CapabilityProviderSection from '@/components/home/CapabilityProviderSection';
import EngineeringDiscoveryNav from '@/components/engineering/EngineeringDiscoveryNav';
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
      <HeroSection />
      {/* M39 平台化重构：首屏后即呈现平台操作模型与双角色闭环（工程发现 → 技术连接），
          确立 discovery-first 信息层级；随后进入能力分类 → 产品 → 方案 → 知识 → 供应 → 连接。 */}
      <PlatformJourneySection />
      <CategorySection />
      <FeaturedProductsSection />
      <SolutionsSection />
      <PlatformFlowSection />
      <KnowledgeCenterSection />
      <CapabilityProviderSection />
      {/* M38 跨面发现收束：统一工程信息发现入口（复用既有 EngineeringDiscoveryNav） */}
      <section className="bg-surface-1 py-14 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-center">
            <div className="w-full">
              <EngineeringDiscoveryNav />
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            知识中心 · 解决方案 · 检测产品 · 统一检索 —— 一条路径完成工业检测能力发现。
          </p>
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}