import type { Content } from '@/types/content';
import RelatedContentSection from './RelatedContentSection';

interface RelatedSolutionsProps {
  items: Content[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

/**
 * RelatedSolutions — commercial cross-content relation block.
 *
 * Renders published SOLUTION content cards. Data is supplied deterministically
 * by the page (public Content API, type=SOLUTION, newest-first). ContentCard
 * routes to /solutions/[slug].
 */
export default function RelatedSolutions({
  items,
  viewAllHref = '/solutions',
  viewAllLabel = '更多解决方案',
  className,
}: RelatedSolutionsProps) {
  return (
    <div className={className}>
      <RelatedContentSection
        title="相关解决方案"
        subtitle="面向不同行业的工业检测技术方案"
        items={items}
        emptyMessage="暂无相关解决方案"
        emptyDescription="该主题暂未关联已发布的解决方案。"
        viewAllHref={viewAllHref}
        viewAllLabel={viewAllLabel}
      />
    </div>
  );
}