import Link from 'next/link';
import type { Product } from '@/types/product';
import type { ParameterFacet } from '@/lib/api/search';
import { highlightText } from '@/lib/search-utils';
import { translateCategoryName } from '@/lib/translate';
import { stripGovernanceLabels } from '@/lib/display-text';
import MediaImage from '@/components/common/MediaImage';
import CapabilityBadge from '@/components/capability/CapabilityBadge';
import RelevantParameters from '@/components/search/RelevantParameters';

interface ProductResultCardProps {
  product: Product;
  /** Keyword to highlight in name/description */
  highlight?: string;
  /** M36 — query-level relevant technical parameters (engineering relevance) */
  relevantParams?: ParameterFacet[];
  /** M36 — parameterId → selected values (active technical filters) */
  activeParamFilters?: Record<string, string[]>;
  /** 已发布供应型号数（846 §10/§19 — 可用时显示） */
  supplierModelCount?: number;
}

/**
 * 703_M29.3 — Product Capability Result Card（846 §19 Product Result）。
 * 结构：IMAGE → MODEL·型号 → 名称 → 关键技术参数 → 型号数 → [查看详情]。
 * 等高、紧凑；描述剥离治理标签；不使用装饰性大图块。
 */
export default function ProductResultCard({
  product,
  highlight,
  relevantParams,
  activeParamFilters,
  supplierModelCount,
}: ProductResultCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-industrial-sm p-4 hover:shadow-industrial-md hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        {/* 846 §10 — Image（compact thumbnail，等高防变形） */}
        <MediaImage
          fileAssetId={product.primaryMedia?.fileAssetId}
          alt={product.primaryMedia?.title || product.name}
          seed={product.id}
          className="w-20 h-20 rounded-lg object-cover bg-muted flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Capability identity — 846 §19: MODEL·型号 */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[11px] font-semibold tracking-wide">
            检测能力
          </span>

          <h3 className="font-semibold text-foreground mt-1.5 mb-0.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {/* 846 §60：名称剥离治理前缀 */}
            {highlight ? highlightText(stripGovernanceLabels(product.name), highlight) : stripGovernanceLabels(product.name)}
          </h3>

          {product.model && (
            <span className="inline-block text-xs font-mono text-slate-500 bg-slate-100 rounded px-2 py-0.5 mb-1.5">
              型号 {product.model}
            </span>
          )}
        </div>
      </div>

      {product.description && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-1 mt-3">
          {highlight
            ? highlightText(stripGovernanceLabels(product.description), highlight)
            : stripGovernanceLabels(product.description)}
        </p>
      )}

      {/* M36 Engineering Discovery — surface relevant technical parameters */}
      {relevantParams && relevantParams.length > 0 && (
        <div className="mt-3 min-w-0">
          <RelevantParameters params={relevantParams} activeFilters={activeParamFilters} limit={2} valuesLimit={1} />
        </div>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 min-w-0">
          {product.category && (
            <CapabilityBadge
              label={translateCategoryName(product.category.name)}
              tone="cyan"
            />
          )}
          {/* 846 §19 — Supplier Model Count（可用时显示） */}
          {typeof supplierModelCount === 'number' && supplierModelCount > 0 && (
            <span className="text-slate-400">{supplierModelCount} 个供应型号</span>
          )}
        </div>

        {/* CTA affordance */}
        <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-medium text-primary">
          查看详情
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
    </Link>
  );
}