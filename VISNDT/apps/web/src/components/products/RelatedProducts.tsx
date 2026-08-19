import Link from 'next/link';
import type { RelatedProductItem } from '@/types/knowledge-base';
import { translateCategoryName } from '@/lib/translate';

interface RelatedProductsProps {
  items: RelatedProductItem[];
}

/**
 * Knowledge Detail "相关产品" section (M24.1.7).
 *
 * Renders related active products resolved deterministically via
 * KnowledgeCategory → ProductCategoryKnowledgeMapping → ProductCategory
 * → Product (status ACTIVE). Each card links to the existing Product Detail
 * route (/products/[id]); no second route is created.
 */
export default function RelatedProducts({ items }: RelatedProductsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-8 text-center">
        <p className="text-sm text-slate-500">暂无相关产品</p>
        <p className="text-xs text-slate-400 mt-1">
          该知识分类暂未关联可用的产品能力。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.id}`}
          className="group rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {item.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                {translateCategoryName(item.category.name)}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
            {item.name}
          </h3>
          {item.model && (
            <p className="font-mono text-xs text-slate-500 line-clamp-1">型号：{item.model}</p>
          )}
          {item.description && (
            <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mt-auto">
            查看产品
            <span className="text-xs">&rarr;</span>
          </span>
        </Link>
      ))}
    </div>
  );
}