import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { colors, radius, spacing, motion } from '@visndt/design-tokens';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  wrapperClassName?: string;
}

const H: Record<'sm' | 'md' | 'lg', number> = { sm: 30, md: 36, lg: 44 };
const F: Record<'sm' | 'md' | 'lg', number> = { sm: 13, md: 14, lg: 15 };

const ForwardedInput = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    prefix,
    suffix,
    size = 'md',
    block = false,
    wrapperClassName,
    style,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const borderColor = error ? colors.status.error : colors.neutral['300'];
  return (
    <div className={wrapperClassName} style={{ display: 'flex', flexDirection: 'column', gap: 4, width: block ? '100%' : undefined }}>
      {label && (
        <label style={{ fontSize: 13, color: colors.neutral['600'], fontWeight: 500 }}>{label}</label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: 10, color: colors.neutral['400'], display: 'inline-flex' }}
          >
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={className}
          style={{
            height: H[size],
            paddingLeft: (prefix ? 34 : 12),
            paddingRight: (suffix ? 34 : 12),
            fontSize: F[size],
            color: colors.neutral['900'],
            background: disabled ? colors.neutral['100'] : '#ffffff',
            border: `1px solid ${borderColor}`,
            borderRadius: radius.md,
            outline: 'none',
            transition: `border-color ${motion.duration.fast}ms, box-shadow ${motion.duration.fast}ms`,
            width: block ? '100%' : undefined,
            boxSizing: 'border-box',
            ...style,
          }}
          {...({ 'data-error': error ? 'true' : undefined } as Record<string, string | undefined>)}
          {...rest}
        />
        {suffix && (
          <span
            aria-hidden="true"
            style={{ position: 'absolute', right: 10, color: colors.neutral['400'], display: 'inline-flex' }}
          >
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <span style={{ fontSize: 12, color: colors.status.error }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 12, color: colors.neutral['400'] }}>{hint}</span>
      ) : null}
    </div>
  );
});

export default ForwardedInput;