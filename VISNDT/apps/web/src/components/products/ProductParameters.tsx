import type { ProductParameterValue, ParameterGroup } from '@/types/product';
import ParameterHighlight from '@/components/capability/ParameterHighlight';

interface ProductParametersProps {
  parameters: ProductParameterValue[];
  /** Optional group lookup for grouping display (map from groupId to group) */
  parameterGroups?: ParameterGroup[];
}

export default function ProductParameters({
  parameters,
  parameterGroups,
}: ProductParametersProps) {
  if (parameters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">暂无技术参数。</p>
    );
  }

  const groupMap = new Map(parameterGroups?.map((g) => [g.id, g]) ?? []);

  // Group parameters by parameterDefinition.parameterGroupId
  const grouped = new Map<string | null, ProductParameterValue[]>();
  for (const pv of parameters) {
    const gid = pv.parameterDefinition.parameterGroupId;
    const list = grouped.get(gid) ?? [];
    list.push(pv);
    grouped.set(gid, list);
  }

  // Sort groups: named groups first (by name), ungrouped ("其他参数") last
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    const ga = groupMap.get(a);
    const gb = groupMap.get(b);
    return (ga?.name ?? '').localeCompare(gb?.name ?? '');
  });

  const renderRow = (pv: ProductParameterValue) => (
    <tr key={pv.id} className="border-b last:border-0">
      <td className="py-2 px-3 text-muted-foreground">
        {pv.parameterDefinition.name}
        {pv.parameterDefinition.unit && (
          <span className="text-xs ml-1">({pv.parameterDefinition.unit})</span>
        )}
      </td>
      <td className="py-2 px-3">
        <div className="font-medium">
          {pv.value}
          {pv.valueNumber !== null && (
            <span className="text-xs text-muted-foreground ml-1">
              ({pv.valueNumber})
            </span>
          )}
        </div>
        <ParameterHighlight
          name={pv.parameterDefinition.name}
          code={pv.parameterDefinition.code}
          className="mt-1"
        />
      </td>
    </tr>
  );

  // Flat table (no groups provided or all ungrouped)
  if (sortedKeys.length === 1 && sortedKeys[0] === null) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-semibold text-muted-foreground w-1/3">
                参数
              </th>
              <th className="text-left py-2 px-3 font-semibold text-muted-foreground">
                值
              </th>
            </tr>
          </thead>
          <tbody>{grouped.get(null)!.map(renderRow)}</tbody>
        </table>
      </div>
    );
  }

  // Grouped display
  return (
    <div className="space-y-6">
      {sortedKeys.map((gid) => {
        const group = gid ? groupMap.get(gid) : null;
        const items = grouped.get(gid) ?? [];
        const label = group?.name ?? '其他参数';

        return (
          <div key={gid ?? '__ungrouped__'}>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 border-b pb-2">
              {label}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground w-1/3">
                      参数
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-muted-foreground">
                      值
                    </th>
                  </tr>
                </thead>
                <tbody>{items.map(renderRow)}</tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}