import { notFound } from "next/navigation";
import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { getCategoryBySlug } from "@/lib/api/store";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  let cat;
  try {
    cat = await getCategoryBySlug(category);
  } catch {
    notFound();
  }

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
      <ShopCatalog
        categorySlug={cat.slug}
        title={cat.name}
        description={cat.description}
      />
    </Suspense>
  );
}
