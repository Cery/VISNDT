import Link from 'next/link';
import type { Organization } from '@/types/organization';
import type { Offer } from '@/types/product';
import EmptyState from '@/components/common/EmptyState';
import DemandCTA from '@/components/conversion/DemandCTA';
import { stripGovernanceLabels } from '@/lib/display-text';

/** Supplier type Chinese mapping (mirrors SupplierPublicProfile)
 * 统一供应商语义：「供应商」不下钻猜测制造商/贸易商（organization.type 仅有 ADMIN/SUPPLIER）。 */
const typeLabels: Record<string, string> = {
  SUPPLIER: '供应商',
  ADMIN: '管理方',
  manufacturer: '供应商',
  distributor: '供应商',
  agent: '供应商',
  'service-provider': '供应商',
  integrator: '供应商',
  'testing-organization': '供应商',
  other: '供应商',
};

interface SupplierCapabilityProps {
  organization: Organization;
  offers: Offer[];
}

/** Offer 状态中文映射（事实性状态，非模糊推断） */
const offerStatusLabels: Record<string, string> = {
  DRAFT: '草稿',
  ACTIVE: '已发布',
  INACTIVE: '已下架',
  SUBMITTED: '已提交',
  ACCEPTED: '已接受',
  REJECTED: '已拒绝',
  WITHDRAWN: '已撤回',
};

/**
 * SupplierCapability — commercial capability profile foundation for
 * /suppliers/[id].
 *
 * Presents a factual capability snapshot derived only from the supplied
 * Organization + Offer records (role type, published capacity count), the
 * associated product capabilities (offers → product detail), and a commercial
 * inquiry / demand entry. No store-front / marketplace semantics, no new API.
 */
export default function SupplierCapability({
  organization,
  offers,
}: SupplierCapabilityProps) {
  const typeLabel = typeLabels[organization.type] ?? '供应商';
  const activeOffers = offers.filter(
    (o) => o.status === 'ACTIVE' || o.status === 'SUBMITTED',
  );
  const publishedOffers =
    offers.filter((o) => o.status === 'ACTIVE').length || activeOffers.length || offers.length;

  // Dedupe offers by product to present distinct related capabilities
  const seen = new Set<string>();
  const relatedCaps = offers.filter((o) => {
    if (seen.has(o.productId)) return false;
    seen.add(o.productId);
    return true;
  });

  return (
    <section className="mb-8">
      <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-0">
          <h2 className="text-2xl font-extrabold text-foreground">供应商能力画像</h2>
          <p className="text-sm text-slate-500 mt-1">
            基于 {organization.name} 已发布的供应能力与产品信息形成的能力档案。
          </p>
        </div>

        {/* Capability snapshot tags */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              角色 · {typeLabel}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              供应能力 · {publishedOffers} 项
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
              已发布 · {activeOffers.length} 项在售
            </span>
          </div>

          {/* Related product capabilities (derived from offers) */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">相关产品能力</h3>
            {relatedCaps.length === 0 ? (
              <EmptyState
                icon="package"
                message="暂无相关供应能力"
                description="该供应商暂未发布已关联的产品能力。"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                {relatedCaps.map((offer) => (
                  <Link
                    key={offer.id}
                    href={`/products/${offer.productId}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/60 px-4 py-3 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <div className="min-w-0">
                      {/* 846 §60：剥离治理前缀，禁止测试治理标签进普通视图 */}
                      <p className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors truncate">
                        {stripGovernanceLabels(offer.title)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {offerStatusLabels[offer.status] ?? '未知状态'}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">&rarr;</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Commercial inquiry entry */}
          <DemandCTA
            contextType="supplier"
            targetLabel={organization.name}
          />
        </div>
      </div>
    </section>
  );
}