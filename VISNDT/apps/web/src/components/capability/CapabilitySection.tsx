import type { ReactNode } from 'react';

/**
 * VISNDT Visual Language v1 — Capability Section.
 *
 * 「能力档案」区块容器：eyebrow → title → subtitle → content，
 * 复用 617 品牌系统的 overline / brand 视觉词汇，用于产品详情页能力化展示。
 */

interface CapabilitySectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export default function CapabilitySection({
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
}: CapabilitySectionProps) {
  return (
    <section className={className}>
      <div className="mb-4">
        {eyebrow && (
          <p className="text-xs font-semibold text-primary tracking-widest uppercase">{eyebrow}</p>
        )}
        <h2 className="text-xl font-extrabold text-foreground mt-1">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}