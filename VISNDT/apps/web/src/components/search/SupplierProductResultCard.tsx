import Link from 'next/link';
import type { SupplierProductSearchResult } from '@/services/search.service';

/**
 * SupplierProduct result card — M28.0 M661.5 Unified Discovery Consolidation.
 *
 * Capability-centric projection (Product = Capability Authority). The card links
 * to the Capability Detail, which renders the published supplier models + Buyer
 * Inquiry entry. Search never creates RFQ / Order / Transaction here — it only
 * accelerates discovery into the existing capability detail → inquiry chain.
 */
function formatPrice(value?: number | null): string {
  if (value === null || value === undefined) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(0);
}

export default function SupplierProductResultCard({
  item,
}: {
  item: SupplierProductSearchResult;
}) {
  const { capability, supplierProduct, commercialSummary, inquiryAvailable } = item;
  const hasActiveOffer = commercialSummary.activeOfferCount > 0;
  const capabilityHref = `/products/${capability?.slug ?? capability?.id ?? ''}`;

  return (
    <article className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-5 transition-shadow hover:shadow-industrial-md bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={capabilityHref}
            className="text-base font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            {capability?.name ?? '能力型号'}
          </Link>
          <p className="mt-1 text-sm text-slate-700">
            {supplierProduct.brand}
            {supplierProduct.series ? ` ${supplierProduct.series}` : ''}{' '}
            {supplierProduct.modelNumber}
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          {hasActiveOffer ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
              可购
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-500">
              询价
            </span>
          )}
          {inquiryAvailable && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-sky-700">
              可询价
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
        <span>
          有效 Offer：<strong className="text-slate-700">{commercialSummary.activeOfferCount} 个</strong>
        </span>
        <span>
          价格：
          <strong className="text-slate-700">
            {commercialSummary.priceFrom !== null && commercialSummary.priceFrom !== undefined
              ? `${formatPrice(commercialSummary.priceFrom)} ~ ${formatPrice(commercialSummary.priceTo)} ${commercialSummary.currency ?? ''}`
              : '未定价'}
          </strong>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
          {supplierProduct.organization?.id && supplierProduct.organization.name && (
            <span title={supplierProduct.organization.name}>
              <span className="text-slate-500">能力提供商：</span>
              <Link
                href={`/suppliers/${supplierProduct.organization.id}`}
                className="text-slate-700 hover:text-primary transition-colors"
              >
                {supplierProduct.organization.name}
              </Link>
            </span>
          )}
          <span>
            <span className="text-slate-500">品牌：</span>
            <span className="text-slate-700">{supplierProduct.brand}</span>
          </span>
          {supplierProduct.series && (
            <span>
              <span className="text-slate-500">系列：</span>
              <span className="text-slate-700">{supplierProduct.series}</span>
            </span>
          )}
          <span>
            <span className="text-slate-500">型号：</span>
            <span className="text-slate-700">{supplierProduct.modelNumber}</span>
          </span>
        </div>
        <Link
          href={capabilityHref}
          className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
        >
          查看型号与询价
        </Link>
      </div>
    </article>
  );
}