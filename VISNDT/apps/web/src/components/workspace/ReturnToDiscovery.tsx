'use client';

import Link from 'next/link';

interface ReturnToDiscoveryProps {
  /** 左侧上下文：当前所在业务面（如 需求、匹配、询价） */
  context: string;
}

/**
 * WP-3B Public ↔ Workspace Boundary — 返回公开发现。
 *
 * 使 Buyer Workspace 保持发现连续性：从采购工作台可回到 Public Discovery
 * （搜索 / 产品 / 知识 / 方案）。仅导航入口，不重新设计 WP-3A 公共页面。
 */
export default function ReturnToDiscovery({ context }: ReturnToDiscoveryProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-mono text-[10px] uppercase tracking-widest text-industrial-cyan">
          {context}
        </span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>继续通过公开发现了解检测能力</span>
      </div>
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        返回能力发现
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}