export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[90px] w-full bg-ink/5" />
      <div className="mx-auto max-w-8xl px-5 py-16 sm:px-8">
        <div className="h-8 w-56 rounded-full bg-ink/8" />
        <div className="mt-4 h-4 w-80 max-w-full rounded-full bg-ink/6" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-ink/8">
              <div className="h-48 bg-ink/6" />
              <div className="space-y-2 px-5 py-4">
                <div className="h-4 w-3/4 rounded-full bg-ink/8" />
                <div className="h-3 w-full rounded-full bg-ink/6" />
                <div className="h-3 w-2/3 rounded-full bg-ink/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}