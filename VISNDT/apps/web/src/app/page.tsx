import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import InquiryCTA from '@/components/home/InquiryCTA';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} – 工业检测设备平台`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection />
      <SolutionsSection />
      <InquiryCTA />
    </>
  );
}