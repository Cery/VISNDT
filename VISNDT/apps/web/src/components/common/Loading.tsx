export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20 min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent text-primary" />
    </div>
  );
}