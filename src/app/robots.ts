import type { MetadataRoute } from "next";
import { absoluteUrl, getProductSitemapChunks } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const productSitemaps = await getProductSitemapChunks();
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
