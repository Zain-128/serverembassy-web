import type { MetadataRoute } from "next";
import { absoluteUrl, getProductSitemapChunks, PRODUCTS_PER_SITEMAP } from "@/lib/seo";
import { getCategoryTree, getProducts } from "@/lib/api/store";
import { flattenCategories } from "@/lib/nav";

// Rebuild at most once a day. If a rebuild throws, Next.js keeps serving the
// previous good version instead of an empty or 404 sitemap.
export const revalidate = 86400;

const API_PAGE_SIZE = 100; // API caps limit at 100
const CONCURRENCY = 5; // parallel API calls per sitemap (was 50 at once)

async function fetchPage(page: number) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await getProducts({ page, limit: API_PAGE_SIZE });
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw new Error("unreachable");
}

export async function generateSitemaps() {
  const productSitemaps = await getProductSitemapChunks();
  return Array.from({ length: productSitemaps + 1 }, (_, i) => ({ id: i }));
}

export default async function sitemap({
  id,
}: {
  id: number | Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const resolvedId = Number(await id);
  if (resolvedId === 0) {
    const tree = await getCategoryTree().catch(() => []);
    const categories = flattenCategories(tree);
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
        url: absoluteUrl(`/shop/${c.slug}`),
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ];
  }

  // id 1..N map to contiguous blocks of PRODUCTS_PER_SITEMAP products each,
  // fetched as a batch of API_PAGE_SIZE-sized pages (PRODUCTS_PER_SITEMAP is a multiple of it).
  const chunkIndex = resolvedId - 1;
  const startPage = (chunkIndex * PRODUCTS_PER_SITEMAP) / API_PAGE_SIZE + 1;
  const pagesToFetch = PRODUCTS_PER_SITEMAP / API_PAGE_SIZE;

  const pages: Awaited<ReturnType<typeof getProducts>>[] = [];
  for (let i = 0; i < pagesToFetch; i += CONCURRENCY) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(CONCURRENCY, pagesToFetch - i) }, (_, j) =>
        fetchPage(startPage + i + j),
      ),
    );
    pages.push(...batch);
    // Past the last product: stop early instead of requesting empty pages.
    if (batch.some((p) => p.items.length < API_PAGE_SIZE)) break;
  }

  return pages
    .flatMap((p) => p.items)
    .filter((p) => p.published)
    .map((p) => ({
      url: absoluteUrl(`/product/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
}
