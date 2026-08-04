'use client';

import InquiryForm from '@/components/inquiry/InquiryForm';

interface InquirySectionProps {
  productId: string;
  productName: string;
  offerId?: string | null;
  organizationId?: string | null;
}

/**
 * Renders InquiryForm if required data is available,
 * otherwise shows "Inquiry unavailable" message.
 */
export default function InquirySection({
  productId,
  productName,
  offerId,
  organizationId,
}: InquirySectionProps) {
  const canInquire = !!(productId && offerId && organizationId);

  if (!canInquire) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-sm text-slate-900 mb-2">
          询价功能暂不可用
        </h3>
        <p className="text-sm text-slate-500">
          此产品目前无法获取询价信息。请稍后再来查看或直接联系我们。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-6">
      <InquiryForm
        productId={productId}
        productName={productName}
        offerId={offerId}
        organizationId={organizationId}
      />
    </div>
  );
}