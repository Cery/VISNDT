'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  /** 全部选项共享 name（原生 radio group 语义） */
  options: RadioOption[];
  label?: ReactNode;
  /** 布局方向 */
  layout?: 'row' | 'column';
}

/**
 * VISNDT 基础 Radio Group Primitive —— 原生 radio 语义 + name 分组。
 */
export function RadioGroup({
  options,
  label,
  layout = 'column',
  name,
  ...rest
}: RadioGroupProps) {
  const autoId = useId();
  const groupName = name ?? `vds-radio-${autoId}`;

  return (
    <div role="radiogroup" aria-label={typeof label === 'string' ? label : undefined}>
      {label && <div className="mb-1.5 text-sm font-medium text-foreground">{label}</div>}
      <div className={layout === 'row'
        ? 'flex flex-wrap items-center gap-x-4 gap-y-2'
        : 'flex flex-col gap-2'}>
        {options.map((opt) => (
          <label key={opt.value} className="inline-flex cursor-pointer select-none items-center gap-2 text-sm text-foreground">
            <input
              type="radio"
              name={groupName}
              value={opt.value}
              disabled={opt.disabled}
              className="h-4 w-4 shrink-0 cursor-pointer text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
              {...rest}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}