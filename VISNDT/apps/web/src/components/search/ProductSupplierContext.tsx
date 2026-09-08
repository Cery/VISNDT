import Link from 'next/link';

/**
 * ProductSupplierContext — 814 Search Authority & Public Display Convergence.
 *
 * Renders the SUPPORTING context under a Platform Product (Capability) primary
 * search result: matching SUPPLIER MODEL(s) (brand / series / modelNumber) and
 * PROVIDER(s) (Supplier Organization). Product remains the result authority;
 * SupplierProduct is contextual evidence; Supplier is the contextual provider.
 *
 * NO price / currency / offer-count is ever rendered here (frozen R4 / R11 /
 * R20). Commercial data stays in Offer (private / commercial response).
 */
export interface SupplierModelCtx {
  organization: { id: string; name: string } | null;
  brand: string;
  series: string | null;
  modelNumber: string;
}

export default function ProductSupplierContext({
  models,
}: {
  models: SupplierModelCtx[];
}) {
  if (!models || models.length === 0) return null;

  // Distinct provider orgs (dedup) — "相关供应商"
  const orgMap = new Map<string, { id: string; name: string }>();
  for (const m of models) {
    if (m.organization?.id) orgMap.set(m.organization.id, m.organization);
  }
  const orgs = Array.from(orgMap.values());

  // Distinct models (dedup by provider + brand + model number)
  const seen = new Set<string>();
  const uniqModels = models.filter((m) => {
    const key = `${m.organization?.id ?? ''}|${m.brand}|${m.modelNumber}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-5 py-3 text-xs">
      {uniqModels.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            匹配型号
          </span>
          {uniqModels.slice(0, 4).map((m) => (
            <span
              key={`${m.organization?.id ?? ''}_${m.brand}_${m.modelNumber}`}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2.5 py-0.5 text-slate-600"
            >
              {m.brand && <span className="text-slate-400">{m.brand}</span>}
              <span className="font-mono text-slate-700">{m.modelNumber}</span>
              {m.series && (
                <span className="text-[10px] text-slate-400">{m.series}</span>
              )}
            </span>
          ))}
          {uniqModels.length > 4 && (
            <span className="text-slate-400">等 {uniqModels.length} 个型号</span>
          )}
        </div>
      )}

      {orgs.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
            相关供应商
          </span>
          {orgs.slice(0, 4).map((o) => (
            <Link
              key={o.id}
              href={`/suppliers/${o.id}`}
              className="inline-flex items-center gap-0.5 text-slate-700 hover:text-primary transition-colors"
            >
              {o.name}
            </Link>
          ))}
          {orgs.length > 4 && (
            <span className="text-slate-400">等 {orgs.length} 家</span>
          )}
        </div>
      )}

      <p className="mt-2.5 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
        该能力下已发布 {uniqModels.length} 个产品型号 · {orgs.length} 家供应商
      </p>
    </div>
  );
}