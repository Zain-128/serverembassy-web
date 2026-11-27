#!/usr/bin/env node
// Local stand-in for the store API (https://api.serverembassy.com/api/store/*),
// used only to reproduce and test the sitemap behaviour. Not used in production.
//
//   node scripts/mock-store-api.mjs            # listens on :4000, 65,593 products
//
// Control endpoint (change behaviour without restarting):
//   GET /__mode?latency=1500     every response delayed 1.5 s
//   GET /__mode?fail=500         every /api/store/* call returns HTTP 500
//   GET /__mode?fail=hang        every call hangs (never answers)
//   GET /__mode?fail=empty       /products returns { items: [], total: 0 }
//   GET /__mode?fail=nolean      no /products/sitemap endpoint (like the API before this change)
//   GET /__mode?fail=ok&latency=0  back to normal
//   GET /__mode?total=31000      change the number of products
//   GET /__stats                 request counters
import http from "node:http";

const PORT = Number(process.env.MOCK_API_PORT || 4000);
let TOTAL = Number(process.env.MOCK_TOTAL || 65593);
// Like production (measured 27 Nov 2026): with the default sort (newest first),
// /products returns HTTP 500 for every page whose offset is >= 26,500.
// sort=sku / price_* work to the last page. Set MOCK_DEEP_FAIL=0 to disable.
const DEEP_FAIL_OFFSET = process.env.MOCK_DEEP_FAIL === "0" ? Infinity : 26500;
const mode = { latency: 0, fail: "ok" };
const stats = { products: 0, productsCount: 0, sitemapProducts: 0, other: 0 };

// A few slugs with characters that must be escaped/encoded in XML.
const special = { 7: "lt4321huf#pbf", 8: "r&d-kit-<v2>", 9: "cisco asa 5505" };
const product = (i) => ({
  id: `p${i}`,
  slug: special[i] ?? `part-${String(i).padStart(6, "0")}`,
  title: `Part ${i}`,
  sku: `SKU-${i}`,
  price: 10,
  stock: 1,
  status: "published",
  images: [],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: new Date(Date.UTC(2026, 10, 1) + i * 60_000).toISOString(),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const json = (res, code, body) => {
  res.writeHead(code, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname === "/__mode") {
      for (const k of ["latency", "fail"]) if (url.searchParams.has(k)) mode[k] = url.searchParams.get(k);
      if (url.searchParams.has("total")) TOTAL = Number(url.searchParams.get("total"));
      mode.latency = Number(mode.latency) || 0;
      return json(res, 200, mode);
    }
    if (url.pathname === "/__stats") return json(res, 200, stats);

    if (mode.fail === "hang") return; // never respond
    if (mode.latency) await sleep(mode.latency);
    if (mode.fail === "500") return json(res, 500, { error: "simulated failure" });

    const p = url.pathname;
    // fail=nolean: behave like the current production API, which has no
    // /products/sitemap endpoint (it would be treated as a product slug -> 404).
    if (mode.fail === "nolean" && p === "/api/store/products/sitemap") return json(res, 404, { error: "Product not found" });
    if (p === "/api/store/products" || p === "/api/store/products/sitemap") {
      const lean = p.endsWith("/sitemap");
      if (lean) stats.sitemapProducts++;
      else stats.products++;
      const max = lean ? 5000 : 100; // real API caps /products at 100
      const limit = Math.min(max, Math.max(1, Number(url.searchParams.get("limit")) || 24));
      const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
      if (limit === 1) stats.productsCount++;
      if (mode.fail === "empty") return json(res, 200, { items: [], total: 0, page, limit, totalPages: 0 });
      const start = (page - 1) * limit;
      const sort = url.searchParams.get("sort");
      if (!lean && (!sort || sort === "newest") && start >= DEEP_FAIL_OFFSET)
        return json(res, 500, { error: "Internal server error" });
      const items = [];
      for (let i = start; i < Math.min(TOTAL, start + limit); i++) {
        const full = product(i);
        items.push(lean ? { slug: full.slug, updatedAt: full.updatedAt } : full);
      }
      return json(res, 200, { items, total: TOTAL, page, limit, totalPages: Math.ceil(TOTAL / limit) });
    }
    if (p === "/api/store/products/count") {
      stats.productsCount++;
      if (mode.fail === "empty") return json(res, 200, { total: 0 });
      return json(res, 200, { total: TOTAL });
    }
    stats.other++;
    if (p === "/api/store/categories") return json(res, 200, [{ id: "c1", slug: "server-memory", name: "Server Memory", children: [] }]);
    if (["/api/store/brands", "/api/store/banners", "/api/store/pages", "/api/store/categories/homepage"].includes(p))
      return json(res, 200, []);
    return json(res, 404, { error: "not found" });
  })
  .listen(PORT, () => console.log(`mock store API on :${PORT} (${TOTAL} products)`));
