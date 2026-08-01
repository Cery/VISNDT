const STATUS_MAP: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-600' },
  OPEN: { label: 'Open', className: 'bg-green-100 text-green-700' },
  RESPONDING: { label: 'Responding', className: 'bg-blue-100 text-blue-700' },
  CLOSED: { label: 'Closed', className: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

interface RFQStatusBadgeProps {
  status: string;
  className?: string;
}

export default function RFQStatusBadge({
  status,
  className = '',
}: RFQStatusBadgeProps) {
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