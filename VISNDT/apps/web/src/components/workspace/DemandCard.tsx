import Link from 'next/link';

interface DemandCardProps {
  id: string;
  title: string;
  status: string;
  category?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-600',
  PUBLISHED: 'bg-green-100 text-green-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  CLOSED: 'bg-red-100 text-red-700',
};

export default function DemandCard({
  id,
  title,
  status,
  category,
  createdAt,
}: DemandCardProps) {
  return (
    <Link
      href={`/workspace/demands/${id}`}
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
      <div className="flex items-center gap-3 text-xs text-slate-400">
        {category && <span>{category}</span>}
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}