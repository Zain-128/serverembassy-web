import "server-only";
import { storeApi } from "@/lib/api/config";
import { mapCategory } from "@/lib/mappers";
import { absoluteUrl } from "@/lib/seo";
import type { Category } from "@/types/store";

/**
 * Data access for the XML sitemaps (/sitemap-index.xml, /sitemap/[id].xml).
 *
 * Rules (see scripts/check-sitemaps.mjs):
 * - Everything here is cached for SITEMAP_REVALIDATE seconds, so Googlebot
 *   is served from cache instead of hitting the API on every request.
 *   Do NOT call the shared apiGet() helper from sitemap code: it uses
 *   `revalidate: 0`, which makes the whole route dynamic and disables caching.
 * - Nothing here ever returns "0 products" on failure. Every failure throws.
 *   During ISR revalidation a throw keeps the last good sitemap being
 *   served. A silently empty result would be cached and served for hours.
 */

// Keep in sync with `export const revalidate` in src/app/sitemap.ts and
// src/app/sitemap-index.xml/route.ts (route segment config must be a literal there).
export const SITEMAP_REVALIDATE = 21600; // 6 hours

// Google's limit is 50,000 URLs per file. 5,000 keeps each file small and fast.
export const PRODUCTS_PER_SITEMAP = 5000;

const FETCH_TIMEOUT_MS = 20_000;
const LEGACY_PAGE_SIZE = 100; // /products caps `limit` at 100
const LEGACY_CONCURRENCY = 5;

class SitemapDataError extends Error {
  constructor(message: string) {
    super(`[sitemap] ${message}`);
    this.name = "SitemapDataError";
  }
}

class NotFoundError extends SitemapDataError {}

async function sitemapFetch<T>(path: string): Promise<T> {
  const url = storeApi(path);
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: SITEMAP_REVALIDATE },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (res.status === 404) throw new NotFoundError(`404 from ${path}`);
      if (!res.ok) throw new SitemapDataError(`HTTP ${res.status} from ${path}`);
      return (await res.json()) as T;
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      lastError = err;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new SitemapDataError(`${path} failed after retry: ${String(lastError)}`);
}

type ListResponse = { items: { slug?: string; updatedAt?: string | null }[]; total: number };

export type SitemapProduct = { slug: string; updatedAt?: string };

/**
 * Number of published products, from one count call. Uses the lightweight
 * /products/sitemap endpoint, falling back to /products?limit=1 on APIs that
 * don't have it yet. Throws if the API fails or reports no products.
 */
export async function getPublishedProductTotal(): Promise<number> {
  let res: ListResponse;
  try {
    res = await sitemapFetch<ListResponse>("/products/sitemap?limit=1");
  } catch (err) {
    if (!(err instanceof NotFoundError)) throw err;
    res = await sitemapFetch<ListResponse>("/products?limit=1");
  }
  const total = Number(res?.total);
  if (!Number.isFinite(total) || total <= 0) {
    throw new SitemapDataError(`API reported ${res?.total} products; refusing to publish an empty sitemap`);
  }
  return total;
}

export async function getProductSitemapCount(): Promise<number> {
  return Math.ceil((await getPublishedProductTotal()) / PRODUCTS_PER_SITEMAP);
}

function clean(items: ListResponse["items"]): SitemapProduct[] {
  return items
    .filter((p): p is { slug: string; updatedAt?: string | null } => typeof p?.slug === "string" && p.slug.length > 0)
    .map((p) => ({ slug: p.slug, updatedAt: p.updatedAt ?? undefined }));
}

/** Products for product sitemap `chunk` (0-based). Throws instead of returning a short/empty list. */
export async function getSitemapProducts(chunk: number, total: number): Promise<SitemapProduct[]> {
  const expected = Math.min(PRODUCTS_PER_SITEMAP, total - chunk * PRODUCTS_PER_SITEMAP);
  if (expected <= 0) throw new SitemapDataError(`chunk ${chunk} is beyond ${total} products`);

  let products: SitemapProduct[];
  try {
    // One call per sitemap: slug + updatedAt only, stable _id order.
    const res = await sitemapFetch<ListResponse>(
      `/products/sitemap?page=${chunk + 1}&limit=${PRODUCTS_PER_SITEMAP}`,
    );
    products = clean(res.items ?? []);
  } catch (err) {
    if (!(err instanceof NotFoundError)) throw err;
    products = await getSitemapProductsLegacy(chunk);
  }

  // Allow small drift (products published/unpublished between calls), but
  // never publish a sitemap that is empty or mostly missing.
  if (products.length === 0 || products.length < expected * 0.9) {
    throw new SitemapDataError(`chunk ${chunk}: got ${products.length} products, expected about ${expected}`);
  }
  return products;
}

// Fallback for APIs without /products/sitemap: 50 pages of 100, 5 at a time.
// Sorted by SKU so pages don't shuffle between calls the way createdAt ties do.
async function getSitemapProductsLegacy(chunk: number): Promise<SitemapProduct[]> {
  const pagesPerChunk = PRODUCTS_PER_SITEMAP / LEGACY_PAGE_SIZE;
  const firstPage = chunk * pagesPerChunk + 1;
  const out: SitemapProduct[] = [];
  for (let i = 0; i < pagesPerChunk; i += LEGACY_CONCURRENCY) {
    const batch = await Promise.all(
      Array.from({ length: Math.min(LEGACY_CONCURRENCY, pagesPerChunk - i) }, (_, j) =>
        sitemapFetch<ListResponse>(`/products?page=${firstPage + i + j}&limit=${LEGACY_PAGE_SIZE}&sort=sku`),
      ),
    );
    for (const page of batch) out.push(...clean(page.items ?? []));
    if (batch.some((p) => (p.items?.length ?? 0) < LEGACY_PAGE_SIZE)) break;
  }
  return out;
}

export async function getSitemapCategories(): Promise<Category[]> {
  const res = await sitemapFetch<Record<string, unknown>[]>("/categories");
  if (!Array.isArray(res)) throw new SitemapDataError("categories response is not a list");
  return res.map(mapCategory);
}

/**
 * Absolute product URL for the sitemap. The slug is percent-encoded so that
 * characters like "#", "&", "<" or spaces produce a valid URL and valid XML.
 * Ordinary slugs (a-z, 0-9, "-") are unchanged.
 */
export function productSitemapUrl(slug: string): string {
  return absoluteUrl(`/product/${encodeURIComponent(slug)}`);
}

/** Escape text for XML (used by the hand-written sitemap index). */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
