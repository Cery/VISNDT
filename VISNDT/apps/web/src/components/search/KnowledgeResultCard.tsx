import Link from 'next/link';
import type { Content } from '@/types/content';
import { highlightText, formatDate } from '@/lib/search-utils';

interface KnowledgeResultCardProps {
  content: Content;
  highlight?: string;
}

export default function KnowledgeResultCard({ content, highlight }: KnowledgeResultCardProps) {
  return (
    <Link
      href={`/knowledge/${content.slug}`}
      className="block rounded-xl border border-slate-200/80 shadow-industrial-sm p-5 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
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
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-medium">
              知识
            </span>
            {content.publishedAt && (
              <span>发布于 {formatDate(content.publishedAt)}</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-slate-300 group-hover:text-primary transition-colors pt-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}