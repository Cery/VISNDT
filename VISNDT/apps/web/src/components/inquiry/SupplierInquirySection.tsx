'use client';

import { useState } from 'react';
import type { Offer } from '@/types/product';
import SupplierCapabilityList from '@/components/products/SupplierCapabilityList';
import InquiryForm from '@/components/inquiry/InquiryForm';

interface SupplierInquirySectionProps {
  productId: string;
  productName: string;
  offers: Offer[];
}

/**
 * Client component that manages Offer selection and Inquiry flow.
 * User must explicitly select an Offer before the InquiryForm is shown.
 * No auto-select of first Offer.
 *
 * Flow:
 *   SupplierCapabilityList (select Offer)
 *   → Selected Supplier Banner (confirm selection)
 *   → InquiryForm (submit inquiry with offerId + organizationId)
 */
export default function SupplierInquirySection({
  productId,
  productName,
  offers,
}: SupplierInquirySectionProps) {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleSelect = (offer: Offer) => {
    setSelectedOffer((prev) => (prev?.id === offer.id ? null : offer));
  };

  const activeOffers = offers.filter(
    (o) => o.status === 'ACTIVE' || o.status === 'SUBMITTED',
  );

  return (
    <div className="space-y-4">
      {/* Supplier Capability List */}
      <SupplierCapabilityList
        offers={activeOffers}
        selectedOfferId={selectedOffer?.id}
        onSelect={handleSelect}
      />

      {/* Selected Supplier Banner + Inquiry Form */}
      {selectedOffer && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm font-medium text-primary">
                询价对象：{selectedOffer.organization.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOffer(null)}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              切换供应商
            </button>
          </div>

          <InquiryForm
            productId={productId}
            productName={productName}
            offerId={selectedOffer.id}
            organizationId={selectedOffer.organizationId}
            organizationName={selectedOffer.organization.name}
          />
        </div>
      )}
    </div>
  );
}