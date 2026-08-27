import Link from 'next/link';
import type { Product } from '@/types/product';
import { highlightText } from '@/lib/search-utils';
import { translateCategoryName } from '@/lib/translate';
import MediaImage from '@/components/common/MediaImage';
import CapabilityBadge from '@/components/capability/CapabilityBadge';

interface ProductResultCardProps {
  product: Product;
  /** Keyword to highlight in name/description */
  highlight?: string;
}

/**
 * 703_M29.3 — Product Capability Result Card.
 *
 * Presents a Product as a "检测能力" (inspection capability) rather than a
 * generic content item: capability identity → name → model → capability summary
 * → detection category → CTA. Only uses data already present in the search
 * result (name / model / description / category); no fabricated key parameters
 * or application scenarios.
 */
export default function ProductResultCard({ product, highlight }: ProductResultCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl border border-slate-200/80 bg-white shadow-industrial-sm p-5 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Capability discovery thumbnail — unified MediaImage fallback */}
        <MediaImage
          fileAssetId={product.primaryMedia?.fileAssetId}
          alt={product.primaryMedia?.title || product.name}
          seed={product.id}
          className="w-24 h-24 rounded-lg object-cover bg-muted flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Capability identity */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[11px] font-semibold tracking-wide">
            检测能力
          </span>

          <h3 className="font-semibold text-foreground mt-1.5 mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {highlight ? highlightText(product.name, highlight) : product.name}
          </h3>

          {product.model && (
            <span className="inline-block text-xs font-mono text-slate-500 bg-slate-100 rounded px-2 py-0.5 mb-2">
              型号 {product.model}
            </span>
          )}

          {product.description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">
              {highlight
                ? highlightText(product.description, highlight)
                : product.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs text-slate-400 min-w-0">
              {product.category && (
                <CapabilityBadge
                  label={translateCategoryName(product.category.name)}
                  tone="cyan"
                />
              )}
              <span className="truncate">{product.status}</span>
            </div>

            {/* CTA affordance */}
            <span className="inline-flex flex-shrink-0 items-center gap-1 text-xs font-medium text-primary">
              查看能力
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