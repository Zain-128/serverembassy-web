import type { MetadataRoute } from "next";
import { absoluteUrl, getProductSitemapChunks } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let productSitemaps = 1;
  try {
    productSitemaps = await getProductSitemapChunks();
  } catch {
    productSitemaps = 1;
  }
  const sitemaps = Array.from({ length: productSitemaps + 1 }, (_, id) =>
    absoluteUrl(`/sitemap/${id}.xml`),
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/cart", "/login"],
      },
    ],
    sitemap: sitemaps,
  };
}
