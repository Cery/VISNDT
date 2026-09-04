'use client';

import { Fragment } from 'react';
import type { CapabilitySupplierProduct } from '@/types/capability';
import type { ParameterGroup } from '@/types/product';
import { formatValueWithUnit } from '@/lib/format';

/**
 * SupplierCompareTable — M28.1 M667 SupplierProduct Comparison Experience.
 *
 * Option B: shared key parameters + difference highlight. Compares published
 * SupplierProducts that all belong to the SAME Platform Capability.
 *
 * P2 (frozen): this is a NON-COMMERCIAL public comparison — no price band, no
 * availability-by-offer, no offer payload. Offer stays commercial/private.
 *
 * Information hierarchy:
 *   1. Platform Capability   — "我在比较什么能力？"
 *   2. Supplier Organization — "谁提供？"
 *   3. Brand / Series / Model— "具体是什么型号？"
 *   4. Technical Parameters  — "型号有什么差异？"  (diff highlight)
 *
 * Comparison is INFORMATION PRESENTATION only — never a commercial ranking.
 */
interface SupplierCompareTableProps {
  /** Platform Capability (Capability Authority) anchor id */
  capabilityId: string;
  /** Platform Capability (Capability Authority) anchor name */
  capabilityName: string;
  /** Selected SupplierProducts (same capability), non-commercial model context */
  items: CapabilitySupplierProduct[];
  parameterGroups: ParameterGroup[];
}

/** Safely extract numeric value from a supplier parameter value */
function numericValue(pv: {
  valueNumber?: number | null;
  value?: string | null;
}): number | null {
  if (pv.valueNumber !== null && pv.valueNumber !== undefined) return pv.valueNumber;
  if (pv.value === null || pv.value === undefined) return null;
  const n = parseFloat(pv.value);
  return isNaN(n) ? null : n;
}

/** Determine if a parameter differs across supplier products */
function isDifferent(values: string[]): boolean {
  const unique = new Set(values.filter((v) => v !== '-'));
  if (unique.size === 0) return false;
  return unique.size > 1 || values.some((v) => v === '-');
}

/** Get index of best numeric value (lower is typically better) */
function bestValueIdx(values: (number | null)[]): number | null {
  const valid = values.map((v, i) => ({ v, i })).filter((x) => x.v !== null);
  if (valid.length <= 1) return null;
  valid.sort((a, b) => (a.v as number) - (b.v as number));
  return valid[0].i;
}

export default function SupplierCompareTable({
  capabilityId,
  capabilityName,
  items,
  parameterGroups,
}: SupplierCompareTableProps) {
  if (items.length === 0) return null;

  // Collect all unique parameter definitions across selected supplier products.
  const paramMap = new Map<
    string,
    { definition: { name: string; code?: string | null; dataType?: string; unit?: string | null; parameterGroupId?: string | null }; values: Map<string, string | null> }
  >();

  for (const supplierProduct of items) {
    for (const pv of supplierProduct.parameterValues ?? []) {
      const def = pv.parameterDefinition;
      if (!def) continue;
      const key = pv.parameterDefinitionId;
      if (!paramMap.has(key)) {
        paramMap.set(key, { definition: def, values: new Map() });
      }
      const entry = paramMap.get(key)!;
      const unit = def.unit ?? null;
      const displayVal =
        def.dataType === 'NUMBER' && pv.valueNumber !== null && pv.valueNumber !== undefined
          ? formatValueWithUnit(pv.valueNumber, unit)
          : def.dataType === 'BOOLEAN'
            ? pv.value === 'true' || pv.value === '1'
              ? '是'
              : '否'
            : formatValueWithUnit(pv.value ?? '-', unit);
      entry.values.set(supplierProduct.id, displayVal);
    }
  }

  // Group parameters by their group.
  const groupedParams = new Map<
    string | null,
    { key: string; entry: (typeof paramMap) extends Map<string, infer V> ? V : never }[]
  >();
  for (const [key, entry] of paramMap) {
    const groupId = entry.definition.parameterGroupId ?? null;
    if (!groupedParams.has(groupId)) groupedParams.set(groupId, []);
    groupedParams.get(groupId)!.push({ key, entry });
  }

  const sortedGroups = Array.from(groupedParams.entries()).sort((a, b) => {
    if (a[0] === null) return 1;
    if (b[0] === null) return -1;
    const ga = parameterGroups.find((g) => g.id === a[0]);
    const gb = parameterGroups.find((g) => g.id === b[0]);
    return (ga?.name ?? '').localeCompare(gb?.name ?? '');
  });

  return (
    <div>
      {/* Layer 1 — Platform Capability anchor */}
      <div className="mb-4 rounded-lg bg-sky-50 border border-sky-100 px-4 py-3">
        <p className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
          正在比较的检测能力
        </p>
        <p className="mt-0.5 text-lg font-bold text-slate-900">{capabilityName}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          共 {items.length} 个供应商型号 · 同一能力下横向对比
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 border-b border-slate-200 text-slate-500 font-medium w-36 align-top">
                对比项
              </th>
              {items.map((supplierProduct) => {
                return (
                  <th
                    key={supplierProduct.id}
                    className="py-3 px-3 border-b border-slate-200 text-left align-top min-w-[210px] bg-slate-50/50"
                  >
                    {/* Layer 2 — Supplier Organization Identity */}
                    <p className="text-[11px] font-semibold text-sky-700 mb-0.5">
                      供应商：{supplierProduct.organization?.name ?? '未知供应商'}
                    </p>
                    {/* Layer 3 — Brand / Series / Model */}
                    <p className="font-semibold text-slate-900">
                      {supplierProduct.brand}
                      {supplierProduct.series ? ` ${supplierProduct.series}` : ''}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      型号：{supplierProduct.modelNumber}
                    </p>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* Layer 4 — Technical Parameters (Option B: common + diff highlight) */}
            {sortedGroups.map(([groupId, params]) => {
              const group = parameterGroups.find((g) => g.id === groupId);
              const groupName =
                groupId === null ? '其他参数' : group?.name ?? '未分组';
              return (
                <Fragment key={groupId ?? '__ungrouped__'}>
                  <tr>
                    <td
                      colSpan={items.length + 1}
                      className="py-2 px-3 bg-slate-50 font-semibold text-slate-600 text-xs uppercase tracking-wider"
                    >
                      {groupName}
                    </td>
                  </tr>
                  {params.map(({ key, entry }) => {
                    const values = items.map(
                      (it) => entry.values.get(it.id) ?? '-',
                    );
                    const diff = isDifferent(values);
                    const numValues = items.map((it) => {
                      const pv = (it.parameterValues ?? []).find(
                        (v) => v.parameterDefinitionId === key,
                      );
                      return pv ? numericValue(pv) : null;
                    });
                    const bestIdx = bestValueIdx(numValues);

                    return (
                      <tr
                        key={key}
                        className={diff ? 'bg-amber-50/50' : 'hover:bg-slate-50'}
                      >
                        <td className="py-2 px-3 border-b border-slate-100 text-slate-600">
                          {entry.definition.name}
                          {entry.definition.unit && (
                            <span className="text-slate-400 ml-1">
                              ({entry.definition.unit})
                            </span>
                          )}
                        </td>
                        {values.map((val, idx) => (
                          <td
                            key={idx}
                            className={`py-2 px-3 border-b border-slate-100 ${
                              diff && bestIdx === idx
                                ? 'text-green-600 font-medium'
                                : diff
                                  ? 'text-slate-600'
                                  : 'text-slate-700'
                            }`}
                          >
                            {val}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
