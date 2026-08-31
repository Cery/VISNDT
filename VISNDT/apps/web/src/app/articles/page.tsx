import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import ContentListLayout from '@/components/content/ContentListLayout';
import { buildPageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildPageMetadata({
  title: '文章中心',
  description: 'VISNDT 工业检测技术资料库：方法文档、能力知识与行业技术实践。',
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
      description="技术资料库，收录 VISNDT 工业检测方法文档、能力知识与行业技术实践。"
      contents={contents}
      countLabel={(count) => `共 ${count} 项技术资料`}
      techIndex={{ code: 'ART-INDEX', label: 'Industrial Technical Documentation' }}
      empty={{
        icon: 'document',
        title: '文章中心',
        message: '暂无已发布的技术资料',
        description: '工业检测方法文档与技术资料正在收录中，敬请期待。',
      }}
    />
  );
}