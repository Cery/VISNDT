import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';
import { JsonLdScript } from '@/lib/seo';

/**
 * M38 统一 Discoverability — 能力分类（/categories）索引边界。
 *
 * /categories 为高价值公开能力发现索引面（sitemap priority 0.8）。其页面组件
 * （categories/page.tsx）为 client component，无法导出 metadata；此处以 server
 * layout 承载 canonical + robots + CollectionPage JSON-LD，闭合该面的机器可读
 * 规范地址与索引标签（Catalog 语义 = 工程能力分类的确定性发现入口，非产品目录营销）。
 * 不改页面行为 / 数据源（getCategories 原样），仅补全公开索引边界。
 */

export const metadata: Metadata = {
  title: '能力分类',
  description:
    '按工业检测技术语义的能力分类索引注册能力——从分类结构定位检测能力、技术参数与检测场景，实现确定性能力发现。',
  alternates: { canonical: `${SITE_URL}/categories` },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'VISNDT',
    title: '能力分类 – 工业检测能力分类索引',
    description:
      '按工业检测技术语义的能力分类索引注册能力——从分类结构定位检测能力、技术参数与检测场景。',
    url: `${SITE_URL}/categories`,
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'VISNDT 工业检测能力分类索引',
          description:
            '按工业检测能力分类索引注册能力，覆盖内窥、超声波、射线、电磁等无损检测能力分类，可经统一检索精确发现。',
          url: `${SITE_URL}/categories`,
          isPartOf: {
            '@type': 'WebSite',
            name: 'VISNDT',
            url: `${SITE_URL}`,
          },
        }}
      />
      {children}
    </>
  );
}