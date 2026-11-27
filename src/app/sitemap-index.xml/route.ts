import { absoluteUrl } from "@/lib/seo";
import { getProductSitemapCount, xmlEscape } from "@/lib/sitemap";

// Sitemap index (/sitemap-index.xml): the single entry point listed in robots.txt.
// (/sitemap.xml itself is reserved by Next.js because src/app/sitemap.ts exists.)
// Lists /sitemap/0.xml (pages + categories) and /sitemap/1..N.xml (products), using
// the same product count as generateSitemaps() in src/app/sitemap.ts.
// Cached like the sitemaps themselves; a failed rebuild keeps the last good one.
export const revalidate = 21600;

// One count call (with timeout + retry); allow for a slow API on Vercel.
export const maxDuration = 60;

export async function GET() {
  const productSitemaps = await getProductSitemapCount(); // throws on API failure
  const entries = Array.from({ length: productSitemaps + 1 }, (_, id) =>
    `  <sitemap>\n    <loc>${xmlEscape(absoluteUrl(`/sitemap/${id}.xml`))}</loc>\n  </sitemap>`,
  ).join("\n");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
