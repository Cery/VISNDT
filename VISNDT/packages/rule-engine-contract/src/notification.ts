/**
 * Notification Contract Layer（通知契约层）
 *
 * 本阶段仅定义「通知意图（Notification Intent）」，不实现通知系统：
 *   - 不提供 Email Provider
 *   - 不提供 SMS
 *   - 不提供 Push Service
 *   - 不提供外部消息投递
 *
 * Notification = Contract（意图），不是 Notification System。
 */

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

/** 通知意图：由一次规则评估派生出的「应当提醒某事」的意图表达 */
export interface NotificationIntent {
  type: string;
  target: string;
  message: string;
  priority: NotificationPriority;
  /** 关联的规则 id（可选） */
  ruleId?: string;
  /** 关联对象身份引用 id（可选） */
  targetRef?: string;
}

/** 如何从一条规则评估结果推导通知意图（确定性映射；可选 helper） */
export function intentFromResult(
  result: { ruleId: string; severity: string; message: string; references?: { id: string }[] },
): NotificationIntent | null {
  if (result.severity === 'INFO') return null; // INFO 不通知
  return {
    type: 'RULE_ALERT',
    target: result.references?.[0]?.id ?? 'UNKNOWN',
    message: result.message,
    priority: result.severity === 'ERROR' ? 'HIGH' : 'MEDIUM',
    ruleId: result.ruleId,
    targetRef: result.references?.[0]?.id,
  };
}