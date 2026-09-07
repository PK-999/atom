export default function ComparisonLoading() {
  return (
    <div
      className="max-w-6xl mx-auto px-4 py-8 space-y-6 animate-pulse"
      aria-busy="true"
      aria-label="Loading comparison evidence..."
    >
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 bg-slate-100 dark:bg-slate-800/80 rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-6 w-full bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
