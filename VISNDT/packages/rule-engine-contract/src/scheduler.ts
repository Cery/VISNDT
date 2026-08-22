/**
 * Scheduler Boundary（调度器边界契约）
 *
 * 本阶段只定义「调度契约」，不实现生产调度器：
 *   - 不提供 Cron Service
 *   - 不提供 Queue System
 *   - 不提供 Worker System
 *   - 不提供 Event Bus
 *
 * 契约表达：Schedule Definition → Execution Trigger → Rule Execution Entry → Result
 */

import type { RuleTrigger } from './rule';

export type ScheduleCadence = 'DAILY' | 'WEEKLY' | 'HOURLY' | 'MANUAL' | 'ON_DEMAND';

/** 调度定义：描述「何时应评估哪条规则」 */
export interface ScheduleDefinition {
  id: string;
  ruleId: string;
  cadence: ScheduleCadence;
  /** 人类可读说明（本阶段不改写为 cron 表达式） */
  note: string;
  /** 是否默认启用 */
  enabled: boolean;
}

/** 执行触发契约：由哪种触发方式发起一次规则执行 */
export interface ExecutionTriggerContract {
  scheduleId: string;
  ruleId: string;
  trigger: RuleTrigger;
  triggeredAt: string;
}

/** 规则执行入口：一次触发的完整描述 */
export interface RuleExecutionEntry {
  id: string;
  trigger: ExecutionTriggerContract;
  targetType: string;
  /** 评估参数快照（只读） */
  options: Record<string, unknown>;
}