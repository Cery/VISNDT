import type { ContentType } from '../../types';

/** 前台内容详情路由（与 apps/web 实际路由保持一致，用于预览 URL）。 */
const CONTENT_ROUTE_MAP: Record<ContentType, string> = {
  ARTICLE: '/knowledge',
  KNOWLEDGE: '/knowledge',
  SOLUTION: '/solutions',
  INSIGHT: '/knowledge',
};

/** 预览用站点展示域名（仅用于 Admin SEO Preview 的可视化展示，非实际生产配置）。 */
const PREVIEW_SITE = 'visndt.com';

interface ContentSeoPreviewProps {
  title?: string | null;
  description?: string | null;
  slug?: string;
  type?: ContentType;
}

/**
 * Mock Google / Bing 搜索结果预览（仅展示，不生成 SEO）。
 * 展示 Title / URL / Description，帮助运营人员直观感受 seoTitle / seoDescription 的呈现效果。
 */
export default function ContentSeoPreview({
  title,
  description,
  slug,
  type = 'KNOWLEDGE',
}: ContentSeoPreviewProps) {
  const base = CONTENT_ROUTE_MAP[type] || '/knowledge';
  const url = `${PREVIEW_SITE}${base}/${slug || ''}`;

  return (
    <div
      style={{
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: 16,
        background: '#ffffff',
      }}
    >
      <div style={{ color: '#1a0dab', fontSize: 18, fontWeight: 500, marginBottom: 4 }}>
        {title || '（未设置 SEO 标题，将回退为内容标题）'}
      </div>
      <div style={{ color: '#006621', fontSize: 13, marginBottom: 6 }}>
        {url || 'visndt.com'}
      </div>
      <div style={{ fontSize: 14, color: '#595959' }}>
        {description || '（未设置 SEO 描述，将回退为内容摘要）'}
      </div>
    </div>
  );
}