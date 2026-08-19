import Link from 'next/link';
import type { RelatedKnowledgeItem } from '@/types/knowledge-base';

interface RelatedKnowledgeProps {
  items: RelatedKnowledgeItem[];
}

/**
 * Product Detail "相关知识" section (M24.1.6).
 *
 * Renders related published knowledge resolved deterministically via
 * ProductCategory → ProductCategoryKnowledgeMapping → KnowledgeCategory
 * → KnowledgeEntry. Each card links to the existing Knowledge Detail route
 * (/knowledge-base/[slug]); no second route is created.
 */
export default function RelatedKnowledge({ items }: RelatedKnowledgeProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-8 text-center">
        <p className="text-sm text-slate-500">暂无相关知识</p>
        <p className="text-xs text-slate-400 mt-1">
          该产品所属分类暂未关联已发布的知识内容。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/knowledge-base/${item.slug}`}
          className="group rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {item.domain && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                {item.domain.name}
              </span>
            )}
            {item.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                {item.category.name}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>
          {item.summary && (
            <p className="text-xs text-slate-500 line-clamp-2">{item.summary}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-auto">
            了解更多
            <span className="text-xs">&rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  );
}