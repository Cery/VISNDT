import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "离线 - VISNDT",
  description: "当前处于离线状态，请检查网络连接后重试。",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <svg
            className="h-10 w-10 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 5.636a9 9 0 0 1 0 12.728m-2.829-2.829a5 5 0 0 1 0-7.07m-7.07 7.07a5 5 0 0 1 0-7.07m-2.83 2.83a9 9 0 0 1 0-12.728"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">当前处于离线状态</h1>
        <p className="mb-6 text-slate-500">
          请检查您的网络连接后重试。部分已缓存的页面仍可访问。
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            返回首页
          </Link>
          <p className="text-xs text-slate-400">
            VISNDT PWA — 工业检测设备平台
          </p>
        </div>
      </div>
    </div>
  );
}