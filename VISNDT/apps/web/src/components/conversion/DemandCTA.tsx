'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

interface DemandCTAProps {
  /** Context source label for analytics, e.g. 'product', 'solution', 'knowledge', 'supplier' */
  contextType?: string;
  /** Optional target entity name shown in the CTA copy */
  targetLabel?: string;
  /** Optional specific product / category id appended to the demand entry */
  productId?: string;
  className?: string;
}

/**
 * DemandCTA — commercial conversion block that moves the user from content
 * discovery toward submitting a procurement Demand.
 *
 * Business journey: Content/Solution/Product/Supplier → Demand → Matching.
 * Primary action leads to the Demand creation entry (BUYER workspace); the page
 * is auth-guarded and redirects unauthenticated users to login.
 *
 * Only existing demand flow is reused — no new API or route.
 */
export default function DemandCTA({
  contextType = 'content',
  targetLabel,
  productId,
  className,
}: DemandCTAProps) {
  const demandHref = productId
    ? `/workspace/demands/create?productId=${encodeURIComponent(productId)}`
    : '/workspace/demands/create';

  const handlePrimaryClick = () => {
    trackEvent(
      buildEvent('cta_click', {
        source: `demand_cta_${contextType}`,
        targetId: targetLabel,
        metadata: { label: '提交采购需求', target: demandHref },
      }),
    );
  };

  const handleSecondaryClick = () => {
    trackEvent(
      buildEvent('cta_click', {
        source: `demand_cta_${contextType}`,
        targetId: targetLabel,
        metadata: { label: '浏览产品目录', target: '/products' },
      }),
    );
  };

  return (
    <section
      className={`rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/[0.03] p-6 md:p-8 ${className ?? ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {targetLabel
              ? `针对${targetLabel}提交采购需求`
              : '提交您的检测设备需求'}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            我们将依据您的检测参数与工业场景，确定性匹配并撮合具备相应能力的产品与供应商。
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
          <Link
            href={demandHref}
            onClick={handlePrimaryClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            提交采购需求
            <span className="text-xs">&rarr;</span>
          </Link>
          <Link
            href="/products"
            onClick={handleSecondaryClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
          >
            浏览产品目录
          </Link>
        </div>
      </div>
    </section>
  );
}