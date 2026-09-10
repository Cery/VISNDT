import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import CategoryRegisterSection from '@/components/home/CategoryRegisterSection';
import RecentProductsSection from '@/components/home/RecentProductsSection';
import SolutionFlowSection from '@/components/home/SolutionFlowSection';
import KnowledgeIndexSection from '@/components/home/KnowledgeIndexSection';
import CTASection from '@/components/home/CTASection';
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
      {/* 工业蓝图设计语言首页（1:1 复刻 visndt_home_redesign.html，真实数据驱动）：
          Hero → 能力分类注册表 → 近期产品 → 方案流程/场景 → 知识索引 → CTA/Footer。 */}
      <HomeHero />
      <CategoryRegisterSection />
      <RecentProductsSection />
      <SolutionFlowSection />
      <KnowledgeIndexSection />
      <CTASection />
    </>
  );
}