import type { Metadata } from "next";
import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { getProducts } from "@/lib/api/store";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse enterprise IT hardware by SKU, brand, and category — servers, storage, networking, and components. New, used & certified refurbished.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const initialData = await getProducts({ limit: 24 }).catch(() => undefined);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
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
          title="Shop"
          description="Browse enterprise IT hardware by SKU, brand, and category."
          initialData={initialData}
        />
      </Suspense>
    </>
  );
}
