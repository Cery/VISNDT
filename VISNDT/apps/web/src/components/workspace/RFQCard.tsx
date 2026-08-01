import Link from 'next/link';

interface RFQCardProps {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  SENT: 'bg-blue-100 text-blue-700',
  RESPONDED: 'bg-amber-100 text-amber-700',
  CLOSED: 'bg-red-100 text-red-700',
};

export default function RFQCard({ id, title, status, createdAt }: RFQCardProps) {
  return (
    <Link
      href={`/workspace/rfqs/${id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-sm text-slate-900 line-clamp-2">
          {title}
        </h3>
        <span
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
            STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="text-xs text-slate-400">
        {new Date(createdAt).toLocaleDateString()}
      </div>
    </Link>
  );
}