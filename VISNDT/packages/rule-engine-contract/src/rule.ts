/**
 * @visndt/rule-engine-contract
 * VISNDT L0 Deterministic Rule Engine Contract v0.1
 *
 * 定位：
 *   Deterministic Rule Evaluation Layer（确定性规则评估层）
 *   输入 = 既有平台数据；输出 = 规则评估结果。
 *   IF condition THEN result（只读评估），绝不 write-back 业务数据。
 *
 * 本包是「纯 TypeScript 契约」：
 *   - 无 Database ORM 依赖
 *   - 无 API Framework 依赖
 *   - 无 AI SDK / AI Runtime 依赖
 *   - 无自动决策 / 自动业务写入
 *
 * 复用 641 @visndt/identity-contract 的 BusinessEntityType，用于 Business Identity Integration。
 */

import type { BusinessEntityType } from '@visndt/identity-contract';

/** 规则严重级别 */
export type RuleSeverity = 'INFO' | 'WARNING' | 'ERROR';

/** 平台评估目标对象类型 */
export type RuleTargetType = 'PRODUCT' | 'DEMAND' | 'RFQ' | 'RFQ_RESPONSE' | 'OFFER' | 'ORGANIZATION' | 'MEDIA' | 'CONTENT';

/** 规则执行触发方式（Scheduler Boundary 的触发器契约） */
export type RuleTrigger = 'MANUAL' | 'SCHEDULED' | 'ON_DEMAND';

/**
 * 业务身份引用（复用 641 Identity Contract）。
 * references 仅用于「指向哪个对象」，不承载业务判断。
 */
export interface IdentityReference {
  type: BusinessEntityType;
  id: string;
  createdAt?: string | Date | null;
}

/**
 * 规则执行上下文。
 * - data：该规则所需的既有平台数据快照（纯类型，不绑定 ORM）。
 * - target：可选的目标对象身份引用（用于单对象评估）。
 */
export interface RuleContext {
  target?: IdentityReference;
  /** 只读数据快照；评估全程只读，禁止写库 */
  data: Record<string, unknown>;
  /** 触发方式（可选） */
  trigger?: RuleTrigger;
  /** 评估时间（可选，缺省取调用方传入或当前时间） */
  evaluatedAt?: string | Date;
}

/** 规则评估结果 */
export interface RuleResult {
  ruleId: string;
  passed: boolean;
  severity: RuleSeverity;
  message: string;
  references?: IdentityReference[];
}

/**
 * 规则定义契约。
 * evaluate(context) 返回 RuleResult，评估必须：
 *   - 只读既有数据
 *   - 无副作用（不 write-back）
 *   - 确定性
 */
export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  severity: RuleSeverity;
  targetType: RuleTargetType;
  /** 评估实现；不得修改入参、不得触发写库 */
  evaluate: (context: RuleContext) => RuleResult;
}

/** 规则评估汇总 */
export interface RuleEvaluationReport {
  targetType: RuleTargetType;
  ruleId: string;
  ruleName: string;
  triggeredAt: string;
  results: RuleResult[];
  /** 未通过（passed=false）规则数 */
  failingCount: number;
  /**
   * 已完成对象数 / 总对象数。
   * completeness 批处理用；非批处理时为 {complete:0,total:0}。
   */
  scope: { complete: number; total: number };
}