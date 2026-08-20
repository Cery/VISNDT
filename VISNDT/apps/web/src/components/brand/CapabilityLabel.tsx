import type { ReactNode } from 'react';

/**
 * VISNDT Visual Language v1 — Capability Label.
 * A small round-cornered tag describing a capability attribute
 * (category, model, parameter group, solution domain).
 */

interface CapabilityLabelProps {
  children: ReactNode;
  tone?: 'primary' | 'cyan' | 'amber' | 'neutral';
  className?: string;
}

const TONE_CLASSES: Record<NonNullable<CapabilityLabelProps['tone']>, string> = {
  primary: 'bg-primary/10 text-primary',
  cyan: 'bg-industrial-cyan/10 text-industrial-cyan',
  amber: 'bg-industrial-amber/10 text-industrial-amber',
  neutral: 'bg-slate-100 text-slate-500',
};

export default function CapabilityLabel({ children, tone = 'primary', className = '' }: CapabilityLabelProps) {
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${TONE_CLASSES[tone]} ${className}`}>
      {children}
    </span>
  );
}