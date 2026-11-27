#!/usr/bin/env node
// Acceptance test for the product sitemaps.
//
//   node scripts/check-sitemaps.mjs --base https://www.powerlinedevices.com \
//        --expected-total 26100
//   node scripts/check-sitemaps.mjs --base http://localhost:3000 \
//        --site https://www.powerlinedevices.com --api http://localhost:4000
//
// --base            where to send requests (local build or the live site)
// --site            origin the <loc>/Sitemap URLs must use (default: --base)
// --expected-total  real number of published products, or
// --api             store API base URL to read the total from (/api/store/products?limit=1)
// --no-bust         don't add a cache-busting query string
//
// Steps: read robots.txt, expand any sitemap index, load every listed sitemap
// 3x in parallel then 3x sequentially. PASS only if every load is HTTP 200 with
// the same <loc> count > 0, URLs are valid absolute --site URLs with ISO
// lastmod, no duplicates, and the product URLs add up to the total (±1%).

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (!a.startsWith("--")) return acc;
    const next = all[i + 1];
    acc.push([a.slice(2), next && !next.startsWith("--") ? next : true]);
    return acc;
  }, []),
);
const base = String(args.base || "https://www.powerlinedevices.com").replace(/\/$/, "");
const site = String(args.site || base).replace(/\/$/, "");
const bust = !args["no-bust"];
const TIMEOUT_MS = Number(args.timeout || 60_000);

const problems = [];
const fail = (msg) => problems.push(msg);

async function load(url) {
  const target = new URL(url);
  const fetchUrl = new URL(target.pathname + target.search, base);
  if (bust) fetchUrl.searchParams.set("cb", Math.random().toString(36).slice(2));
  const t0 = Date.now();
  try {
    const res = await fetch(fetchUrl, {
      headers: { "cache-control": "no-cache", "user-agent": "check-sitemaps/1.0" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = await res.text();
    return { status: res.status, body, ms: Date.now() - t0 };
  } catch (e) {
    return { status: `ERR(${e.name})`, body: "", ms: Date.now() - t0 };
  }
}

const unescapeXml = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const locs = (xml) => [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) => m[1].trim());

function validateXml(name, xml) {
  if (/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(xml)) fail(`${name}: unescaped "&" in XML`);
  for (const raw of locs(xml)) {
    const url = unescapeXml(raw);
    if (/[<>"\s#]/.test(url)) fail(`${name}: URL has an illegal raw character: ${raw}`);
    if (!url.startsWith(site + "/")) fail(`${name}: URL not on ${site}: ${raw}`);
  }
  for (const m of xml.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/g)) {
    if (Number.isNaN(Date.parse(m[1])) || !/^\d{4}-\d{2}-\d{2}/.test(m[1])) fail(`${name}: bad lastmod ${m[1]}`);
  }
}

async function expectedTotal() {
  if (args["expected-total"]) return Number(args["expected-total"]);
  if (args.api) {
    const r = await fetch(`${String(args.api).replace(/\/$/, "")}/api/store/products?limit=1`);
    return (await r.json()).total;
  }
  return null;
}

const short = (u) => new URL(u).pathname;

async function main() {
  console.log(`check-sitemaps  base=${base}  site=${site}  ${new Date().toISOString()}`);
  const total = await expectedTotal();

  const robots = await load(`${site}/robots.txt`);
  if (robots.status !== 200) {
    fail(`robots.txt returned ${robots.status}`);
  }
  const listed = [...robots.body.matchAll(/^\s*Sitemap:\s*(\S+)/gim)].map((m) => m[1]);
  console.log(`robots.txt lists ${listed.length} sitemap URL(s): ${listed.map(short).join(", ")}`);
  for (const u of listed) if (!u.startsWith(site + "/")) fail(`robots.txt: ${u} is not on ${site}`);

  // Expand sitemap indexes.
  const sitemaps = [];
  for (const u of listed) {
    const r = await load(u);
    if (r.status === 200 && /<sitemapindex/.test(r.body)) {
      const children = locs(r.body).map(unescapeXml);
      console.log(`${short(u)} is an index of ${children.length}: ${children.map(short).join(", ")}`);
      validateXml(short(u), r.body);
      sitemaps.push(...children);
    } else sitemaps.push(u);
  }

  const results = {};
  // 3 parallel rounds (all sitemaps at once), then 3 sequential.
  for (let round = 0; round < 3; round++) {
    const rs = await Promise.all(sitemaps.map(load));
    rs.forEach((r, i) => (results[sitemaps[i]] ??= []).push({ ...r, kind: "par" }));
  }
  for (let round = 0; round < 3; round++) {
    for (const u of sitemaps) results[u].push({ ...(await load(u)), kind: "seq" });
  }

  console.log("\nsitemap              par1           par2           par3           seq1           seq2           seq3          result");
  let productUrls = 0;
  const seen = new Map();
  for (const u of sitemaps) {
    const rs = results[u];
    const counts = rs.map((r) => (r.status === 200 ? locs(r.body).length : null));
    const cells = rs.map((r, i) => `${r.status}:${counts[i] ?? "-"} ${(r.ms / 1000).toFixed(1)}s`.padEnd(15));
    const ok = rs.every((r) => r.status === 200) && counts.every((c) => c === counts[0]) && counts[0] > 0;
    console.log(`${short(u).padEnd(20)} ${cells.join("")}${ok ? "OK" : "FAIL"}`);
    if (!ok) fail(`${short(u)}: inconsistent or bad loads (${rs.map((r, i) => `${r.status}:${counts[i] ?? "-"}`).join(" ")})`);
    const good = rs.find((r) => r.status === 200);
    if (good) {
      validateXml(short(u), good.body);
      for (const l of locs(good.body)) {
        const url = unescapeXml(l);
        if (seen.has(url)) fail(`duplicate URL ${url} in ${short(u)} and ${seen.get(url)}`);
        else seen.set(url, short(u));
        if (new URL(url).pathname.startsWith("/product/")) productUrls++;
      }
    }
  }

  console.log(`\nproduct URLs across all sitemaps: ${productUrls}${total != null ? `  (expected ${total})` : ""}`);
  if (total != null) {
    const diff = Math.abs(productUrls - total) / Math.max(1, total);
    if (diff > 0.01) fail(`product URL total ${productUrls} is off by ${(diff * 100).toFixed(1)}% from ${total}`);
  } else console.log("(no --expected-total/--api given: total not checked)");

  const unique = [...new Set(problems)];
  if (unique.length) {
    console.log(`\nFAIL — ${unique.length} problem(s):`);
    unique.slice(0, 40).forEach((p) => console.log(`  - ${p}`));
    if (unique.length > 40) console.log(`  ... and ${unique.length - 40} more`);
    process.exit(1);
  }
  console.log("\nPASS");
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
