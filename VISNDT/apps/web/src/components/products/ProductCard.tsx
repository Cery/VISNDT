import Link from 'next/link';
import type { Product } from '@/types/product';
import { translateCategoryName } from '@/lib/translate';
import { getCategoryScenario, getParameterCapabilityHint } from '@/lib/capability-glossary';
import MediaImage from '@/components/common/MediaImage';
import CapabilityBadge from '@/components/capability/CapabilityBadge';
import ApplicationScenario from '@/components/capability/ApplicationScenario';
import HighlightText from './HighlightText';
import { PRODUCT_STATUS_LABEL } from '@/lib/display-labels';
import { stripGovernanceLabels } from '@/lib/display-text';
import { resolveStatusTone, TONE_TO_HEX } from '@visndt/design-tokens';

interface ProductCardProps {
  product: Product;
  /** Current search keyword for highlighting (frontend only) */
  searchKeyword?: string;
  /** Whether this product is selected for comparison */
  isCompared?: boolean;
  /** Compare toggle callback */
  onCompareToggle?: (id: string) => void;
  /** 已发布供应型号数 / 供应组织数（846 §10 Supplier Model Count；无数据可不传，不强制造数） */
  supplierModelCount?: number;
  supplierCount?: number;
}

/**
 * M33.2 — Industrial Capability Card（726 §13）
 * 内容优先、技术精确、dense-but-breathable、非电商。
 * 结构层级：Status/Category → Product Identity → Capability Summary
 *            → Key Technical Parameters → Primary Action → Secondary Metadata。
 * 仅展示层视觉重设计；Product 数据语义与来源完全不变。
 */
export default function ProductCard({
  product,
  searchKeyword,
  isCompared = false,
  onCompareToggle,
  supplierModelCount,
  supplierCount,
}: ProductCardProps) {
  const scenario = product.category ? getCategoryScenario(product.category.name) : null;
  const capabilityHints = Array.isArray(product.keyParameters)
    ? product.keyParameters
        .map((kp) => getParameterCapabilityHint(kp.name, kp.code))
        .filter((h): h is string => Boolean(h))
        .filter((h, i, arr) => arr.indexOf(h) === i)
        .slice(0, 2)
    : [];
  const statusTone = product.status ? resolveStatusTone(product.status) : null;
  const statusHex = statusTone ? TONE_TO_HEX[statusTone] : null;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-surface-1 transition-[border-color,box-shadow,transform] duration-300 hover:border-slate-300 hover:shadow-[var(--shadow-industrial-md)] focus-within:border-primary">
      {/* === Visual dock — 统一缩略媒体带（846 §10 / §28：h-16~20 = 64–80px，含无图 fallback）=== */}
      <Link
        href={`/products/${product.id}`}
        className="block relative h-16 md:h-20 shrink-0 overflow-hidden border-b border-slate-100 bg-surface-2"
        aria-label={product.name}
      >
        {product.primaryMedia?.fileAssetId ? (
          <MediaImage
            fileAssetId={product.primaryMedia.fileAssetId}
            alt={product.primaryMedia.title || product.name}
            seed={product.id}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-2 to-slate-100" aria-hidden="true">
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-300">
              {product.category ? translateCategoryName(product.category.name) : 'CAPABILITY'}
            </span>
          </div>
        )}

        {/* Compare toggle（保留既有业务交互） */}
        {onCompareToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle(product.id);
            }}
            aria-label={isCompared ? `取消对比 ${product.name}` : `对比 ${product.name}`}
            className={`
              absolute top-2 right-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${isCompared
                ? 'bg-primary border-primary text-white'
                : 'border-slate-300 hover:border-primary bg-white'
              }
            `}
          >
            {isCompared && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 5l2 2 4-4" />
              </svg>
            )}
          </button>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`} className="flex flex-col gap-2.5">
          {/* === Status / Category（顶部分类 + 状态）=== */}
          <div className="flex items-center justify-between gap-2">
            {product.category ? (
              <CapabilityBadge
                label={translateCategoryName(product.category.name)}
                tone="cyan"
                hint={scenario ?? undefined}
              />
            ) : (
              <span />
            )}
            {statusHex && product.status && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: statusHex }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: statusHex }}
                  aria-hidden="true"
                />
                {PRODUCT_STATUS_LABEL[product.status] ?? '未知状态'}
              </span>
            )}
          </div>

          {/* === Product Identity — 846 §60：名称剥离治理前缀 === */}
          <h3 className="text-[15px] leading-snug font-semibold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
            <HighlightText text={stripGovernanceLabels(product.name)} keyword={searchKeyword ?? ''} />
          </h3>
          {product.model && (
            <p className="font-mono text-xs text-muted-foreground -mt-1">
              型号：<HighlightText text={product.model} keyword={searchKeyword ?? ''} />
            </p>
          )}

          {/* === Capability Summary === */}
          {scenario && <ApplicationScenario categoryName={product.category?.name} compact />}
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              <HighlightText text={stripGovernanceLabels(product.description)} keyword={searchKeyword ?? ''} />
            </p>
          )}
        </Link>

        {/* === Key Technical Parameters（TG-05 Data Numeric Emphasis：mono 技术数字）=== */}
        {Array.isArray(product.keyParameters) && product.keyParameters.length > 0 && (
          <div className="mt-3 flex flex-col vds-space-y-1 rounded-lg border border-slate-200 bg-surface-2 px-3 py-2">
            {product.keyParameters.slice(0, 3).map((kp) => (
              <div
                key={kp.parameterDefinitionId}
                className="flex items-baseline justify-between gap-2 text-xs"
              >
                <span className="text-muted-foreground shrink-0 truncate">{kp.name}</span>
                <span className="font-mono font-medium text-slate-800 text-right tabular-nums shrink-0 max-w-[55%] truncate">
                  {kp.value}
                  {kp.unit ? <span className="text-slate-400 ml-0.5 font-sans">{kp.unit}</span> : null}
                </span>
              </div>
            ))}
            {product.keyParameters.length > 3 && (
              <div className="text-[11px] text-slate-400 text-right">
                等 {product.keyParameters.length} 项参数
              </div>
            )}
          </div>
        )}

        {/* Capability tags */}
        {capabilityHints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {capabilityHints.map((h) => (
              <CapabilityBadge key={h} label={h} tone="primary" />
            ))}
          </div>
        )}

        {/* === Primary Action + Secondary Metadata === */}
        <div className="mt-auto pt-3">
          <Link
            href={`/products/${product.id}#specifications`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
              <path d="M2 4.5C2 3.67 2.67 3 3.5 3h5c.83 0 1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5v-3z" />
              <path d="M4 6h4M4 8h2" />
            </svg>
            查看能力详情
          </Link>
          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            {/* 846 §10 — Supplier Model Count（仅当数据可用时显示，不强制造数） */}
            <span>
              {typeof supplierModelCount === 'number'
                ? `${supplierModelCount} 个型号${typeof supplierCount === 'number' ? ` · ${supplierCount} 个供应商` : ''}`
                : product.category
                  ? `${translateCategoryName(product.category?.name)} 检测能力`
                  : '未分类能力'}
            </span>
            <Link href={`/products/${product.id}#specifications`} className="hover:text-primary transition-colors whitespace-nowrap">
              技术规格 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}