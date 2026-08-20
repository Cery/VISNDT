/**
 * VISNDT Visual Language v1 — Brand Divider.
 * Decorative industrial divider: converging rules around a rotated square node.
 */

interface BrandDividerProps {
  className?: string;
}

export default function BrandDivider({ className = '' }: BrandDividerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
      <span className="w-1.5 h-1.5 rotate-45 bg-industrial-cyan" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-300" />
    </div>
  );
}