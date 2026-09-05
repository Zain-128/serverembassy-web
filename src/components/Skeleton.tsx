export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-soft transition-shadow">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-line/50">
        <Skeleton className="absolute inset-0 rounded-none opacity-60" />
      </div>
      <div className="px-1 pt-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <Skeleton className="mt-2 h-3.5 w-3/5" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SectionSkeleton({ id }: { id?: string }) {
  return (
    <section id={id} className="container-se py-12">
      <div className="mb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <ProductGridSkeleton count={4} />
    </section>
  );
}

export function MarqueeSkeleton() {
  return (
    <section className="container-se py-14">
      <div className="mb-8">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-8 w-48" />
      </div>
      <div className="rounded-3xl border border-line bg-white p-6">
        <div className="flex items-center gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BannerGridSkeleton() {
  return (
    <section className="container-se py-16">
      <div className="mb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-2xl" />
        ))}
      </div>
    </section>
  );
}