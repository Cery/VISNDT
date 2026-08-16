'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

/**
 * 全局页面浏览追踪。
 * 每次路由变化时触发 page_view 事件。
 */
export default function PageViewTracker() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    trackEvent(buildEvent('page_view', { source: pathname }));
  }, [pathname]);

  return null;
}