# XML sitemaps

## How they work

| URL | What | Source |
|---|---|---|
| `/robots.txt` | Lists only `/sitemap-index.xml`. Static, no API call. | `src/app/robots.ts` |
| `/sitemap-index.xml` | Sitemap index: `/sitemap/0.xml` … `/sitemap/N.xml` | `src/app/sitemap-index.xml/route.ts` |
| `/sitemap/0.xml` | Static pages, policies, categories | `src/app/sitemap.ts` |
| `/sitemap/1..N.xml` | Products, 5,000 per file, N = ceil(published products / 5000) | `src/app/sitemap.ts` |

`/sitemap.xml` is reserved by Next.js because `src/app/sitemap.ts` exists, so the index lives at `/sitemap-index.xml`.

All data comes from `src/lib/sitemap.ts`:

- **Cached (ISR).** The pages are pre-built and then rebuilt in the background at most every 6 hours (`revalidate = 21600`). Googlebot is served from cache and does not hit the API.
- **Never cache a bad result.** Every API failure, timeout (20 s, 1 retry), "0 products" or badly short product list throws. During a background rebuild, a throw keeps the last good sitemap being served. At build time, a throw fails the build. That's deliberate: deploying with the API down would otherwise publish empty sitemaps.
- **Don't use `apiGet()` from sitemap code.** It sets `revalidate: 0`, which turns the routes back into "render on every request".
- **Data source.** `GET /api/store/products/sitemap?page=&limit=5000` returns slug + updatedAt only, one call per sitemap (serverembassy-api). If the API doesn't have that endpoint (404), it falls back to `/products?sort=sku` in pages of 100, 5 at a time. The default `/products` sort returns HTTP 500 past offset 26,500, so the fallback must not use it.
- **URLs.** `NEXT_PUBLIC_SITE_URL` must be `https://www.powerlinedevices.com` (it also drives canonical tags). Slugs are percent-encoded, so `#`, `&`, `<` and spaces produce valid URLs and valid XML.

## Checking them

```bash
# live site (expected total = published products, see API ?limit=1 "total")
node scripts/check-sitemaps.mjs --base https://www.powerlinedevices.com --expected-total 65593

# local production build against the fake API
node scripts/mock-store-api.mjs &            # :4000, 65,593 products, behaves like prod
NEXT_PUBLIC_API_URL=http://localhost:4000 NEXT_PUBLIC_SITE_URL=https://www.powerlinedevices.com npm run build
PORT=3000 node .next/standalone/server.js &
node scripts/check-sitemaps.mjs --base http://localhost:3000 --site https://www.powerlinedevices.com --api http://localhost:4000
# simulate an outage: curl 'localhost:4000/__mode?fail=500'   (or fail=hang / fail=empty)
```

The check reads robots.txt, expands the index, then loads every sitemap 3 times in parallel and 3 times sequentially. It passes only if every load is 200 with the same URL count above 0, URLs are valid and absolute, there are no duplicates, and product URLs add up to the expected total (±1%).
