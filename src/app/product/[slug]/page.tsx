import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api/store";
import { breadcrumbJsonLd, productImageUrl, productJsonLd, productMetaDescription } from "@/lib/seo";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product || !product.published) return {};

  const description = productMetaDescription(product);
  const image = productImageUrl(product);

  return {
    title: product.title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

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

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    ...(product.category
      ? [{ name: product.category.name, path: `/shop/${product.category.slug}` }]
      : []),
    { name: product.title, path: `/product/${product.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
