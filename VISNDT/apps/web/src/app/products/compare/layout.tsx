import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '产品对比',
  description:
    '并排对比多个工业检测能力产品的技术参数与规格，辅助工程检测设备选型决策。',
  alternates: { canonical: `${SITE_URL}/products/compare` },
  robots: { index: true, follow: true },
  openGraph: {
    title: '产品对比 – 工业检测能力选型',
    description:
      '并排对比多个工业检测能力产品的技术参数与规格，辅助工程检测设备选型决策。',
    type: 'website',
    url: `${SITE_URL}/products/compare`,
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}