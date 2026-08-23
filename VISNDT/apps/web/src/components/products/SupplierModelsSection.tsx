'use client';

import { useState } from 'react';
import type { CapabilitySupplierProductWithOffers } from '@/types/capability';
import CapabilitySection from '@/components/capability/CapabilitySection';
import EmptyState from '@/components/common/EmptyState';
import InquiryForm from '@/components/inquiry/InquiryForm';
import SupplierCompareBar from './SupplierCompareBar';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

/**
 * SupplierModelsSection — M28.0 Public Discovery View.
 *
 * Renders the published Supplier Models (SupplierProduct) for a Platform Product
 * together with each model's commercial availability and a Buyer Inquiry entry.
 * Only PUBLISHED models are exposed (backend-enforced); the backend supplies no
 * governance data (Draft / Review status / Rejected reason) — this section never
 * renders those.
 *
 * Inquiry flow (M28.0): Published SupplierProduct → Buyer Interest → Inquiry Form,
 * carrying supplierProductId + platformProductId, then the existing RFQ workflow
 * is reused unchanged. Never an Order / Payment.
 */

interface SupplierModelsSectionProps {
  /** Platform Product (Capability Authority) context */
  productId: string;
  productName: string;
  models: CapabilitySupplierProductWithOffers[];
}

