import Link from 'next/link';
import type { SupplierSearchResult } from '@/services/search.service';

/**
 * Supplier result card — 758 M34.5 Supplier Discovery Surface.
 *
 * Supplier = Organization(type=SUPPLIER) semantic role aggregated from PUBLISHED
 * SupplierProduct (source: PUBLISHED_SUPPLIER_PRODUCT_ORGANIZATION). Not a store
 * or marketplace seller. The card links to the Public Supplier profile. Supplier
 * discovery never creates Offer / RFQ / Transaction here — it only continues the
 * discovery chain Discovery → Supplier → Published SupplyProduct → Product.
 */
export default function SupplierResultCard({
  item,
}: {
  item: SupplierSearchResult;
}) {
  const supplierHref = `/suppliers/${item.organizationId}`;

  return (
    <article className="rounded-xl border border-slate-200/80 shadow-industrial-sm p-5 transition-shadow hover:shadow-industrial-md bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={supplierHref}
            className="text-base font-semibold text-slate-900 hover:text-primary transition-colors"
          >
            {item.organizationName}
          </Link>
          <p className="mt-1 text-xs text-slate-400 truncate">
            Capability Provider · Organization(type=SUPPLIER)
          </p>
        </div>

        <span className="inline-flex items-center flex-shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
          {item.publishedSupplyProductCount} 个已发布产品型号
        </span>
      </div>

      {item.productNames.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.productNames.slice(0, 6).map((name) => (
            <span
              key={name}
              className="inline-flex items-center text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
            >
              {name}
            </span>
          ))}
          {item.productNames.length > 6 && (
            <span className="inline-flex items-center text-[11px] text-slate-400 px-1">
              +{item.productNames.length - 6} 项能力
            </span>
          )}
        </div>
      )}

      {item.seriesValues.length > 0 && (
        <div className="mt-3 text-[11px] text-slate-400">
          供应系列：
          <span className="text-slate-500">{item.seriesValues.slice(0, 4).join(' · ')}</span>
          {item.seriesValues.length > 4 && <span> 等</span>}
        </div>
      )}
    </article>
  );
}