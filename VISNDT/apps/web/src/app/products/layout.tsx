import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: '能力注册表',
  description: '浏览工业内窥镜、无损检测、测量系统等已注册工业检测能力，按技术参数与检测场景发现匹配能力。',
  openGraph: {
    title: '能力注册表 – 工业检测能力发现',
    description:
      '浏览工业内窥镜、无损检测、测量系统等已注册工业检测能力，按技术参数与检测场景发现匹配能力。',
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