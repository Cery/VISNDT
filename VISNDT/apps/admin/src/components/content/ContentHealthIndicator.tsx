import { Rate, Tag, Tooltip } from 'antd';
import type { Content } from '../../types/content.types';

/** SEO 完整度等级。 */
export type SeoHealthLevel = 'complete' | 'partial' | 'missing';

export function getSeoHealth(content: Content): SeoHealthLevel {
  const hasTitle = !!content.seoTitle;
  const hasDesc = !!content.seoDescription;
  const hasKeywords = !!content.seoKeywords;
  if (hasTitle && hasDesc && hasKeywords) return 'complete';
  if (hasTitle || hasDesc || hasKeywords) return 'partial';
  return 'missing';
}

export interface ContentHealth {
  score: number; // 0-100
  stars: number; // 0-5
  label: string; // 健康 / 待补全 / 需处理
  color: 'green' | 'orange' | 'red';
  seo: number; // 0-100
  cover: number; // 0-100
  tags: number; // 0-100
  publish: number; // 0-100
  details: string;
}

/**
 * 内容健康度计算（仅展示，不新增数据库字段/API）。
 *
 * 四类信号加权（权重合计 100%）：
 * - SEO 完整度（40%）：complete=100 / partial=按已配置字段比例 / missing=0
 * - 封面（30%）：存在=100 / 缺失=0
 * - 标签（15%）：>=3 个=100 / >=1 个=60 / 0 个=0
 * - 发布就绪（15%）：已发布=100 / 有定时发布=80 / 草稿或审核中=40
 */
export function computeContentHealth(content: Content): ContentHealth {
  const seoLevel = getSeoHealth(content);
  let seo = 0;
  if (seoLevel === 'complete') seo = 100;
  else if (seoLevel === 'partial') {
    const seoCount =
      (content.seoTitle ? 1 : 0) +
      (content.seoDescription ? 1 : 0) +
      (content.seoKeywords ? 1 : 0);
    seo = Math.round((seoCount / 3) * 100);
  }

  const cover = content.coverImageId || content.coverImage ? 100 : 0;

  const tagCount = content.tags?.length ?? 0;
  const tags = tagCount >= 3 ? 100 : tagCount >= 1 ? 60 : 0;

  let publish = 40;
  if (content.status === 'PUBLISHED') publish = 100;
  else if (content.scheduledPublishAt) publish = 80;

  const score = Math.round(seo * 0.4 + cover * 0.3 + tags * 0.15 + publish * 0.15);
  const stars = Math.round((score / 100) * 5);
  const result =
    score >= 80 ? { label: '健康', color: 'green' as const }
    : score >= 50 ? { label: '待补全', color: 'orange' as const }
    : { label: '需处理', color: 'red' as const };

  const seoText = seoLevel === 'complete' ? '完整' : seoLevel === 'partial' ? `部分（${seo}%）` : '未设置';
  const coverText = cover === 100 ? '存在' : '缺失';
  const tagText = tagCount > 0 ? `${tagCount} 个` : '未配置';
  const publishText =
    content.status === 'PUBLISHED' ? '已发布'
    : content.scheduledPublishAt ? '定时发布'
    : '待发布';
  const details = `SEO：${seoText}｜封面：${coverText}｜标签：${tagText}｜状态：${publishText}`;

  return { score, stars, label: result.label, color: result.color, seo, cover, tags, publish, details };
}

const COLOR_HEX: Record<ContentHealth['color'], string> = {
  green: '#52c41a',
  orange: '#fa8c16',
  red: '#f5222d',
};

/**
 * 内容健康度指示器：星级 + 概览标签 + 信号详情。
 * 仅展示运算结果，供运营快速判断内容治理状态。
 */
export default function ContentHealthIndicator({ content }: { content: Content }) {
  const health = computeContentHealth(content);
  return (
    <Tooltip
      title={
        <div style={{ maxWidth: 280, fontSize: 12 }}>
          <div style={{ marginBottom: 4 }}>内容健康度 {health.score} 分</div>
          <div style={{ marginBottom: 4 }}>SEO 完整度：{health.seo}%</div>
          <div style={{ marginBottom: 4 }}>封面状态：{health.cover === 100 ? '已配置' : '未配置'}</div>
          <div style={{ marginBottom: 4 }}>标签状态：{content.tags?.length ?? 0} 个</div>
          <div>发布状态：{content.status === 'PUBLISHED' ? '已发布' : content.scheduledPublishAt ? '定时发布' : '待发布'}</div>
        </div>
      }
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'default' }}>
        <Rate disabled value={health.stars} allowHalf={false} count={5} style={{ fontSize: 12, color: COLOR_HEX[health.color] }} />
        <Tag color={health.color} style={{ margin: 0 }}>
          {health.label}
        </Tag>
      </span>
    </Tooltip>
  );
}