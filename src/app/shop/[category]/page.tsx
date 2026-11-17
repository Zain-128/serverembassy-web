import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { getCategoryBySlug, getProducts } from "@/lib/api/store";
import { breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = await getCategoryBySlug(category).catch(() => null);
  if (!cat) return {};

  const description =
    cat.description?.trim() ||
    `Shop ${cat.name} — new, used & certified refurbished enterprise IT hardware in stock and ready to ship.`;

  return {
    title: cat.name,
    description,
    alternates: { canonical: `/shop/${cat.slug}` },
    openGraph: { type: "website", title: cat.name, description },
  };
}

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

  const initialData = await getProducts({ category: cat.slug, limit: 24 }).catch(() => undefined);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: cat.name, path: `/shop/${cat.slug}` },
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
          categorySlug={cat.slug}
          title={cat.name}
          description={cat.description}
          initialData={initialData}
        />
      </Suspense>
    </>
  );
}
