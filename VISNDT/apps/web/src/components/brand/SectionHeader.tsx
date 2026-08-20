/**
 * VISNDT Visual Language v1 — Section Header.
 * Unifies the homepage section heading hierarchy:
 *   eyebrow (overline) → title → subtitle
 * Server-compatible (no client directive); safe under both RSC and client trees.
 */

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">{eyebrow}</p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">{title}</h2>
      {subtitle && (
        <p className={`text-muted-foreground text-base ${isCenter ? 'max-w-xl mx-auto' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}