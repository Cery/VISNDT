'use client';

import type { Offer } from '@/types/product';
import Link from 'next/link';

interface SupplierCapabilityListProps {
  offers: Offer[];
  selectedOfferId?: string;
  onSelect: (offer: Offer) => void;
}

/**
 * 供应商能力列表组件。
 * 展示产品的供应商 Offer 列表，支持选中/切换，无 Offer 时显示引导性空状态。
 */
export default function SupplierCapabilityList({
  offers,
  selectedOfferId,
  onSelect,
}: SupplierCapabilityListProps) {
  // === Empty State ===
  if (offers.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900 mb-1">
              暂无供应商
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              当前暂无供应商为此产品提供供应能力。如果您是该产品的供应商，请联系我们加入平台。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === Supplier List ===
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900">
          供应商能力
        </h3>
        {selectedOfferId && (
          <span className="text-xs text-primary font-medium">
            已选择供应商
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {selectedOfferId
          ? '选中供应商后即可填写询价表单。点击其他供应商可切换。'
          : '请选择一个供应商以发起询价。'}
      </p>

      <div className="space-y-2">
        {offers.map((offer) => {
          const isSelected = selectedOfferId === offer.id;
          const org = offer.organization;

          return (
            <button
              key={offer.id}
              type="button"
              onClick={() => onSelect(offer)}
              className={`w-full text-left rounded-lg border p-4 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Organization Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {org.name}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-slate-100 text-slate-500 font-medium flex-shrink-0">
                      {org.type}
                    </span>
                  </div>

                  {offer.title && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {offer.title}
                    </p>
                  )}

                  {isSelected && offer.description && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed border-t border-slate-100 pt-2">
                      {offer.description}
                    </p>
                  )}
                </div>

                {/* Status & Selection Indicator */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                      offer.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : offer.status === 'SUBMITTED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {offer.status === 'ACTIVE'
                      ? '可询价'
                      : offer.status === 'SUBMITTED'
                        ? '待审核'
                        : offer.status}
                  </span>

                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-primary flex-shrink-0"
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
                  )}
                </div>
              </div>

              {/* Supplier Profile Link */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/suppliers/${org.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  供应商主页
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}