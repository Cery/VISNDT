'use client';

import { createContext, useContext, useId } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import { helperText, errorText, requiredMark, labelText } from './fieldStyles';

/* ============================================================
 * Form Primitive —— 统一表单语义基座（WP-2 §12 Form Contract）。
 * Field 通过内部生成的 id 保证 Label ↔ Control 明确关联，
 * 并提供 Helper Text / Error / Required Indicator / 关联语义。
 * ============================================================ */

/** 由原语注入的上下文：预生成 id 前缀，供 Label/Control 关联 */
const FieldScope = createContext<{ id: string; name?: string }>({ id: '' });

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  label?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  name?: string;
  children: ReactNode;
}

/**
 * FormField：为 Label + Control + Message 提供语义容器。
 * 用户需为控件传入显式 id（推荐 `id="${autoId}"`），或直接使用 FieldLabel/FieldMessage
 * 由本组件关联 —— Label 与 Control 的关联由 htmlFor/id 保证（Form Contract）。
 */
export function FormField({
  label,
  htmlFor,
  required,
  helper,
  error,
  name,
  children,
  ...rest
}: FormFieldProps) {
  const autoId = useId();

  return (
    <FieldScope.Provider value={{ id: htmlFor ?? `vds-field-${autoId}`, name }}>
      <div {...rest}>
        {label && (
          <FieldLabel required={required}>{label}</FieldLabel>
        )}
        {children}
        {helper && !error && <FieldMessage>{helper}</FieldMessage>}
        {error && <FieldMessage error>{error}</FieldMessage>}
      </div>
    </FieldScope.Provider>
  );
}

export interface FieldLabelProps {
  children: ReactNode;
  /** 显式 target，缺省使用上下文 id */
  controlId?: string;
  required?: boolean;
}

export function FieldLabel({ children, controlId, required }: FieldLabelProps) {
  const { id } = useContext(FieldScope);
  return (
    <label htmlFor={controlId ?? id} className={labelText}>
      {children}
      {required && <span className={`ml-0.5 ${requiredMark}`} aria-hidden="true">*</span>}
    </label>
  );
}

export interface FieldMessageProps {
  children: ReactNode;
  error?: boolean;
  /** 缺省使用上下文 id + '-desc'，与控件 aria-describedby 关联 */
  controlId?: string;
}

export function FieldMessage({ children, error = false, controlId }: FieldMessageProps) {
  const { id } = useContext(FieldScope);
  return (
    <p id={(controlId ?? id) + '-desc'} className={error ? errorText : helperText}>
      {children}
    </p>
  );
}

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 分组区段：将表单按语义分组，标题 + 描述 + 内容 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <fieldset className={`space-y-4 ${className ?? ''}`}>
      {(title || description) && (
        <div>
          {title && <legend className="text-base font-semibold text-foreground">{title}</legend>}
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </fieldset>
  );
}

export { FieldScope, labelText, helperText, errorText };