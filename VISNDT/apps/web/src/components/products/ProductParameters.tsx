import type { ProductParameterValue } from '@/types/product';

interface ProductParametersProps {
  parameters: ProductParameterValue[];
}

export default function ProductParameters({ parameters }: ProductParametersProps) {
  if (parameters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No technical parameters available.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3 font-semibold text-muted-foreground w-1/3">
              Parameter
            </th>
            <th className="text-left py-2 px-3 font-semibold text-muted-foreground">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((pv) => (
            <tr key={pv.id} className="border-b last:border-0">
              <td className="py-2 px-3 text-muted-foreground">
                {pv.parameterDefinition.name}
                {pv.parameterDefinition.unit && (
                  <span className="text-xs ml-1">({pv.parameterDefinition.unit})</span>
                )}
              </td>
              <td className="py-2 px-3 font-medium">
                {pv.value}
                {pv.valueNumber !== null && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({pv.valueNumber})
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}