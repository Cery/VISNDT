'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';
import type { ConversionEventType } from '@/lib/analytics/events';

interface TrackOnMountProps {
  event: ConversionEventType;
  source?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * 页面加载时触发一次追踪事件。
 * 用于 Server Component 中嵌入客户端追踪（如 product_view）。
 */
export default function TrackOnMount({
  event,
  source,
  targetId,
  metadata,
}: TrackOnMountProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent(buildEvent(event, { source, targetId, metadata }));
  }, [event, source, targetId, metadata]);

  return null;
}