import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '能力目录',
  description: '浏览工业内窥镜、无损检测、测量系统等专业工业检测能力目录。',
  openGraph: {
    title: '能力目录 – 工业检测能力目录',
    description:
      '浏览工业内窥镜、无损检测、测量系统等专业工业检测能力目录。',
    type: 'website',
    url: `${SITE_URL}/products`,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}