import type { Metadata } from 'next';
import { getContentList } from '@/services/content.service';
import type { Content } from '@/types/content';
import ContentListLayout from '@/components/content/ContentListLayout';
import { buildPageMetadata } from '@/lib/seo-config';

export const metadata: Metadata = buildPageMetadata({
  title: '行业洞察',
  description: '工业检测行业深度分析、参数解读、数据洞察与趋势研究。',
  path: '/insights',
});

export default async function InsightsPage() {
  let contents: Content[] = [];
  try {
    const result = await getContentList({ type: 'INSIGHT', pageSize: 50 });
    contents = result.data;
  } catch {
    contents = [];
  }

  return (
    <ContentListLayout
      title="行业"
      titleHighlight="洞察"
      description="深度行业分析、参数解读与数据洞察，为工业检测专业决策提供参考。"
      contents={contents}
      countLabel={(count) => `共 ${count} 篇洞察`}
      empty={{
        icon: 'document',
        title: '行业洞察',
        message: '暂无已发布的行业洞察内容',
        description: '深度行业分析、参数解读与数据洞察正在筹备中，敬请期待。',
      }}
    />
  );
}