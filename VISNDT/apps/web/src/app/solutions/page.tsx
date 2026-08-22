import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import ContentListLayout from '@/components/content/ContentListLayout';
import { buildPageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildPageMetadata({
  title: '工业检测解决方案',
  description: '探索面向航空航天、汽车、管道、电子和制造领域的工业检测解决方案。',
  path: '/solutions',
});

export default async function SolutionsPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'SOLUTION', pageSize: 50 });
    contents = result.data;
  } catch {
    contents = [];
  }

  return (
    <ContentListLayout
      eyebrow="Solutions"
      title="工业检测"
      titleHighlight="解决方案"
      description="为航空航天、汽车、能源、管道、电子与半导体等关键工业领域，提供全面的无损检测和视觉检测技术方案。"
      contents={contents}
      countLabel={(count) => `共 ${count} 个解决方案`}
      empty={{
        icon: 'package',
        title: '暂无已发布的解决方案',
        message: '解决方案内容正在筹备中',
        description: '面向航空航天、汽车、能源等关键工业领域的检测方案将陆续上线。',
      }}
    />
  );
}