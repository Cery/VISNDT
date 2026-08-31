import Link from 'next/link';
import type { Content } from '@/types/content';

const TYPE_HREF: Record<string, (slug: string) => string> = {
  ARTICLE: (slug) => `/articles/${slug}`,
  KNOWLEDGE: (slug) => `/knowledge/${slug}`,
  SOLUTION: (slug) => `/solutions/${slug}`,
  INSIGHT: (slug) => `/insights/${slug}`,
};

function formatDate(value?: string | null): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface ContentCardProps {
  item: Content;
}

export default function ContentCard({ item }: ContentCardProps) {
  const href = (TYPE_HREF[item.type] ?? TYPE_HREF.KNOWLEDGE)(item.slug);
  const tags = item.tags?.map((t) => t.tag).filter(Boolean) ?? [];

  return (
    <Link
      href={href}
      className="group relative rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white overflow-hidden hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Industrial accent edge — structural top rail */}
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-industrial-cyan via-primary to-industrial-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" aria-hidden="true" />

      {/* Cover Image */}
      {item.coverImage && (
        <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
          <img
            src={`/api/assets/${item.coverImage.id}/file`}
            alt={item.coverImage.fileName ?? item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      {/* Body */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Type marker row — mono technical classification (real type code) */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest">
            <span className="h-3 w-1 rounded-sm bg-industrial-cyan" aria-hidden="true" />
            <span className="text-slate-400">TYPE</span>
            <span className="text-slate-300">/</span>
            <span className="text-primary font-semibold">{item.type}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 text-base">
          {item.title}
        </h3>

        {/* Summary */}
        {item.summary && (
          <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 flex-1">
            {item.summary}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600"
              >
                #{tag.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer — mono technical metadata + document action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="font-mono text-[11px] text-slate-400 tabular-nums">
            {item.publishedAt
              ? formatDate(item.publishedAt)
              : formatDate(item.updatedAt)}
          </span>
          {item.author?.name && (
            <span className="font-mono text-[11px] text-slate-400">
              <span className="text-slate-500">AUTHOR</span>
              <span className="mx-1.5 text-slate-300">/</span>
              {item.author.name}
            </span>
          )}
        </div>
        <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors">
          VIEW DOC
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}