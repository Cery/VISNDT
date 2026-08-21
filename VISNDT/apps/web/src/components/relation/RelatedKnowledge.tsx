import type { Content } from '@/types/content';
import RelatedContentSection from './RelatedContentSection';

interface RelatedKnowledgeProps {
  items: Content[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

/**
 * RelatedKnowledge — commercial cross-content relation block.
 *
 * Renders published KNOWLEDGE content cards. Data is supplied deterministically
 * by the page (public Content API, type=KNOWLEDGE, newest-first). ContentCard
 * routes to /knowledge/[slug].
 */
export default function RelatedKnowledge({
  items,
  viewAllHref = '/knowledge',
  viewAllLabel = '更多技术知识',
  className,
}: RelatedKnowledgeProps) {
  return (
    <div className={className}>
      <RelatedContentSection
        title="相关知识"
        subtitle="检测原理、应用与最佳实践"
        items={items}
        emptyMessage="暂无相关知识"
        emptyDescription="该主题暂未关联已发布的技术知识。"
        viewAllHref={viewAllHref}
        viewAllLabel={viewAllLabel}
      />
    </div>
  );
}