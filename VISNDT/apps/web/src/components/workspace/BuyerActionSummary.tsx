'use client';

import Link from 'next/link';

interface BuyerActionSummaryProps {
  title: string;
  count: number;
  description: string;
  href: string;
  linkLabel: string;
}

export default function BuyerActionSummary({
  title,
  count,
  description,
  href,
  linkLabel,
}: BuyerActionSummaryProps) {
  return (
    <article className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Pending Actions
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">当前数量</p>
          <p className="text-3xl font-bold text-amber-700">{count}</p>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-amber-700 transition-colors hover:text-amber-800"
        >
          {linkLabel}
        </Link>
      </div>
    </article>
  );
}
