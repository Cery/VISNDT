import Link from 'next/link';
import type { Content } from '@/types/content';

const TYPE_BADGE: Record<string, { label: string; color: string }> = {
  ARTICLE: { label: '文章', color: 'bg-blue-100 text-blue-700' },
  KNOWLEDGE: { label: '知识', color: 'bg-indigo-100 text-indigo-700' },
  SOLUTION: { label: '解决方案', color: 'bg-emerald-100 text-emerald-700' },
  INSIGHT: { label: '洞察', color: 'bg-amber-100 text-amber-700' },
};

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
  const badge = TYPE_BADGE[item.type];
  const href = (TYPE_HREF[item.type] ?? TYPE_HREF.KNOWLEDGE)(item.slug);
  const tags = item.tags?.map((t) => t.tag).filter(Boolean) ?? [];

  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white overflow-hidden hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
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
        {/* Type Badge + Estimated Read Time */}
        <div className="flex items-center gap-2 mb-3">
          {badge && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          )}
          {item.estimatedReadTime && (
            <span className="text-xs text-slate-400">
              {item.estimatedReadTime} 分钟阅读
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
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
                className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600"
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {item.publishedAt
              ? formatDate(item.publishedAt)
              : formatDate(item.updatedAt)}
          </span>
          {item.author?.name && (
            <span className="text-xs text-slate-400">{item.author.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
}