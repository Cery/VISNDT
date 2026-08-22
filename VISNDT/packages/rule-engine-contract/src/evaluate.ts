/**
 * Operational Rule Evaluation Framework（运营规则评估框架）
 *
 * 把「规则定义」应用在「既有数据快照」上，产出评估结果。
 * 本框架：
 *   - 只读 eval
 *   - 无副作用 / 不 write-back
 *   - 确定性、纯函数
 */

import type {
  IdentityReference,
  RuleContext,
  RuleDefinition,
  RuleEvaluationReport,
  RuleResult,
} from './rule';

export interface EvaluateOptions {
  trigger?: RuleContext['trigger'];
  evaluatedAt?: string | Date;
}

/** 对单条规则的单个对象评估入口 */
export function evaluateRule(
  rule: RuleDefinition,
  target: IdentityReference,
  data: Record<string, unknown>,
  options: EvaluateOptions = {},
): RuleResult {
  const context: RuleContext = {
    target,
    data,
    trigger: options.trigger ?? 'ON_DEMAND',
    evaluatedAt: options.evaluatedAt ?? new Date().toISOString(),
  };
  return rule.evaluate(context);
}

/** 批处理：对一堆对象快照执行同一规则，汇总为报告 */
export function runRuleEvaluation(
  rule: RuleDefinition,
  subjects: { target: IdentityReference; data: Record<string, unknown> }[],
  options: EvaluateOptions = {},
): RuleEvaluationReport {
  const results = subjects.map((s) => evaluateRule(rule, s.target, s.data, options));
  return {
    targetType: rule.targetType,
    ruleId: rule.id,
    ruleName: rule.name,
    triggeredAt: options.evaluatedAt
      ? new Date(options.evaluatedAt).toISOString()
      : new Date().toISOString(),
    results,
    failingCount: results.filter((r) => !r.passed).length,
    scope: { complete: results.filter((r) => r.passed).length, total: results.length },
  };
}

/** 运行一组规则（不同目标类型的规则），扁平返回全部结果 */
export function runRules(
  rules: RuleDefinition[],
  subjects: Record<
    string,
    { target: IdentityReference; data: Record<string, unknown> }[]
  >,
  options: EvaluateOptions = {},
): RuleResult[] {
  const out: RuleResult[] = [];
  for (const rule of rules) {
    const list = subjects[rule.targetType] ?? [];
    for (const s of list) {
      out.push(evaluateRule(rule, s.target, s.data, options));
    }
  }
  return out;
}