'use client';

import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes, ReactNode } from 'react';
import { inputBase, labelText, requiredMark, helperText, errorText } from './fieldStyles';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'label'> {
  label?: ReactNode;
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  placeholder?: string;
}

/**
 * VISNDT 基础 Select Primitive（native select，保证键盘/移动端开箱即用）。
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, required, helper, error, options, placeholder, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = rest.id ?? `vds-select-${autoId}`;
  const describedBy = helper || error ? `${id}-desc` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={labelText}>
          {label}
          {required && <span className={`ml-0.5 ${requiredMark}`} aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={`${inputBase} appearance-none ${className ?? ''}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {helper && !error && <p id={`${id}-desc`} className={helperText}>{helper}</p>}
      {error && <p id={`${id}-desc`} className={errorText}>{error}</p>}
    </div>
  );
});