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
        <h3 className="font-semibold text-sm mb-2">Manufacturer Information</h3>
        <p className="text-sm text-muted-foreground">
          Manufacturer details for {productName} are not publicly available.
          Please use the inquiry form to contact us for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold text-sm mb-3">Manufacturer Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Company</span>
          <span className="font-medium">{organization.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className="font-medium">{organization.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status</span>
          <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            {organization.status}
          </span>
        </div>
      </div>
    </div>
  );
}