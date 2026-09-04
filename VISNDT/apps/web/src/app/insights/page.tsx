import { redirect } from 'next/navigation';

/**
 * 公开 Insight Library 表面退役（788 / M37 Insight Annotation Semantic Correction）。
 *
 * Insight 最终语义 = Contextual Engineering Annotation Layer（非公开内容频道）。
 * /insights 不再是公开 Insight Library / 内容频道 —— 最小变更：重定向至工程知识中心，
 * 使用户进入真实工程信息发现（Knowledge），公开 Insight 列表面退役（AC-07）。
 * 无新 API / 无 Schema 变更。
 */
export default function InsightsPage() {
  redirect('/knowledge-base');
}