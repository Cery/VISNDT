import { useEffect, useState } from 'react';
import { Typography, Tag, Descriptions, Image, Space, Alert } from 'antd';
import type { Content } from '../../types';
import { fileAssetService } from '../../api/file-asset.service';
import ContentSeoPreview from './ContentSeoPreview';

const { Text } = Typography;

/** SEO 标题建议区间（字符）。 */
const TITLE_MIN = 30;
const TITLE_MAX = 60;
/** SEO 描述建议区间（字符）。 */
const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 160;

type LengthLevel = 'optimal' | 'too_short' | 'too_long' | 'empty';

/** 计算字符长度级别（非阻断校验提示）。 */
function lengthLevel(value: string | null | undefined, min: number, max: number): LengthLevel {
  if (!value) return 'empty';
  const len = value.length;
  if (len < min) return 'too_short';
  if (len > max) return 'too_long';
  return 'optimal';
}

const LEVEL_TAG_MAP: Record<LengthLevel, { color: string; label: string }> = {
  optimal: { color: 'green', label: '符合建议' },
  too_short: { color: 'orange', label: '过短' },
  too_long: { color: 'orange', label: '过长' },
  empty: { color: 'default', label: '未设置' },
};

interface ContentSeoPanelProps {
  content: Content;
}

/**
 * Content SEO Operation Panel（ADMIN，只读运营视图）。
 * 展示 SEO Title / SEO Description / SEO Keywords / Slug / Cover Image，
 * 提供非阻断的长度质量提示与 Mock 搜索结果预览。
 * 仅复用现有 Content 数据，不新增保存接口、不生成 SEO。
 */
export default function ContentSeoPanel({ content }: ContentSeoPanelProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (content.coverImage?.id) {
      fileAssetService
        .getSignedUrl(content.coverImage.id)
        .then((url) => {
          if (!cancelled) setCoverUrl(url);
        })
        .catch(() => {
          if (!cancelled) setCoverUrl(null);
        });
    } else {
      setCoverUrl(null);
    }
    return () => {
      cancelled = true;
    };
  }, [content.coverImage?.id]);

  const titleLevel = lengthLevel(content.seoTitle, TITLE_MIN, TITLE_MAX);
  const descLevel = lengthLevel(content.seoDescription, DESCRIPTION_MIN, DESCRIPTION_MAX);
  const titleTag = LEVEL_TAG_MAP[titleLevel];
  const descTag = LEVEL_TAG_MAP[descLevel];

  const hasHints =
    titleLevel !== 'optimal' || descLevel !== 'optimal' || !content.seoKeywords;

  return (
    <div>
      <Descriptions
        bordered
        size="small"
        column={{ xs: 1, sm: 2 }}
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label="SEO 标题">
          <Space direction="vertical" size={2}>
            <span>{content.seoTitle || '（未设置，将回退为内容标题）'}</span>
            <Tag color={titleTag.color} style={{ marginInlineEnd: 0 }}>
              {titleTag.label}（{content.seoTitle?.length ?? 0} 字符，建议 {TITLE_MIN}-{TITLE_MAX}）
            </Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="SEO 描述">
          <Space direction="vertical" size={2}>
            <span>{content.seoDescription || '（未设置，将回退为内容摘要）'}</span>
            <Tag color={descTag.color} style={{ marginInlineEnd: 0 }}>
              {descTag.label}（{content.seoDescription?.length ?? 0} 字符，建议 {DESCRIPTION_MIN}-{DESCRIPTION_MAX}）
            </Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="SEO 关键词">
          <Space direction="vertical" size={2}>
            <span>{content.seoKeywords || '（未设置，可选）'}</span>
            <Tag color="blue">可选</Tag>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Slug">
          <Text code>{content.slug}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="封面图" span={2}>
          {content.coverImage ? (
            <Image
              src={coverUrl || ''}
              alt={content.coverImage.fileName}
              width={96}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={coverUrl ? true : false}
              fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNDgiIHk9IjQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSI5Ij5Ob0ltZzwvdGV4dD48L3N2Zz4="
            />
          ) : (
            <Text type="secondary">暂无封面图</Text>
          )}
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {content.coverImage
                ? `${content.coverImage.fileName} · ${content.coverImage.mimeType}`
                : '未设置封面图（OG 图将回退为媒体首图或省略）'}
            </Text>
          </div>
        </Descriptions.Item>
      </Descriptions>

      {hasHints && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="SEO 质量提示（非阻断）"
          description="以下为建议性提示，不影响内容保存与发布："
        />
      )}

      <Typography.Title level={5} style={{ marginBottom: 8 }}>
        搜索结果预览
      </Typography.Title>
      <ContentSeoPreview
        title={content.seoTitle || content.title}
        description={content.seoDescription || content.summary}
        slug={content.slug}
        type={content.type}
      />
    </div>
  );
}