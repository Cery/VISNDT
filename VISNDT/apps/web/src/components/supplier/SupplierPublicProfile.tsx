import type { Organization } from '@/types/organization';

interface SupplierPublicProfileProps {
  organization: Organization;
}

/** 供应商类型中文映射（统一「供应商」，不下钻猜测制造商/贸易商） */
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

/** 供应商状态中文映射 */
const statusLabels: Record<string, string> = {
  ACTIVE: '活跃',
  INACTIVE: '未激活',
  SUSPENDED: '已暂停',
};

export default function SupplierPublicProfile({
  organization,
}: SupplierPublicProfileProps) {
  const typeLabel = typeLabels[organization.type] ?? '供应商';
  const statusLabel = statusLabels[organization.status] ?? '未知状态';

  return (
    <div className="rounded-xl border border-slate-200/80 shadow-industrial-sm bg-white p-6">
      {/* Supplier Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary">
            {organization.name?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-foreground truncate">
            {organization.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
              {typeLabel}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                organization.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-600'
                  : organization.status === 'INACTIVE'
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-amber-50 text-amber-600'
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}