/**
 * Completeness Check Foundation（完整性检查基础）
 *
 * 发现「不完整业务数据」，输出 CompletenessResult。
 * 禁止自动修复 —— 本层只读评估，绝不写回。
 *
 * 第一批规则（确定性）：
 *   - Product Completeness：Name / Category / Core Parameters / Media
 *   - Demand Completeness：Description / Required Parameters / Inspection Scenario
 *   - RFQ Completeness：Supplier Requirement / Response State / Required Information
 *   - Media Completeness：File Metadata / Reference / Status
 */

import type { IdentityReference, RuleContext, RuleDefinition, RuleResult, RuleSeverity } from './rule';

/** 完整性评分：0-100 */
export interface CompletenessScore {
  score: number;
  /** 缺失项标签 */
  missing: string[];
}

/** 完整性检查结果对象 */
export interface CompletenessResult {
  targetType: string;
  targetId: string;
  /** 0-100 完整度 */
  score: number;
  passed: boolean;
  missing: string[];
  findings: RuleResult[];
}

/* ------------------------------------------------------------------ */
/* 纯函数数据视图 —— 由既有数据快照（context.data）结构化读取           */
/* 若字段缺失则视为「不完整」，规则用空值安全读取，不抛错。               */
/* ------------------------------------------------------------------ */

function nonEmpty(v: unknown): boolean {
  return typeof v === 'string' ? v.trim().length > 0 : Boolean(v);
}

function countTruthy(list: unknown): number {
  return Array.isArray(list) ? list.filter(nonEmpty).length : 0;
}

/** 计算完整度：缺失项占全部检查项比例 → 0-100 */
export function computeCompletenessScore(
  checks: { key: string; ok: boolean }[],
): CompletenessScore {
  const missing = checks.filter((c) => !c.ok).map((c) => c.key);
  const total = checks.length || 1;
  const score = Math.round(((total - missing.length) / total) * 100);
  return { score, missing };
}

/** 由单条规则的通过与否输出 RuleResult（统一 message 组装） */
export function makeResult(
  def: Pick<RuleDefinition, 'id' | 'name' | 'severity'>,
  passed: boolean,
  message: string,
  references?: IdentityReference[],
): RuleResult {
  return { ruleId: def.id, passed, severity: def.severity, message, references };
}

const INFO: RuleSeverity = 'INFO';
const WARNING: RuleSeverity = 'WARNING';

/* ------------------------------------------------------------------ */
/* 第一批规则定义                                                      */
/* ------------------------------------------------------------------ */

/** Product Completeness：Name / Category / Core Parameters / Media */
export const productCompletenessRule: RuleDefinition = {
  id: 'rule.completeness.product.v1',
  name: '产品完整性检查',
  description: '检查产品名称、分类、核心参数、媒体是否完备',
  severity: WARNING,
  targetType: 'PRODUCT',
  evaluate(context: RuleContext): RuleResult {
    const { data, target } = context;
    const checks = [
      { key: 'name', ok: nonEmpty(data.name) },
      { key: 'category', ok: nonEmpty(data.categoryId) },
      {
        key: 'coreParameters',
        ok: countTruthy(data.parameterValues) > 0,
      },
      { key: 'media', ok: countTruthy(data.media) > 0 },
    ];
    const { missing } = computeCompletenessScore(checks);
    return makeResult(
      productCompletenessRule,
      missing.length === 0,
      missing.length === 0
        ? '产品基本信息、分类、核心参数与媒体均完备'
        : `产品信息不完整，缺失：${missing.join('、')}`,
      target ? [target] : undefined,
    );
  },
};

/** Demand Completeness：Description / Required Parameters / Inspection Scenario */
export const demandCompletenessRule: RuleDefinition = {
  id: 'rule.completeness.demand.v1',
  name: '需求完整性检查',
  description: '检查需求说明、必填参数、检测场景是否完备',
  severity: WARNING,
  targetType: 'DEMAND',
  evaluate(context: RuleContext): RuleResult {
    const { data, target } = context;
    const checks = [
      { key: 'description', ok: nonEmpty(data.description) },
      {
        key: 'requiredParameters',
        ok: countTruthy(data.requiredParameters) > 0,
      },
      { key: 'inspectionScenario', ok: nonEmpty(data.inspectionScenario) },
    ];
    const { missing } = computeCompletenessScore(checks);
    return makeResult(
      demandCompletenessRule,
      missing.length === 0,
      missing.length === 0
        ? '需求说明、必填参数与检测场景均完备'
        : `需求信息不完整，缺失：${missing.join('、')}`,
      target ? [target] : undefined,
    );
  },
};

