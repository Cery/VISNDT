/**
 * VISNDT Visual Language v1 — Industrial Badge.
 * A brand mal with symmetric side rules and an uppercase label, used for
 * platform/presence marks (not for section eyebrows — see SectionHeader).
 */

interface IndustrialBadgeProps {
  label: string;
  /** Tone of the label & side rules. */
  tone?: 'cyan' | 'primary';
  className?: string;
}

const TONE_CLASSES: Record<'cyan' | 'primary', { label: string; rule: string }> = {
  cyan: { label: 'text-industrial-cyan', rule: 'bg-industrial-cyan/60' },
  primary: { label: 'text-primary', rule: 'bg-primary/60' },
};

export default function IndustrialBadge({ label, tone = 'cyan', className = '' }: IndustrialBadgeProps) {
  const toneCls = TONE_CLASSES[tone];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`inline-block w-8 h-px ${toneCls.rule}`} />
      <span className={`text-sm font-medium tracking-widest uppercase ${toneCls.label}`}>{label}</span>
      <span className={`inline-block w-8 h-px ${toneCls.rule}`} />
    </div>
  );
}