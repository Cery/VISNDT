'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { requiredMark } from './fieldStyles';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'label'> {
  label?: ReactNode;
  required?: boolean;
}

/**
 * VISNDT 基础 Checkbox Primitive —— Label 与 native input 显式关联（a11y）。
 */
export function Checkbox({ label, required, className, ...rest }: CheckboxProps) {
  const autoId = useId();
  const id = rest.id ?? `vds-check-${autoId}`;

  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer select-none items-center gap-2 text-sm text-foreground ${className ?? ''}`}
    >
      <input
        id={id}
        type="checkbox"
        aria-required={required || undefined}
        className="h-4 w-4 shrink-0 cursor-pointer rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        {...rest}
      />
      {label && (
        <span>
          {label}
          {required && <span className={`ml-0.5 ${requiredMark}`} aria-hidden="true">*</span>}
        </span>
      )}
    </label>
  );
}