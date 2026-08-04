import Link from 'next/link';

interface WorkspaceEmptyProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function WorkspaceEmpty({
  title = '暂无内容',
  message = '当前没有可显示的内容。',
  actionLabel,
  actionHref,
}: WorkspaceEmptyProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <div className="text-3xl mb-3">📭</div>
      <h3 className="text-sm font-medium text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{message}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex text-sm font-medium text-slate-900 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}