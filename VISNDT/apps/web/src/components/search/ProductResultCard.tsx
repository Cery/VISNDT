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

export default function ProductResultCard({ product, highlight }: ProductResultCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="block rounded-xl border border-slate-200/80 shadow-industrial-sm p-5 hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 group"
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
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {highlight ? highlightText(product.name, highlight) : product.name}
          </h3>
          {product.model && (
            <span className="inline-block text-xs font-mono text-slate-500 bg-slate-100 rounded px-2 py-0.5 mb-2">
              {product.model}
            </span>
          )}
          {product.description && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-2">
              {highlight
                ? highlightText(product.description, highlight)
                : product.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {product.category && (
              <CapabilityBadge
                label={translateCategoryName(product.category.name)}
                tone="cyan"
              />
            )}
            <span>{product.status}</span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex-shrink-0 text-slate-300 group-hover:text-primary transition-colors pt-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}