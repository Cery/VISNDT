import Link from 'next/link';
import type { Content } from '@/types/content';
import { highlightText } from '@/lib/search-utils';

interface SolutionResultCardProps {
  content: Content;
  highlight?: string;
}

/**
 * 703_M29.3 — Solution Result Card (elevated to 检测方案).
 *
 * A Solution is a first-class detection capability artifact, not generic
 * content. Optionally surfaces deterministic application context tags
 * (APPLICATION / INDUSTRY / TECHNOLOGY) already present in the unified search
 * response — no AI generation, no fabricated "recommended" claims.
 */
export default function SolutionResultCard({ content, highlight }: SolutionResultCardProps) {
  const contextTags = (content.tags ?? [])
    .map((t) => t.tag)
    .filter(
      (t) =>
        t.type === 'APPLICATION' || t.type === 'INDUSTRY' || t.type === 'TECHNOLOGY',
    )
    .slice(0, 3);

  return (
    <Link
      href={`/solutions/${content.slug}`}
      className="group block rounded-xl border border-slate-200/80 bg-white shadow-industrial-sm p-5 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold">
              检测方案
            </span>
            {content.estimatedReadTime != null && (
              <span className="text-[11px] text-slate-400">
                {content.estimatedReadTime} 分钟阅读
              </span>
            )}
          </div>

          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {highlight ? highlightText(content.title, highlight) : content.title}
          </h3>
          {content.summary && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-2">
              {highlight
                ? highlightText(content.summary, highlight)
                : content.summary}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 min-w-0">
              {contextTags.length > 0 && (
                <>
                  <span className="text-slate-400">适用：</span>
                  {contextTags.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px]"
                    >
                      {t.name}
                    </span>
                  ))}
                </>
              )}
              {content.publishedAt && (
                <span className="text-slate-400">
                  发布于 {content.publishedAt.slice(0, 10)}
                </span>
              )}
            </div>

            <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-medium text-primary">
              查看方案
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}