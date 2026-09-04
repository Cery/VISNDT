import type { ProductParameterValue, ParameterGroup } from '@/types/product';
import ParameterHighlight from '@/components/capability/ParameterHighlight';
import InsightAnnotation from '@/components/engineering/InsightAnnotation';
import type { EngineeringAnnotation } from '@/lib/engineering-insight/annotation';

interface ProductParametersProps {
  parameters: ProductParameterValue[];
  /** Optional group lookup for grouping display (map from groupId to group) */
  parameterGroups?: ParameterGroup[];
  /** Optional engineering-context annotations keyed by parameter definition name (M37 Insight Annotation) */
  annotations?: Record<string, EngineeringAnnotation>;
}

export default function ProductParameters({
  parameters,
  parameterGroups,
  annotations,
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

  const isFlat = sortedKeys.length === 1 && sortedKeys[0] === null;

  // 分组技术标题条（工业语境 / mono 组索引 / 受控 accent 竖条）
  const GroupHeader = ({ label, index }: { label: string; index: number }) => (
    <div className="flex items-center gap-2.5 mb-3">
      <span className="h-4 w-1 rounded-sm bg-industrial-cyan shrink-0" aria-hidden="true" />
      <span className="font-mono text-[11px] tracking-widest text-slate-400 uppercase">
        PARAM-GRP / {String(index).padStart(2, '0')}
      </span>
      <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      <span className="flex-1 border-t border-slate-200/80" aria-hidden="true" />
    </div>
  );

  // 技术表头（深色工业条）
  const TableHead = () => (
    <thead>
      <tr className="bg-industrial-dark">
        <th className="text-left py-2.5 px-3 font-mono text-[11px] font-medium tracking-widest text-slate-300 uppercase w-1/3 whitespace-nowrap">
          <span className="text-industrial-cyan mr-1">#</span> Parameter
        </th>
        <th className="text-left py-2.5 px-3 font-mono text-[11px] font-medium tracking-widest text-slate-300 uppercase">
          Spec Value
        </th>
      </tr>
    </thead>
  );

  const SpecTable = ({ items }: { items: ProductParameterValue[] }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 shadow-industrial-sm">
      <table className="w-full text-sm">
        <TableHead />
        <tbody>{items.map((pv, i) => {
          const isAlt = i % 2 === 1;
          return (
            <tr key={pv.id} className={`border-t first:border-t-0 ${isAlt ? 'bg-slate-50/60' : 'bg-white'}`}>
              <td className="py-2.5 px-3 align-top">
                <span className="font-mono text-[11px] text-slate-300 mr-2 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-slate-600">{pv.parameterDefinition.name}</span>
                {annotations?.[pv.parameterDefinition.name] && (
                  <InsightAnnotation annotation={annotations[pv.parameterDefinition.name]} />
                )}
                {pv.parameterDefinition.unit && (
                  <span className="ml-1.5 inline-block font-mono text-[10px] text-slate-400 border border-slate-200 rounded px-1 py-0.5 align-middle">
                    {pv.parameterDefinition.unit}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-3">
                <div className="font-mono font-semibold text-slate-800 tabular-nums">
                  {pv.value}
                  {pv.valueNumber !== null && (
                    <span className="text-xs text-slate-400 ml-1.5">({pv.valueNumber})</span>
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
        })}</tbody>
      </table>
    </div>
  );

  // Flat table (no groups provided or all ungrouped)
  if (isFlat) {
    return (
      <div>
        <GroupHeader label="技术参数" index={1} />
        <SpecTable items={grouped.get(null)!} />
      </div>
    );
  }

  // Grouped display
  return (
    <div className="space-y-7">
      {sortedKeys.map((gid, idx) => {
        const group = gid ? groupMap.get(gid) : null;
        const items = grouped.get(gid) ?? [];
        const label = group?.name ?? '其他参数';

        return (
          <div key={gid ?? '__ungrouped__'}>
            <GroupHeader label={label} index={idx + 1} />
            <SpecTable items={items} />
          </div>
        );
      })}
    </div>
  );
}