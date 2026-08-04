interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = '出了点问题', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <p className="text-destructive text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-primary hover:underline"
        >
          重试
        </button>
      )}
    </div>
  );
}