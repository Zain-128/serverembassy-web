# Server Embassy Storefront

Next.js storefront for the Server Embassy ecommerce site. Catalog, cart, roles/auth, checkout, quotes, and newsletter are driven by the REST API (`serverembassy-api`) over HTTP. The customer login/account pages use authenticated order history.

## Run

```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL (default http://localhost:4000)
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel (separate app): `../serverembassy-admin` on port **5174**. Backend: `../serverembassy-api` on port **4000** (must be running).

## Data

- **Catalog, categories, brands, banners, settings, CMS pages, checkout** — fetched from `GET /api/store/*`, `POST /api/checkout` via RTK Query (`src/store/storeApi.ts`) and server-side fetchers (`src/lib/api/store.ts`).
- **Auth** — customer sign-in/register via `POST /api/auth/customer/login` and `POST /api/auth/register`; token stored in `localStorage` (`src/store/authSlice.ts`). `/account` shows authenticated order history (`/api/store/me/orders`).
- **Cart** — persisted locally under the `se-cart` key; totals are client-side approximations (shipping/tax are finalized by the API at checkout).