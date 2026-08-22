import type { CSSProperties, ReactNode } from 'react';
import { colors, radius, spacing, typography } from '@visndt/design-tokens';

export type Tone =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface PrimitiveProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: keyof HTMLElementTagNameMap;
}

/** 语义色调 → 具体前景/背景组合（组件内部使用） */
export const TONE_STYLE: Record<Tone, { bg: string; fg: string; border: string }> = {
  primary: { bg: colors.primary, fg: '#ffffff', border: colors.primary },
  secondary: { bg: colors.neutral['100'], fg: colors.neutral['800'], border: colors.neutral['200'] },
  neutral: { bg: colors.neutral['50'], fg: colors.neutral['600'], border: colors.neutral['200'] },
  success: { bg: colors.status.success, fg: '#ffffff', border: colors.status.success },
  warning: { bg: colors.status.warning, fg: '#ffffff', border: colors.status.warning },
  error: { bg: colors.status.error, fg: '#ffffff', border: colors.status.error },
  info: { bg: colors.status.info, fg: '#ffffff', border: colors.status.info },
};

/** 轻柔形式（浅底深文，用于 Tag/Badge） */
export const SOFTER_TONE_STYLE: Record<Tone, { bg: string; fg: string; border: string }> = {
  primary: { bg: '#eff6ff', fg: '#1d4ed8', border: '#bfdbfe' },
  secondary: { bg: colors.neutral['100'], fg: colors.neutral['700'], border: colors.neutral['200'] },
  neutral: { bg: colors.neutral['100'], fg: colors.neutral['600'], border: colors.neutral['200'] },
  success: { bg: '#f0fdf4', fg: '#15803d', border: '#bbf7d0' },
  warning: { bg: '#fffbeb', fg: '#b45309', border: '#fef3c7' },
  error: { bg: '#fef2f2', fg: '#b91c1c', border: '#fecaca' },
  info: { bg: '#ecfeff', fg: '#0e7490', border: '#cffafe' },
};

export { colors, radius, spacing, typography };