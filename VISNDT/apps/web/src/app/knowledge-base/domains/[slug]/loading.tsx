export default function DomainLoading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}