/** Format a price band value for display. */
function formatPrice(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/** Max number of SupplierProducts the Buyer can select for comparison. */
const MAX_COMPARE = 7;

export default function SupplierModelsSection({
  productId,
  productName,
  models,
}: SupplierModelsSectionProps) {
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, MAX_COMPARE),
    );
  };

  const compareSelection = compareIds
    .map((id) => {
      const sp = models.find((m) => m.supplierProduct.id === id)?.supplierProduct;
      if (!sp) return null;
      const label = `${sp.brand ?? ''} ${sp.modelNumber ?? ''}`.trim();
      return { id, label };
    })
    .filter(Boolean) as { id: string; label: string }[];

  if (!models || models.length === 0) {
    return (
      <section id="supplier-models">
        <CapabilitySection
          eyebrow="Supplier Models"
          title="供应商型号"
          subtitle="已上架并通过审核的供应商型号"
        >
          <EmptyState
            icon="document"
            message="暂无已上架供应商型号"
            description="该平台产品尚未有已发布的供应商型号公开上架。"
          />
        </CapabilitySection>
      </section>
    );
  }

  return (
    <section id="supplier-models">
      <CapabilitySection
        eyebrow="Supplier Models"
        title="供应商型号"
        subtitle="已上架并通过审核（Approved Supplier Model）的公开供应商型号、商业可购与询价入口"
      >
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white">
          {models.map(({ supplierProduct, offers }) => {
            const { commercialSummary } = supplierProduct;
            const available = (commercialSummary?.activeOfferCount ?? 0) > 0;
            const priceFrom = commercialSummary
              ? formatPrice(commercialSummary.priceFrom)
              : null;
            const priceTo = commercialSummary
              ? formatPrice(commercialSummary.priceTo)
              : null;

            // Inquiry entry target: prefer an ACTIVE offer, else the first offer.
            const entryOffer =
              offers.find((o) => o.status === 'ACTIVE') ?? offers[0];
            const canInquire = Boolean(entryOffer && entryOffer.organizationId);
            const isOpen = openInquiryId === supplierProduct.id;

            const modelLabel =
              `${supplierProduct.brand ?? ''} ${supplierProduct.series ?? ''} ${supplierProduct.modelNumber ?? ''}`.trim();

            const handleInquiryToggle = () => {
              const next = isOpen ? null : supplierProduct.id;
              setOpenInquiryId(next);
              if (next) {
                trackEvent(
                  buildEvent('inquiry_start', {
                    source: 'supplier_models_section',
                    targetId: supplierProduct.id,
                    metadata: {
                      productId,
                      productName,
                      modelLabel,
                      organizationName: supplierProduct.organization?.name,
                    },
                  }),
                );
              }
            };

            return (
              <div key={supplierProduct.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {supplierProduct.brand && (
                        <span className="text-base font-semibold text-foreground">
                          {supplierProduct.brand}
                        </span>
                      )}
                      {supplierProduct.series && (
                        <span className="text-sm text-slate-500">
                          系列：{supplierProduct.series}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-mono mt-0.5">
                      型号：{supplierProduct.modelNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                        available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          available ? 'bg-green-500' : 'bg-slate-400'
                        }`}
                      />
                      {available ? '可询价' : '暂无可购'}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleCompare(supplierProduct.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        compareIds.includes(supplierProduct.id)
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'border border-slate-300 text-slate-600 hover:border-primary/40 hover:text-primary'
                      }`}
                      aria-pressed={compareIds.includes(supplierProduct.id)}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          compareIds.includes(supplierProduct.id)
                            ? 'border-white bg-white/20'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {compareIds.includes(supplierProduct.id) && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 5l2.2 2.2L8 2.5" />
                          </svg>
                        )}
                      </span>
                      {compareIds.includes(supplierProduct.id)
                        ? '已加入对比'
                        : '加入对比'}
                    </button>

                    {canInquire && (
                      <button
                        type="button"
                        onClick={handleInquiryToggle}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isOpen
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'border border-primary/30 text-primary hover:bg-primary/5'
                        }`}
                      >
                        {isOpen ? '收起咨询' : '咨询此型号'}
                      </button>
                    )}
                  </div>
                </div>

                {(supplierProduct.description ||
                  supplierProduct.technicalDescription) && (
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">
                    {supplierProduct.technicalDescription ||
                      supplierProduct.description}
                  </p>
                )}

                {offers.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      商业可购（Commercial Availability）
                    </p>
                    <ul className="space-y-1.5">
                      {offers.map((offer) => (
                        <li
                          key={offer.id}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <span className="text-slate-700 font-medium">
                            {offer.title || supplierProduct.brand}
                          </span>
                          {priceFrom !== null && (
                            <span className="text-slate-500">
                              {priceFrom}
                              {priceTo !== null && priceTo !== priceFrom
                                ? ` ~ ${priceTo}`
                                : ''}
                              {commercialSummary?.currency
                                ? ` ${commercialSummary.currency}`
                                : ''}
                            </span>
                          )}
                          {offer.status && (
                            <span className="text-xs text-slate-400">
                              {offer.status === 'ACTIVE'
                                ? '在售'
                                : offer.status}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Inquiry Entry — Buyer Interest bound to this specific Supplier Model */}
                {isOpen && canInquire && entryOffer && (
                  <div className="mt-5 rounded-lg border border-slate-200/80 bg-slate-50/60 p-4">
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-800">
                        咨询供应商型号
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>
                          <span className="text-slate-400">品牌：</span>
                          {supplierProduct.brand}
                        </span>
                        <span>
                          <span className="text-slate-400">型号：</span>
                          {supplierProduct.modelNumber}
                        </span>
                        <span>
                          <span className="text-slate-400">能力：</span>
                          {productName}
                        </span>
                      </div>
                    </div>

                    <InquiryForm
                      productId={productId}
                      productName={productName}
                      offerId={entryOffer.id}
                      organizationId={entryOffer.organizationId}
                      organizationName={supplierProduct.organization?.name}
                      supplierProductId={supplierProduct.id}
                      supplierModelLabel={modelLabel}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          勾选 2–7 个供应商型号，比较技术参数与商业信息（同一检测能力下）。
        </p>
      </CapabilitySection>

      {/* Fixed compare bar — Buyer's selected SupplierProducts (same capability) */}
      {compareSelection.length > 0 && (
        <SupplierCompareBar
          capabilityId={productId}
          capabilityName={productName}
          selected={compareSelection}
          onRemove={(id) => toggleCompare(id)}
          onClear={() => setCompareIds([])}
        />
      )}
    </section>
  );
}