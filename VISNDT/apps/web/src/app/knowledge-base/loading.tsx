export default function KnowledgeBaseLoading() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-20">
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}