import type { Organization } from '@/types/organization';

interface ManufacturerInfoProps {
  organization?: Organization | null;
  productName: string;
}

export default function ManufacturerInfo({
  organization,
  productName,
}: ManufacturerInfoProps) {
  if (!organization) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold text-sm mb-2">制造商信息</h3>
        <p className="text-sm text-muted-foreground">
          此产品的制造商信息暂未公开。请使用询价表单联系我们以获取更多信息。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold text-sm mb-3">制造商信息</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">公司</span>
          <span className="font-medium">{organization.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">类型</span>
          <span className="font-medium">{organization.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">状态</span>
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            {organization.status}
          </span>
        </div>
      </div>
    </div>
  );
}