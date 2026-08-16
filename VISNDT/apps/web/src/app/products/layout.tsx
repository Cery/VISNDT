import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '产品中心',
  description: '浏览工业内窥镜、无损检测设备、测量系统等专业工业检测设备产品目录。',
  openGraph: {
    title: '产品中心 – 工业检测设备目录',
    description:
      '浏览工业内窥镜、无损检测设备、测量系统等专业工业检测设备产品目录。',
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