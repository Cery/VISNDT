'use client';

import { useState } from 'react';
import type { CapabilitySupplierProduct } from '@/types/capability';
import CapabilitySection from '@/components/capability/CapabilitySection';
import EmptyState from '@/components/common/EmptyState';
import SupplierCompareBar from './SupplierCompareBar';

/**
 * SupplierModelsSection — M28.0 Public Discovery View.
 *
 * Renders the published Supplier Models (SupplierProduct) for a Platform Product
 * as model identity + compare entry. Only PUBLISHED models are exposed
 * (backend-enforced). This is a NON-COMMERCIAL public view (P2 frozen):
 *   - no price / currency / offer-count / commercial summary
 *   - no Offer payload
 * Offer remains commercial/private and is reachable only through the existing
 * private inquiry → RFQ workflow, never from this public discovery surface.
 */

interface SupplierModelsSectionProps {
  /** Platform Product (Capability Authority) context */
  productId: string;
  productName: string;
  models: CapabilitySupplierProduct[];
}

/** Max number of SupplierProducts the Buyer can select for comparison. */
const MAX_COMPARE = 7;

export default function SupplierModelsSection({
  productId,
  productName,
  models,
}: SupplierModelsSectionProps) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(0, MAX_COMPARE),
    );
  };

  const compareSelection = compareIds
    .map((id) => {
      const sp = models.find((m) => m.id === id);
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
          title="能力型号"
          subtitle="已上架并通过审核的能力型号"
        >
          <EmptyState
            icon="document"
            message="暂无已上架能力型号"
            description="该平台产品尚未有已发布的能力型号公开上架。"
          />
        </CapabilitySection>
      </section>
    );
  }

  return (
    <section id="supplier-models">
      <CapabilitySection
        eyebrow="Supplier Models"
        title="能力型号"
        subtitle="已上架并通过审核（Approved Supplier Model）的公开能力型号"
      >
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white">
          {models.map((supplierProduct) => {
            const modelLabel =
              `${supplierProduct.brand ?? ''} ${supplierProduct.series ?? ''} ${supplierProduct.modelNumber ?? ''}`.trim();

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

                  <div className="flex items-center gap-2 shrink-0">
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
                  </div>
                </div>

                {(supplierProduct.description ||
                  supplierProduct.technicalDescription) && (
                  <p className="text-sm text-slate-500 leading-relaxed mt-2">
                    {supplierProduct.technicalDescription ||
                      supplierProduct.description}
                  </p>
                )}

                {/* P2 — commercial/inquiry entry (offer-derived) removed from this
                    public model context. Offer stays commercial/private (frozen). */}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          勾选 2–7 个能力型号，比较技术参数与规格（同一检测能力下）。
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