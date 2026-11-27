import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { flattenCategories } from "@/lib/nav";
import {
  getProductSitemapCount,
  getPublishedProductTotal,
  getSitemapCategories,
  getSitemapProducts,
  productSitemapUrl,
} from "@/lib/sitemap";

// Served from cache and rebuilt in the background at most every 6 hours
// (must be a literal number; keep equal to the one in src/app/sitemap-index.xml/route.ts).
// If a rebuild throws, Next.js keeps serving the last good version.
export const revalidate = 21600;

// Building a product sitemap through the fallback path (50 API calls of ~2 s,
// 5 at a time) takes ~20 s; give the serverless function room on Vercel.
export const maxDuration = 60;

// /sitemap/0.xml = static pages + categories; /sitemap/1..N.xml = products.
// Next.js calls this at build time (to pre-build ids) and again on every
// (re)generation to decide which ids exist (unknown id -> 404), so it must
// never shrink because of a slow API: the count call throws instead.
//
// At build time we return no ids, so nothing is pre-built and a deploy never
// depends on the product API (pre-building 15 sitemaps = hundreds of API calls,
// and one failed call fails the whole Vercel build). Each sitemap is built on
// its first request instead, then cached and refreshed in the background
// under the same rules.
export async function generateSitemaps() {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const productSitemaps = await getProductSitemapCount();
  return Array.from({ length: productSitemaps + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  id: number | string | Promise<number | string>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = Number(await id);
  if (!Number.isInteger(resolvedId) || resolvedId < 0) throw new Error(`[sitemap] bad id ${resolvedId}`);

  if (resolvedId === 0) {
    const categories = flattenCategories(await getSitemapCategories());
    const staticEntries: { path: string; priority: number }[] = [
      { path: "/", priority: 1 },
      { path: "/shop", priority: 0.9 },
      { path: "/about", priority: 0.5 },
      { path: "/contact", priority: 0.5 },
      { path: "/faq", priority: 0.4 },
    ];
    const policyEntries: { path: string; priority: number }[] = [
      { path: "/policies/privacy-policy", priority: 0.3 },
      { path: "/policies/terms-of-service", priority: 0.3 },
      { path: "/policies/shipping", priority: 0.3 },
      { path: "/policies/returns", priority: 0.3 },
    ];
    return [
      ...staticEntries.map(({ path, priority }) => ({
        url: absoluteUrl(path),
        changeFrequency: "daily" as const,
        priority,
      })),
      ...policyEntries.map(({ path, priority }) => ({
        url: absoluteUrl(path),
        changeFrequency: "yearly" as const,
        priority,
      })),
      ...categories.map((c) => ({
        url: absoluteUrl(`/shop/${encodeURIComponent(c.slug)}`),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  }

  const total = await getPublishedProductTotal();
  const products = await getSitemapProducts(resolvedId - 1, total);
  return products.map((p) => ({
    url: productSitemapUrl(p.slug),
    ...(p.updatedAt && !Number.isNaN(Date.parse(p.updatedAt))
      ? { lastModified: new Date(p.updatedAt).toISOString() }
      : {}),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
}
