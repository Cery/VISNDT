const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: '待处理', className: 'bg-amber-100 text-amber-700' },
  MATCHED: { label: '已匹配', className: 'bg-green-100 text-green-700' },
  REVIEWED: { label: '已审核', className: 'bg-blue-100 text-blue-700' },
  ACCEPTED: { label: '已接受', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: '已拒绝', className: 'bg-red-100 text-red-700' },
  EXPIRED: { label: '已过期', className: 'bg-slate-100 text-slate-500' },
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