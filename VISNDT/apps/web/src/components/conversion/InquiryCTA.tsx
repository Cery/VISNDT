'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics/tracker';
import { buildEvent } from '@/lib/analytics/events';

interface InquiryCTAProps {
  /** Context source label for analytics, e.g. 'product', 'supplier' */
  contextType?: string;
  /** Target supplier / product name shown in copy */
  targetLabel?: string;
  /** Optional product id to anchor the inquiry (product detail supplier tab) */
  productId?: string;
  className?: string;
}

/**
 * InquiryCTA — commercial inquiry entry block.
 *
 * Leads the user from capability discovery toward a concrete inquiry on the
 * product detail supplier section (existing SupplierInquirySection flow) or the
 * supplier demand entry. Only existing inquiry / demand flows are reused — no
 * new API or route.
 */
export default function InquiryCTA({
  contextType = 'content',
  targetLabel,
  productId,
  className,
}: InquiryCTAProps) {
  const inquiryHref = productId
    ? `/products/${encodeURIComponent(productId)}#suppliers`
    : '/products';

  const handlePrimaryClick = () => {
    trackEvent(
      buildEvent('inquiry_start', {
        source: `inquiry_cta_${contextType}`,
        targetId: targetLabel,
        metadata: { label: '发起询价', target: inquiryHref },
      }),
    );
  };

  const handleDemandClick = () => {
    trackEvent(
      buildEvent('cta_click', {
        source: `inquiry_cta_${contextType}`,
        targetId: targetLabel,
        metadata: { label: '提交需求', target: '/workspace/demands/create' },
      }),
    );
  };

  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white/80 p-6 md:p-8 shadow-industrial-sm ${className ?? ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {targetLabel
              ? `向${targetLabel}发起询价`
              : '对相关检测方案感兴趣？'}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            查看具体产品的供应能力与报价，或直接提交需求进入匹配流程。
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
          <Link
            href={inquiryHref}
            onClick={handlePrimaryClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            发起询价
            <span className="text-xs">&rarr;</span>
          </Link>
          <Link
            href="/workspace/demands/create"
            onClick={handleDemandClick}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            提交需求
          </Link>
        </div>
      </div>
    </section>
  );
}