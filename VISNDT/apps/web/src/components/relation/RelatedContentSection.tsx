import type { Content } from '@/types/content';
import ContentCard from '@/components/content/ContentCard';
import EmptyState from '@/components/common/EmptyState';
import Link from 'next/link';

interface RelatedContentSectionProps {
  /** Section title (e.g. 相关解决方案 / 相关知识) */
  title: string;
  /** Optional subtitle under the title */
  subtitle?: string;
  /** Published content items to render as cards */
  items: Content[];
  /** Empty-state message */
  emptyMessage?: string;
  /** Empty-state hint */
  emptyDescription?: string;
  /** Optional "view all" link (journey continuation) */
  viewAllHref?: string;
  viewAllLabel?: string;
}

/**
 * RelatedContentSection — reusable "related content feed" presentational section.
 *
 * Renders published Content cards (ContentCard already routes by type: SOLUTION
 * → /solutions/[slug], KNOWLEDGE → /knowledge/[slug], etc.). Data must be
 * supplied deterministically by the page (e.g. latest published feed via the
 * existing public Content API). No AI / keyword matching is performed here.
 */
export default function RelatedContentSection({
  title,
  subtitle,
  items,
  emptyMessage = '暂无相关内容',
  emptyDescription = '相关内容正在筹备中，敬请期待。',
  viewAllHref,
  viewAllLabel = '查看全部',
}: RelatedContentSectionProps) {
  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && items.length > 0 && (
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors shrink-0"
          >
            {viewAllLabel}
            <span className="text-xs">&rarr;</span>
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="document"
          message={emptyMessage}
          description={emptyDescription}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}