import type { Product } from "@/types/store";

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url || url.includes("vercel.app")) {
    return "https://powerlinedevices.com";
  }
  return url.replace(/\/$/, "");
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
  const conditionLower = (product.condition || "").toLowerCase();
  const schemaCondition = conditionLower.includes("refurbished") || conditionLower.includes("renewed")
    ? "https://schema.org/RefurbishedCondition"
    : conditionLower.includes("new")
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition";

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    sku: product.sku,
    mpn: product.mpn || product.sku,
    description: productMetaDescription(product),
    ...(image ? { image: [image] } : {}),
    ...(product.brand?.name ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      priceValidUntil: nextYear.toISOString().split("T")[0],
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: schemaCondition,
      seller: {
        "@type": "Organization",
        name: "Power Line Devices",
        url: getSiteUrl(),
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "US",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price >= 199 ? "0.00" : "14.99",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
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

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Power Line Devices",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
