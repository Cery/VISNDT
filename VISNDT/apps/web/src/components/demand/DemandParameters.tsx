interface DemandParametersProps {
  parameters?: Array<{
    id: string;
    name: string;
    value: string;
    unit?: string | null;
  }>;
}

export default function DemandParameters({ parameters }: DemandParametersProps) {
  if (!parameters || parameters.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">未指定技术参数。</p>
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
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {parameters.map((param) => (
            <tr key={param.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-2.5 text-slate-700 font-medium">
                {param.name}
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {param.value}
                {param.unit && (
                  <span className="text-slate-400 ml-1">{param.unit}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}