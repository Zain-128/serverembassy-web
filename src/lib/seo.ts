import type { Product } from "@/types/store";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://serverembassy-web.vercel.app").replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productImageUrl(product: Product): string | null {
  const url =
    product.image || product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url;
  if (!url) return null;
  return /^https?:\/\//.test(url) ? url : absoluteUrl(url);
}

export function productMetaDescription(product: Product): string {
  const base = product.description?.trim();
  if (base) return base.length > 160 ? `${base.slice(0, 157)}...` : base;
  const brand = product.brand?.name ? `${product.brand.name} ` : "";
  return `${brand}${product.title} — ${product.condition}, ${product.warranty} warranty. In stock enterprise IT hardware from Power Line Devices.`;
}

export function productJsonLd(product: Product) {
  const image = productImageUrl(product);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    description: productMetaDescription(product),
    ...(image ? { image: [image] } : {}),
    ...(product.brand?.name ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition:
        product.condition === "New"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
