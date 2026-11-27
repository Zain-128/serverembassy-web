import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Static: lists only the sitemap index, which in turn lists exactly the
// sitemaps that exist. No API call here, so robots.txt can never list
// sitemaps that 404.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/cart", "/login"],
      },
    ],
    sitemap: absoluteUrl("/sitemap-index.xml"),
  };
}
