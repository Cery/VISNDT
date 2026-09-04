import { getContentList } from '@/services/content.service';
import { getEntries } from '@/services/knowledge-base.service';
import type { Content } from '@/types/content';
import type { KnowledgeEntryListItem } from '@/types/knowledge-base';

/**
 * 工程上下文注释（InsightAnnotation）解析器。
 *
 * Insight 最终语义 = Contextual Engineering Annotation Layer（非公开内容频道）。
 * 本解析器从既有已发布内容中**确定性**派生词条注释：
 * - 数据仅来自 ContentType.INSIGHT 已发布内容 + KnowledgeEntry 已发布条目（title/summary）；
 * - 按词条对真实标题/摘要做朴素的包含匹配；
 * - 若无可信匹配 → 返回 null（不渲染注释，绝不推测/伪造工程事实）。
 *
 * 无新 API / 无新 Entity / 无新 Schema（AC-05/AC-12/AC-13）。
 */

export interface EngineeringAnnotation {
  /** 被注释的工程术语 / 参数名称 */
  term: string;
  /** 真实内容的标题 */
  title: string;
  /** 真实内容的摘要（来自既有已发布内容，非杜撰） */
  body: string;
  /** 来源标签（知识域 / 内容类型） */
  sourceLabel: string;
  /** 来源跳转（INSIGHT 内容未设公开详情页 → 归口 knowledge-base；Knowledge 条目 → 详情） */
  href: string | null;
}

function normalizeTerm(term: string): string {
  return (term ?? '').trim();
}

/**
 * 解析一组工程术语对应的注释。
 * 仅当术语能在真实已发布内容（INSIGHT / Knowledge）中确定性匹配时返回注释，
 * 否则该术语不产生注释（不显示 ⓘ）。
 */
export async function resolveEngineeringAnnotations(
  terms: string[],
): Promise<EngineeringAnnotation[]> {
  const unique = Array.from(
    new Set(terms.map(normalizeTerm).filter((t) => t.length >= 2)),
  );
  if (unique.length === 0) return [];

  let insights: Content[] = [];
  try {
    const res = await getContentList({ type: 'INSIGHT', pageSize: 100 });
    insights = res.data ?? [];
  } catch {
    insights = [];
  }

  let knowledge: KnowledgeEntryListItem[] = [];
  try {
    const res = await getEntries({ pageSize: 100 });
    knowledge = res.data ?? [];
  } catch {
    knowledge = [];
  }

  const annotations: EngineeringAnnotation[] = [];

  for (const term of unique) {
    // 优先级：INSIGHT 内容 > Knowledge 条目（均为真实已发布内容）
    const insight = insights.find(
      (c) =>
        (c.title && c.title.includes(term)) ||
        (c.summary && c.summary.includes(term)),
    );
    if (insight) {
      annotations.push({
        term,
        title: insight.title,
        body: insight.summary ?? '',
        sourceLabel: '工程洞察内容',
        href: '/knowledge-base', // INSIGHT 无公开详解页 —— 归口知识中心
      });
      continue;
    }

    const entry = knowledge.find(
      (e) =>
        (e.title && e.title.includes(term)) ||
        (e.summary && e.summary.includes(term)),
    );
    if (entry) {
      annotations.push({
        term,
        title: entry.title,
        body: entry.summary ?? '',
        sourceLabel: entry.domain?.name ?? '知识条目',
        href: entry.slug ? `/knowledge-base/${entry.slug}` : '/knowledge-base',
      });
    }
    // 无可信匹配 → 不显示注释（AC-13：不伪造工程事实）
  }

  return annotations;
}