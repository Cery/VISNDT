'use client';

import { Fragment } from 'react';
import type { ProductDetail, ProductParameterValue, ParameterGroup } from '@/types/product';
import { formatValueWithUnit } from '@/lib/format';

interface CompareTableProps {
  products: ProductDetail[];
  parameterGroups: ParameterGroup[];
}

/** Safely extract numeric value from parameter value */
function numericValue(pv: ProductParameterValue): number | null {
  if (pv.valueNumber !== null) return pv.valueNumber;
  const n = parseFloat(pv.value);
  return isNaN(n) ? null : n;
}

/** Determine if a parameter differs across products */
function isDifferent(values: string[]): boolean {
  const unique = new Set(values);
  return unique.size > 1;
}

/** Get best value among NUMERIC parameters (lower is typically better) */
function bestValueIdx(values: (number | null)[]): number | null {
  const valid = values.map((v, i) => ({ v, i })).filter((x) => x.v !== null);
  if (valid.length <= 1) return null;
  valid.sort((a, b) => (a.v as number) - (b.v as number));
  return valid[0].i;
}

export default function CompareTable({ products, parameterGroups }: CompareTableProps) {
  // Collect all unique parameter definitions across products, grouped by ParameterGroup
  const paramMap = new Map<string, { definition: ProductParameterValue['parameterDefinition']; values: Map<string, string | null> }>();

  for (const product of products) {
    for (const pv of product.parameterValues) {
      const key = pv.parameterDefinitionId;
      if (!paramMap.has(key)) {
        paramMap.set(key, {
          definition: pv.parameterDefinition,
          values: new Map(),
        });
      }
      const entry = paramMap.get(key)!;
      // Display value: use unified formatter to ensure value-unit spacing
      const unit = pv.parameterDefinition.unit ?? null;
      const displayVal =
        pv.parameterDefinition.dataType === 'NUMBER' && pv.valueNumber !== null
          ? formatValueWithUnit(pv.valueNumber, unit)
          : pv.parameterDefinition.dataType === 'BOOLEAN'
            ? pv.value === 'true' || pv.value === '1'
              ? '是'
              : '否'
            : formatValueWithUnit(pv.value, unit);
      entry.values.set(product.id, displayVal);
    }
  }

  // Group parameters by group
  const groupedParams = new Map<string | null, typeof paramMap extends Map<string, infer V> ? [string, V][] : never>();
  for (const [key, entry] of paramMap) {
    const groupId = entry.definition.parameterGroupId;
    if (!groupedParams.has(groupId)) {
      groupedParams.set(groupId, []);
    }
    groupedParams.get(groupId)!.push([key, entry]);
  }

  // Sort groups
  const sortedGroups = Array.from(groupedParams.entries()).sort((a, b) => {
    const ga = parameterGroups.find((g) => g.id === a[0]);
    const gb = parameterGroups.find((g) => g.id === b[0]);
    if (a[0] === null) return 1; // ungrouped last
    if (b[0] === null) return -1;
    return (ga?.name ?? '').localeCompare(gb?.name ?? '');
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="text-left py-2 px-3 border-b border-slate-200 text-slate-500 font-medium w-32">
              参数
            </th>
            {products.map((p) => (
              <th key={p.id} className="py-2 px-3 border-b border-slate-200 text-left min-w-[180px]">
                <p className="font-semibold text-slate-800 line-clamp-2">{p.name}</p>
                {p.model && (
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{p.model}</p>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedGroups.map(([groupId, params]) => {
            const group = parameterGroups.find((g) => g.id === groupId);
            const groupName = groupId === null ? '其他参数' : (group?.name ?? '未分组');

            return (
              <Fragment key={groupId ?? '__ungrouped__'}>
                {/* Group header */}
                <tr>
                  <td
                    colSpan={products.length + 1}
                    className="py-2 px-3 bg-slate-50 font-semibold text-slate-600 text-xs uppercase tracking-wider"
                  >
                    {groupName}
                  </td>
                </tr>
                {/* Parameter rows */}
                {params.map(([key, entry]) => {
                  const values = products.map((p) => entry.values.get(p.id) ?? '-');
                  const diff = isDifferent(values);
                  const numValues = products.map((p) => {
                    const pv = products.flatMap((pp) => pp.parameterValues).find(
                      (v) => v.parameterDefinitionId === key && v.productId === p.id,
                    );
                    return pv ? numericValue(pv) : null;
                  });
                  const bestIdx = bestValueIdx(numValues);

                  return (
                    <tr
                      key={key}
                      className={diff ? 'bg-amber-50/60' : 'hover:bg-slate-50'}
                    >
                      <td className="py-2 px-3 border-b border-slate-100 text-slate-600">
                        {entry.definition.name}
                        {entry.definition.unit && (
                          <span className="text-slate-400 ml-1">({entry.definition.unit})</span>
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
  );
}