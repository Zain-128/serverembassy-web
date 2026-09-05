import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api/store";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
  } catch {
    notFound();
  }
  if (!product.published) notFound();

  const relatedRes = await getProducts({
    category: product.category?.slug,
    limit: 5,
  }).catch(() => ({ items: [] }));
  const related = relatedRes.items.filter((p) => p.id !== product.id).slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
