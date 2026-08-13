import type { Organization } from '@/types/organization';

interface SupplierPublicProfileProps {
  organization: Organization;
}

/** 供应商类型中文映射 */
const typeLabels: Record<string, string> = {
  manufacturer: '制造商',
  distributor: '经销商',
  agent: '代理商',
  'service-provider': '服务商',
  integrator: '集成商',
  'testing-organization': '检测机构',
  other: '其他',
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
  const typeLabel = typeLabels[organization.type] ?? organization.type;
  const statusLabel = statusLabels[organization.status] ?? organization.status;

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