export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[90px] w-full bg-ink/5" />
      <div className="h-[220px] w-full bg-[#3d7a72]/20 sm:h-[260px]" />
      <div className="mx-auto max-w-8xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-square rounded-2xl border border-ink/8 bg-ink/6" />
          <div className="flex flex-col gap-4">
            <div className="h-5 w-24 rounded-full bg-ink/8" />
            <div className="h-8 w-3/4 rounded-full bg-ink/8" />
            <div className="h-4 w-1/3 rounded-full bg-ink/6" />
            <div className="mt-2 h-10 w-40 rounded-full bg-ink/8" />
            <div className="h-16 w-full rounded-xl bg-ink/6" />
            <div className="mt-4 h-12 w-full max-w-sm rounded-full bg-ink/8" />
          </div>
        </div>
      </div>
    </div>
  );
}