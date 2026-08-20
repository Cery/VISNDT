import Link from 'next/link';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  /** 可选的兜底导航入口，用于在错误态下引导用户离开 */
  action?: {
    label: string;
    href: string;
  };
}

export default function ErrorState({ message = '出了点问题', onRetry, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
          >
            重试
          </button>
        )}
        {action && (
          <Link
            href={action.href}
            className="text-sm border border-slate-200 text-slate-600 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}