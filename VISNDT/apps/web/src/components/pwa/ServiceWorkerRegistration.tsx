'use client';

import { useEffect } from 'react';

/**
 * ServiceWorkerRegistration
 *
 * M21.5.2 PWA Foundation — 在浏览器支持 Service Worker 时注册 sw.js。
 * 仅在 production 环境注册（development 下 SW 缓存会干扰 HMR）。
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[VISNDT PWA] SW registered:', registration.scope);
        })
        .catch((error) => {
          console.warn('[VISNDT PWA] SW registration failed:', error.message);
        });
    }
  }, []);

  return null;
}