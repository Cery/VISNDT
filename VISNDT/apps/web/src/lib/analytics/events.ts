/**
 * VISNDT Conversion Tracking Event Schema
 *
 * 定义 Public Web 转化行为追踪的统一事件类型。
 * 仅用于 Frontend Experience Layer，不接入任何后端/数据库。
 */

/** 转化事件类型 */
export type ConversionEventType =
  | 'page_view'
  | 'product_view'
  | 'content_view'
  | 'search'
  | 'product_filter'
  | 'cta_click'
  | 'inquiry_start'
  | 'inquiry_submit';

/** 统一转化事件结构 */
export interface ConversionEvent {
  /** 事件类型 */
  event: ConversionEventType;
  /** 触发来源（如组件名、页面路由） */
  source?: string;
  /** 目标实体 ID（如 productId、offerId） */
  targetId?: string;
  /** 扩展元数据 */
  metadata?: Record<string, unknown>;
  /** ISO 8601 时间戳 */
  timestamp: string;
}

/** 构建标准化事件 */
export function buildEvent(
  event: ConversionEventType,
  overrides?: Partial<Omit<ConversionEvent, 'event'>>,
): ConversionEvent {
  return {
    event,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}