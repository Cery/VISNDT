import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import PlatformFlowSection from '@/components/home/PlatformFlowSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import InquiryCTA from '@/components/home/InquiryCTA';
import { SITE_NAME, SITE_DESCRIPTION, buildOrganizationJsonLd, buildWebSiteJsonLd, JsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} – 工业无损检测产品与技术方案平台`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <JsonLdScript data={buildOrganizationJsonLd()} />
      <JsonLdScript data={buildWebSiteJsonLd()} />
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
      <PlatformFlowSection />
      <SolutionsSection />
      <InquiryCTA />
    </>
  );
}