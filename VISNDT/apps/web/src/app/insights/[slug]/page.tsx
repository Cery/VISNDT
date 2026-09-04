import { redirect } from 'next/navigation';

/**
 * 公开 Insight Detail 表面退役（788 / M37 Insight Annotation Semantic Correction）。
 *
 * Insight 不再以公开独立详情页形式存在（AC-08）。最小变更：重定向至工程知识中心，
 * 保持既有链接可解析（不破坏既有系统），同时消除公开 Insight 文章详情这一内容频道。
 * Insight 作为工程上下文注释（InsightAnnotation）嵌入真实参数/术语处。
 * 无新 API / 无 Schema 变更。
 */
export default function InsightDetailPage() {
  redirect('/knowledge-base');
}