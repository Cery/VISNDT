interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = '出了点问题', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <p className="text-destructive/70 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm bg-gradient-to-r from-primary to-industrial-cyan text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
        >
          重试
        </button>
      )}
    </div>
  );
}