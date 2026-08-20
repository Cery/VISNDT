import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import PlatformFlowSection from '@/components/home/PlatformFlowSection';
import KnowledgeCenterSection from '@/components/home/KnowledgeCenterSection';
import CapabilityProviderSection from '@/components/home/CapabilityProviderSection';
import InquiryCTA from '@/components/home/InquiryCTA';
import { SITE_NAME, SITE_DESCRIPTION, buildOrganizationJsonLd, buildWebSiteJsonLd, JsonLdScript } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} – 工业检测能力发现平台`,
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
      <SolutionsSection />
      <PlatformFlowSection />
      <KnowledgeCenterSection />
      <CapabilityProviderSection />
      <InquiryCTA />
    </>
  );
}