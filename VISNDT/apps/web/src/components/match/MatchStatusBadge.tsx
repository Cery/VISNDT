const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  MATCHED: { label: 'Matched', className: 'bg-green-100 text-green-700' },
  REVIEWED: { label: 'Reviewed', className: 'bg-blue-100 text-blue-700' },
  ACCEPTED: { label: 'Accepted', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expired', className: 'bg-slate-100 text-slate-500' },
};

interface MatchStatusBadgeProps {
  status: string;
  className?: string;
}

export default function MatchStatusBadge({
  status,
  className = '',
}: MatchStatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    label: status,
    className: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}