interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = '暂无数据' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-300">
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );
}