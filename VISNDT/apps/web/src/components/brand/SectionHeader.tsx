/**
 * VISNDT Visual Language v1 — Section Header.
 * M33.2：消费 727 Typography Foundation + mono eyebrow（TG-05 技术字段）；
 * 结构：eyebrow(overline) → title → inline accent 分隔 → subtitle。
 * Server-compatible（无 client directive）；RSC 与 client 树均安全。
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
        <p className="font-mono text-xs font-medium tracking-[0.22em] uppercase text-primary mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{title}</h2>
      {/* structural accent divider（替代纯萌发，提供视觉层级锚点） */}
      <div
        className={`mt-3 flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}
        aria-hidden="true"
      >
        <span className="h-0.5 w-8 rounded-full bg-primary" />
        <span className="h-px w-6 rounded-full bg-slate-300" />
      </div>
      {subtitle && (
        <p
          className={`text-muted-foreground text-base mt-4 ${
            isCenter ? 'max-w-xl mx-auto' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}