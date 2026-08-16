'use client';

import Link from 'next/link';

export default function InsightsError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 text-center px-4">
      <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h2 className="text-lg font-semibold text-slate-700 mb-2">行业洞察加载异常</h2>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">
        无法加载行业洞察列表，请重试或返回首页。
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="text-sm bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
        >
          重试
        </button>
        <Link
          href="/"
          className="text-sm border border-slate-200 text-slate-600 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}