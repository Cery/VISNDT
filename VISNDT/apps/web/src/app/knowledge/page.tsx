import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * /knowledge 路由统一重定向到 /knowledge-base
 *
 * 历史背景：
 * - /knowledge-base 是已确立的知识中心 canonical 权威路由
 * - /knowledge 曾作为历史内容频道列表页，现已统一到 /knowledge-base
 *
 * 为避免两个"知识中心"列表页造成搜索引擎重复内容竞争，
 * 现将 /knowledge 改为永久重定向至 /knowledge-base。
 *
 * 参考：批次一前端改造 - 知识库路由统一
 */
export const metadata: Metadata = {
  title: '知识中心',
  robots: { index: false, follow: true },
};

export default function KnowledgeRedirectPage() {
  redirect('/knowledge-base');
}
