import type { Organization } from '@/types/organization';
import type { Offer } from '@/types/product';
import Link from 'next/link';

interface ManufacturerInfoProps {
  /** 可选：直接传入 organization */
  organization?: Organization | null;
  /** 可选：从 offers 中推导制造商信息（取第一个有效 offer 的 organization） */
  offers?: Offer[];
  productName: string;
}

/**
 * 制造商信息展示组件。
 * 优先使用 organization prop，其次从 offers 中推导（取第一个 ACTIVE/SUBMITTED offer 的 organization）。
 */
export default function ManufacturerInfo({
  organization,
  offers,
  productName,
}: ManufacturerInfoProps) {
  // 从 offers 推导制造商（取第一个有效 offer 的 organization）
  const derivedOrg =
    organization ??
    offers?.find((o) => o.status === 'ACTIVE' || o.status === 'SUBMITTED')?.organization ??
    null;

  if (!derivedOrg) {
    return (
      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-sm text-slate-900 mb-2">制造商信息</h3>
        <p className="text-sm text-slate-500">
          此产品的制造商信息暂未公开。请使用下方供应商列表选择供应商并发起询价。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <h3 className="font-semibold text-sm text-slate-900 mb-3">制造商信息</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">公司</span>
          <span className="font-medium text-slate-900">{derivedOrg.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">类型</span>
          <span className="font-medium text-slate-700">{derivedOrg.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">状态</span>
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            {derivedOrg.status === 'ACTIVE' ? '活跃' : derivedOrg.status}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100">
        <Link
          href={`/suppliers/${derivedOrg.id}`}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          查看供应商详情
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}