'use client';

import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes, ReactNode } from 'react';
import { inputBase, labelText, requiredMark, helperText, errorText } from './fieldStyles';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'label'> {
  /** 可见 Label（Form Contract：Label ↔ Control 明确关联） */
  label?: ReactNode;
  /** 必填指示（仅展示，不替代 native required 校验） */
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
}

/**
 * VISNDT 基础 Textarea Primitive。
 * 支持 Label / Helper / Error / Disabled / Required，id 由内部生成保证 label 关联。
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, required, helper, error, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = rest.id ?? `vds-textarea-${autoId}`;
  const describedBy = helper || error ? `${id}-desc` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={labelText}>
          {label}
          {required && <span className={`ml-0.5 ${requiredMark}`} aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        className={`${inputBase} ${className ?? ''}`}
        {...rest}
      />
      {helper && !error && <p id={`${id}-desc`} className={helperText}>{helper}</p>}
      {error && <p id={`${id}-desc`} className={errorText}>{error}</p>}
    </div>
  );
});