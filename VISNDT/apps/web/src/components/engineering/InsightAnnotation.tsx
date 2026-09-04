'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { EngineeringAnnotation } from '@/lib/engineering-insight/annotation';

interface InsightAnnotationProps {
  annotation: EngineeringAnnotation;
}

/**
 * InsightAnnotation — 可复用工程上下文注释（Contextual Engineering Annotation）。
 *
 * Insight = Engineering Semantic Annotation / Contextual Explanation（非公开内容频道）。
 * - 桌面：hover 展开 + click 钉住；
 * - 移动/触屏：tap 展开/收起（不依赖 hover-only）。
 * - 内容仅来自既有已发布内容（title + summary，确定性派生，data-driven resolver），无伪造工程事实。
 * - 显式标注「工程解释 · 语义派生 · 非独立数据库实体」。
 */
export default function InsightAnnotation({
  annotation,
}: InsightAnnotationProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部 / Esc 关闭（触屏关闭路径）
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      className="relative inline-flex items-center align-middle"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={`查看「${annotation.term}」的工程注释`}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="ml-1.5 -mb-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-industrial-cyan/50 bg-slate-50 text-[10px] font-bold leading-none text-industrial-cyan hover:bg-industrial-cyan hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-industrial-cyan"
      >
        ⓘ
        <span className="sr-only">工程注释（{annotation.term}）</span>
      </button>

      {open && (
        <div
          ref={ref}
          className="absolute left-0 top-full z-50 mt-1.5 w-[18rem] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3.5 shadow-industrial-lg"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-industrial-cyan/10 px-2 py-0.5 text-[10px] font-medium text-industrial-cyan">
              工程注释 · <span className="font-semibold">{annotation.sourceLabel}</span>
            </span>
          </div>
          <p className="mt-2 text-sm font-bold text-slate-800">{annotation.title}</p>
          {annotation.body && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {annotation.body}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-[10px] text-slate-400">
              工程解释 · 语义派生 · 来自既有已发布内容（非独立实体）
            </span>
            {annotation.href && (
              <Link
                href={annotation.href}
                onClick={() => setOpen(false)}
                className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-industrial-cyan hover:underline"
              >
                查看
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </span>
  );
}