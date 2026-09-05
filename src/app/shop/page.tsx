import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";
import { ProductGridSkeleton } from "@/components/Skeleton";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-se py-8">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-line/70" />
            <div className="h-8 w-52 animate-pulse rounded bg-line/70" />
          </div>
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <ShopCatalog title="Shop" description="Browse enterprise IT hardware by SKU, brand, and category." />
    </Suspense>
  );
}