/** RFQ Completeness：Supplier Requirement / Response State / Required Information */
export const rfqCompletenessRule: RuleDefinition = {
  id: 'rule.completeness.rfq.v1',
  name: '询价单完整性检查',
  description: '检查询价单供应商要求、响应状态、必填信息是否完备',
  severity: WARNING,
  targetType: 'RFQ',
  evaluate(context: RuleContext): RuleResult {
    const { data, target } = context;
    const checks = [
      { key: 'supplierRequirement', ok: nonEmpty(data.targetOrganizationId) },
      { key: 'response', ok: countTruthy(data.responses) > 0 },
      { key: 'requiredInfo', ok: nonEmpty(data.publishedAt) },
    ];
    const { missing } = computeCompletenessScore(checks);
    return makeResult(
      rfqCompletenessRule,
      missing.length === 0,
      missing.length === 0
        ? '询价单供应商要求、响应状态与必填信息均完备'
        : `询价单信息不完整，缺失：${missing.join('、')}`,
      target ? [target] : undefined,
    );
  },
};

/** Media Completeness：File Metadata / Reference / Status */
export const mediaCompletenessRule: RuleDefinition = {
  id: 'rule.completeness.media.v1',
  name: '媒体完整性检查',
  description: '检查文件元信息、引用关系、状态是否完备',
  severity: INFO,
  targetType: 'MEDIA',
  evaluate(context: RuleContext): RuleResult {
    const { data, target } = context;
    const checks = [
      {
        key: 'metadata',
        ok: nonEmpty(data.fileName) && nonEmpty(data.mimeType) && Number(data.fileSize ?? 0) > 0,
      },
      { key: 'reference', ok: Boolean(data.referenced) },
      { key: 'status', ok: data.deletedAt == null },
    ];
    const { missing } = computeCompletenessScore(checks);
    return makeResult(
      mediaCompletenessRule,
      missing.length === 0,
      missing.length === 0
        ? '文件元信息、引用关系与状态均完备'
        : `媒体信息不完整，缺失：${missing.join('、')}`,
      target ? [target] : undefined,
    );
  },
};

/** 第一批规则注册表 */
export const FIRST_BATCH_COMPLETENESS_RULES: RuleDefinition[] = [
  productCompletenessRule,
  demandCompletenessRule,
  rfqCompletenessRule,
  mediaCompletenessRule,
];

/** 目标类型 → 适用的完整性规则 */
export function completenessRulesForTarget(targetType: string): RuleDefinition[] {
  return FIRST_BATCH_COMPLETENESS_RULES.filter((r) => r.targetType === targetType);
}

/**
 * 对「既有数据快照」执行目标对象的完整性评估（批处理入口）。
 * 每个对象评估对应规则，汇总为 CompletenessResult。纯读取，无副作用。
 */
export function evaluateCompleteness(
  rule: RuleDefinition,
  target: IdentityReference,
  data: Record<string, unknown>,
): CompletenessResult {
  const result = rule.evaluate({ target, data, trigger: 'ON_DEMAND' });
  const score =
    rule.id === 'rule.completeness.media.v1'
      ? computeMediaScore(result, data)
      : result.passed
        ? 100
        : 50;
  return {
    targetType: rule.targetType,
    targetId: target.id,
    score,
    passed: result.passed,
    missing: result.passed ? [] : splitMissing(result.message),
    findings: [result],
  };
}

/** 可选：每条规则校验失败时给出可读的缺失项提示（只读，不修复） */
export function completenessHint(result: RuleResult): string {
  return result.passed
    ? '信息完备，无需处理'
    : `${result.message}。请补齐后重新评估（本层仅提示，不自动修复）。`;
}

/* ---- 内部辅助 ---- */

function splitMissing(message: string): string[] {
  const idx = message.indexOf('缺失：');
  if (idx < 0) return [];
  return message
    .slice(idx + '缺失：'.length)
    .split('、')
    .map((s) => s.trim())
    .filter(Boolean);
}

function computeMediaScore(result: RuleResult, data: Record<string, unknown>): number {
  if (result.passed) return 100;
  const okChecks = [
    typeof data.fileName === 'string' && (data.fileName as string).length > 0,
    typeof data.mimeType === 'string' && (data.mimeType as string).length > 0,
    Number(data.fileSize ?? 0) > 0,
    Boolean(data.referenced),
    data.deletedAt == null,
  ].filter(Boolean).length;
  return Math.round((okChecks / 5) * 100);
}