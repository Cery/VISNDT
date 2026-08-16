/**
 * VISNDT Conversion Tracking Adapter
 *
 * 统一转化事件追踪入口，基于 Adapter Pattern 设计：
 * - 开发环境：ConsoleAdapter — console.log 输出，不阻塞页面
 * - 生产环境：ApiAdapter — 批量上报至 POST /api/analytics/events
 *
 * 禁止：页面内直接 console.log 模拟埋点。
 */

import type { ConversionEvent } from './events';

/** 追踪适配器接口 */
export interface TrackingAdapter {
  /** 发送单个转化事件 */
  send(event: ConversionEvent): void;
}

// ===== ConsoleAdapter：开发环境 console 输出 =====

const ConsoleAdapter: TrackingAdapter = {
  send(event: ConversionEvent) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Analytics] ${event.event}`,
        event.source ? `source=${event.source}` : '',
        event.targetId ? `target=${event.targetId}` : '',
        event.metadata ? JSON.stringify(event.metadata) : '',
      );
    }
  },
};

// ===== ApiAdapter：生产环境批量上报至后端 =====

const API_URL = '/api/analytics/events';

const apiAdapter = (() => {
  const queue: ConversionEvent[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  const maxBatchSize = 20;
  const flushInterval = 3000;

  function flush() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (queue.length === 0) return;

    const batch = queue.splice(0, maxBatchSize);
    const payload = JSON.stringify({
      events: batch.map((e) => ({
        event: e.event,
        userId: (e as unknown as Record<string, unknown>).userId as string | undefined,
        organizationId: (e as unknown as Record<string, unknown>).organizationId as string | undefined,
        sessionId: (e as unknown as Record<string, unknown>).sessionId as string | undefined,
        entityType: (e as unknown as Record<string, unknown>).entityType as string | undefined,
        entityId: (e as unknown as Record<string, unknown>).entityId as string | undefined,
        source: e.source,
        metadata: e.metadata,
      })),
    });

    // fire-and-forget: 不阻塞页面，静默失败
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(API_URL, payload);
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }

  return {
    send(event: ConversionEvent) {
      queue.push(event);
      if (queue.length >= maxBatchSize) {
        flush();
      } else if (!timer) {
        timer = setTimeout(flush, flushInterval);
      }
    },
  };
})();

const ApiAdapter: TrackingAdapter = {
  send(event: ConversionEvent) {
    apiAdapter.send(event);
  },
};

// ===== Adapter Registry =====

let currentAdapter: TrackingAdapter =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
    ? ApiAdapter
    : ConsoleAdapter;

/** 替换追踪适配器（生产环境注入真实 Provider） */
export function setTrackingAdapter(adapter: TrackingAdapter): void {
  currentAdapter = adapter;
}

// ===== 统一追踪入口 =====

/** 发送转化事件 */
export function trackEvent(event: ConversionEvent): void {
  try {
    currentAdapter.send(event);
  } catch {
    // 追踪失败不阻塞页面
  }
}