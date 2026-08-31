'use client';

import { useEffect, useState } from 'react';

/**
 * M32.2 — Back To Top（无第三方依赖）。
 * 滚动超过 480px 后出现，smooth 滚动回顶部（prefers-reduced-motion 下由 globals.css 自动降级）。
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      type="button"
      aria-label="返回顶部"
      onClick={scrollTop}
      className={`btn-press fixed bottom-24 right-4 z-[80] flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-industrial-md transition-all hover:text-primary hover:border-primary/40 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}