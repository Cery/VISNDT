import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import ContentListLayout from '@/components/content/ContentListLayout';
import { buildPageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildPageMetadata({
  title: '文章中心',
  description: 'VISNDT企业动态、行业新闻、技术趋势与公司资讯。',
  path: '/articles',
});

export default async function ArticlesPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'ARTICLE', pageSize: 50 });
    contents = result.data;
  } catch {
    contents = [];
  }

  return (
    <ContentListLayout
      title="文章"
      titleHighlight="中心"
      description="企业动态、行业新闻与技术趋势，了解VISNDT的最新发展。"
      contents={contents}
      countLabel={(count) => `共 ${count} 篇文章`}
      empty={{
        icon: 'document',
        title: '文章中心',
        message: '暂无已发布的文章内容',
        description: '企业动态、行业新闻与技术趋势正在筹备中，敬请期待。',
      }}
    />
  );
}