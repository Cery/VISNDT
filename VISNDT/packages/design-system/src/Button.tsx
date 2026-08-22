import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { colors, radius, motion, spacing } from '@visndt/design-tokens';
import { TONE_STYLE, type Tone } from './shared';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  /** primary | secondary | ghost | soft（subtle）| link */
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  block?: boolean;
}

const HEIGHT: Record<'sm' | 'md' | 'lg', number> = { sm: 28, md: 36, lg: 44 };
const PAD_X: Record<'sm' | 'md' | 'lg', number> = { sm: 10, md: 14, lg: 18 };
const FONT_SIZE: Record<'sm' | 'md' | 'lg', number> = { sm: 13, md: 14, lg: 15 };

function variantStyle(tone: Tone, variant: ButtonProps['variant'], disabled?: boolean) {
  const t = TONE_STYLE[tone];
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.md,
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `background ${motion.duration.fast}ms ${motion.easing.standard}, color ${motion.duration.fast}ms ${motion.easing.standard}, border-color ${motion.duration.fast}ms ${motion.easing.standard}, box-shadow ${motion.duration.fast}ms ${motion.easing.standard}`,
    outline: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };
  let visual: React.CSSProperties = {};
  switch (variant) {
    case 'outline':
      visual = {
        background: 'transparent',
        color: tone === 'primary' ? colors.primary : t.fg,
        border: `1px solid ${tone === 'primary' ? colors.primary : colors.neutral['300']}`,
      };
      break;
    case 'ghost':
      visual = {
        background: 'transparent',
        color: tone === 'primary' ? colors.primary : colors.neutral['700'],
        border: '1px solid transparent',
      };
      break;
    case 'soft':
      visual = {
        background: tone === 'primary' ? '#eff6ff' : colors.neutral['100'],
        color: tone === 'primary' ? colors.primaryDark : colors.neutral['700'],
        border: '1px solid transparent',
      };
      break;
    case 'link':
      visual = {
        background: 'transparent',
        color: tone === 'primary' ? colors.primary : colors.neutral['600'],
        border: '1px solid transparent',
        paddingInline: 0,
        borderRadius: 0,
      };
      break;
    default:
      visual = { background: t.bg, color: t.fg, border: `1px solid ${t.border}` };
  }
  if (disabled) visual = { ...visual, opacity: 0.5, boxShadow: 'none' };
  return { ...base, ...visual };
}

const ForwardedButton = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    tone = 'primary',
    variant = 'solid',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    block = false,
    children,
    style,
    disabled,
    className,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={className}
      style={{
        ...variantStyle(tone, variant, disabled || loading),
        height: HEIGHT[size],
        paddingInline: PAD_X[size],
        fontSize: FONT_SIZE[size],
        width: block ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {loading ? <span aria-hidden="true">…</span> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default ForwardedButton;