const STATUS_MAP: Record<string, { label: string; className: string }> = {
  SUBMITTED: { label: '已提交', className: 'bg-blue-100 text-blue-700' },
  VIEWED: { label: '已查看', className: 'bg-amber-100 text-amber-700' },
  ACCEPTED: { label: '已接受', className: 'bg-green-100 text-green-700' },
  REJECTED: { label: '已拒绝', className: 'bg-red-100 text-red-700' },
};

interface RFQResponseStatusBadgeProps {
  status: string;
  className?: string;
}

export default function RFQResponseStatusBadge({
  status,
  className = '',
}: RFQResponseStatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    label: '未知状态',
    className: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
