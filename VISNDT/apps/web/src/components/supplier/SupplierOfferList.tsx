import type { Offer } from '@/types/product';
import EmptyState from '@/components/common/EmptyState';
import Link from 'next/link';

interface SupplierOfferListProps {
  offers: Offer[];
}

/** Offer 状态中文映射 */
const offerStatusLabels: Record<string, string> = {
  DRAFT: '草稿',
  ACTIVE: '已发布',
  INACTIVE: '已下架',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

export default function SupplierOfferList({ offers }: SupplierOfferListProps) {
  if (offers.length === 0) {
    return (
      <EmptyState
        icon="package"
        message="暂无供应产品"
        description="该供应商暂未发布产品供应能力。"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => {
        const statusLabel =
          offerStatusLabels[offer.status] ?? offer.status;
        const isActive =
          offer.status === 'ACTIVE' || offer.status === 'SUBMITTED';

        return (
          <Link
            key={offer.id}
            href={`/products/${offer.productId}`}
            className="rounded-xl border border-slate-200/80 shadow-industrial-sm hover:shadow-industrial-md hover:-translate-y-1 transition-all duration-300 bg-white p-5 block group"
          >
            {/* Product Name */}
            <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
              {offer.title}
            </h3>

            {/* Offer Description */}
            {offer.description && (
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                {offer.description}
              </p>
            )}

            {/* Status Badge */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {statusLabel}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}