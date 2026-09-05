import { notFound } from "next/navigation";
import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";
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
    <Suspense>
      <ShopCatalog
        categorySlug={cat.slug}
        title={cat.name}
        description={cat.description}
      />
    </Suspense>
  );
}
