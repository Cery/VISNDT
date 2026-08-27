import type { DemandParameter } from '@/lib/api/demands';

interface DemandParametersProps {
  parameters?: DemandParameter[] | null;
}

const PRIORITY_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: '普通', className: 'bg-slate-100 text-slate-600' },
  1: { label: '重要', className: 'bg-sky-100 text-sky-700' },
  2: { label: '关键', className: 'bg-rose-100 text-rose-700' },
};

/** Render the value of a demand parameter based on its dataType. */
export function formatDemandParameterValue(param: DemandParameter): string {
  const def = param.parameterDefinition;
  const unit = def.unit ? ` ${def.unit}` : '';

  if (def.dataType === 'NUMBER' && (param.valueMin != null || param.valueMax != null)) {
    const min = param.valueMin != null ? String(param.valueMin) : '不限';
    const max = param.valueMax != null ? String(param.valueMax) : '不限';
    return `${min} ~ ${max}${unit}`;
  }

  if (def.dataType === 'BOOLEAN') {
    const bool = param.value === 'true' || param.value === '1';
    return bool ? '是' : '否';
  }

  if (def.dataType === 'ENUM' && def.options && def.options.length > 0) {
    const match = def.options.find((o) => o.value === param.value);
    if (match) return `${match.label}${unit}`;
  }

  if (param.value == null || param.value === '') {
    return '未填写';
  }

  return `${param.value}${unit}`;
}

export default function DemandParameters({ parameters }: DemandParametersProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        当前需求未提供技术参数。
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-4 py-2.5 font-medium text-slate-600 w-1/3">
              参数
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-slate-600">
              值
            </th>
            <th className="text-left px-4 py-2.5 font-medium text-slate-600 w-32">
              要求
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {parameters.map((param) => {
            const priority =
              PRIORITY_LABELS[param.priority] ?? PRIORITY_LABELS[0];
            return (
              <tr key={param.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2.5 text-slate-700 font-medium">
                  {param.parameterDefinition.name}
                </td>
                <td className="px-4 py-2.5 text-slate-600 break-words">
                  {formatDemandParameterValue(param)}
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-1">
                    {param.required && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        必填
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priority.className}`}
                    >
                      {priority.label}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
