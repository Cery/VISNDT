const STATUS_MAP: Record<string, { label: string; className: string }> = {
  DRAFT: { label: '草稿', className: 'bg-slate-100 text-slate-600' },
  PUBLISHED: { label: '已发布', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: '处理中', className: 'bg-blue-100 text-blue-700' },
  CLOSED: { label: '已关闭', className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: '已取消', className: 'bg-red-100 text-red-700' },
};

interface DemandStatusBadgeProps {
  status: string;
  className?: string;
}

export default function DemandStatusBadge({
  status,
  className = '',
}: DemandStatusBadgeProps) {
  const config = STATUS_MAP[status] || {
    label: '未知状态',
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