/**
 * 846 §60 Data Trust — 公开视图显示层净化。
 *
 * 内部工程治理标签（如 `[M34.6 CONTROLLED TEST DATA]`、`[PUBLIC SOURCE DATA]`）
 * 禁止直接出现在普通买方公开视图；仅在 Admin / Governance / Data Source 区域展示。
 * 本函数为纯显示层剥离：不改写数据库内容，仅去除文本开头的方括号治理前缀。
 */

const GOVERNANCE_PREFIX = /^(\s*\[[A-Z][A-Z0-9._\s-]*\])+\s*/;

export function stripGovernanceLabels(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(GOVERNANCE_PREFIX, '').trim();
}

/** 文本是否携带治理前缀（用于 Admin 视图角标等场景）。 */
export function hasGovernanceLabels(text: string | null | undefined): boolean {
  if (!text) return false;
  return GOVERNANCE_PREFIX.test(text);
}
