import type { ReactNode } from 'react';
import { colors, radius, spacing } from '@visndt/design-tokens';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  /** 可见页码前后偏移 */
  siblingCount?: number;
  className?: string;
  size?: 'sm' | 'md';
}

function pages(page: number, totalPages: number, sibling = 1): (number | 'ellipsis')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const left = Math.max(2, page - sibling);
  const right = Math.min(totalPages - 1, page + sibling);
  const out: (number | 'ellipsis')[] = [1];
  if (left > 2) out.push('ellipsis');
  for (let i = left; i <= right; i++) out.push(i);
  if (right < totalPages - 1) out.push('ellipsis');
  out.push(totalPages);
  return out;
}

/** 统一分页控件（消灭各列表分页差异）。 */
export default function Pagination({ page, pageSize, total, onChange, siblingCount = 1, className, size = 'md' }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const h = size === 'sm' ? 28 : 32;
  const item: React.CSSProperties = {
    minWidth: h,
    height: h,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    border: `1px solid ${colors.neutral['200']}`,
    background: '#ffffff',
    color: colors.neutral['700'],
    cursor: 'pointer',
    padding: `0 ${spacing[1]}px`,
    fontSize: size === 'sm' ? 12 : 13,
    transition: 'background 120ms, color 120ms',
  };
  return (
    <nav
      className={className}
      aria-label="pagination"
      style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}
    >
      <button
        type="button"
        aria-label="previous"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        style={{ ...item, ...(page <= 1 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
      >
        ‹
      </button>
      {pages(page, totalPages, siblingCount).map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} style={{ ...item, border: 'none', background: 'transparent', cursor: 'default' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange(p)}
            style={{
              ...item,
              ...(p === page
                ? { background: colors.primary, borderColor: colors.primary, color: '#ffffff', fontWeight: 600 }
                : {}),
            }}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="next"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        style={{ ...item, ...(page >= totalPages ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}
      >
        ›
      </button>
    </nav>
  );
}