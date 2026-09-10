"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Settings2, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { StateBox } from "@/components/ui/States";
import { useGetBrandsQuery, useGetCategoryTreeQuery, useGetProductsQuery } from "@/store/storeApi";
import Link from "next/link";
import type { Category } from "@/types/store";

type SortKey = "featured" | "price-asc" | "price-desc" | "latest";

const sortMap: Record<SortKey, "price_asc" | "price_desc" | "sku" | undefined> = {
  featured: undefined,
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  latest: "sku",
};

const sortLabels: Record<SortKey, string> = {
  featured: "Default sorting",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  latest: "Sort by SKU",
};

function activeFilterCount(props: { q?: string; categorySlug?: string; brandSlug?: string; maxPrice?: number; inStock?: boolean }) {
  let n = 0;
  if (props.brandSlug && props.brandSlug !== "all") n++;
  if (props.categorySlug && props.categorySlug !== "all") n++;
  if (props.maxPrice && props.maxPrice < 900) n++;
  if (props.inStock) n++;
  return n;
}

export default function ShopCatalog({
  categorySlug,
  title,
  description,
}: {
  categorySlug?: string;
  title: string;
  description?: string;
}) {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const brandFromUrl = (params.get("brand") ?? "all").trim() || "all";
  const [brandSlug, setBrandSlug] = useState<string>(brandFromUrl);
  const [prevBrandFromUrl, setPrevBrandFromUrl] = useState<string>(brandFromUrl);
  if (prevBrandFromUrl !== brandFromUrl) {
    setPrevBrandFromUrl(brandFromUrl);
    setBrandSlug(brandFromUrl);
  }
  const [maxPrice, setMaxPrice] = useState(900);
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [page, setPage] = useState(1);

  const filterKey = `${q}::${categorySlug}::${brandSlug}::${maxPrice}::${inStock}::${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const { data: brands = [] } = useGetBrandsQuery();
  const { data: categories = [] } = useGetCategoryTreeQuery();
  const { data: productRes, isFetching } = useGetProductsQuery({
    q: q || undefined,
    category: categorySlug,
    brand: brandSlug === "all" ? undefined : brandSlug,
    maxPrice,
    inStock: inStock || undefined,
    sort: sortMap[sort],
    page,
    limit: 24,
  });
  const items = productRes?.items ?? [];
  const totalPages = productRes?.totalPages ?? 1;

  const goToPage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const flatCategories = useMemo(() => {
    const out: Category[] = [];
    const walk = (nodes: Category[]) => {
      nodes.forEach((n) => {
        out.push(n);
        if (n.children?.length) walk(n.children);
      });
    };
    walk(categories);
    return out;
  }, [categories]);

  const activeCount = activeFilterCount({ brandSlug, categorySlug, maxPrice, inStock });

  return (
    <div className="container-se py-8">
      {/* page header */}
      <div className="mb-8 border-b border-line pb-6">
        <nav className="text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/shop" className="transition-colors hover:text-brand">Shop</Link>
          {title !== "Shop" ? (
            <>
              <span className="mx-1.5">/</span>
              <span className="text-navy">{title}</span>
            </>
          ) : null}
        </nav>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
          {title}
        </h1>
        {description ? <p className="mt-2 max-w-3xl text-muted">{description}</p> : null}
        {q ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-sm text-brand">
            Results for <strong>{q}</strong>
          </p>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* filters */}
        <aside className="h-fit overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line bg-gradient-to-br from-brand-soft/40 to-transparent px-5 py-4">
            <h2 className="flex items-center gap-2 font-display font-semibold text-navy">
              <SlidersHorizontal size={16} className="text-brand" /> Filters
            </h2>
            {activeCount > 0 ? (
              <button
                onClick={() => {
                  setBrandSlug("all");
                  setMaxPrice(900);
                  setInStock(false);
                  const qs = new URLSearchParams(params.toString());
                  qs.delete("brand");
                  const path = categorySlug ? `/shop/${categorySlug}` : "/shop";
                  const query = qs.toString();
                  router.replace(query ? `${path}?${query}` : path, { scroll: false });
                }}
                className="rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-brand-dark"
              >
                Clear {activeCount}
              </button>
            ) : null}
          </div>

          <div className="space-y-6 p-5">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-navy">
                <Settings2 size={14} className="text-brand" /> Category
              </p>
              <div className="mt-2.5 space-y-1">
                <Link
                  href="/shop"
                  className={`block rounded-lg px-3 py-1.5 text-sm transition ${categorySlug ? "text-muted hover:bg-page hover:text-navy" : "bg-brand-soft font-semibold text-brand"}`}
                >
                  All products
                </Link>
                {flatCategories
                  .filter((c) => !c.parentId || c.showOnHomepage)
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop/${c.slug}`}
                      className={`block rounded-lg px-3 py-1.5 text-sm transition ${categorySlug === c.slug ? "bg-brand-soft font-semibold text-brand" : "text-muted hover:bg-page hover:text-navy"}`}
                    >
                      {c.name}
                    </Link>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-navy">Brand</p>
              <div className="relative mt-2.5">
                <select
                  className="w-full appearance-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                  value={brandSlug}
                  onChange={(e) => {
                    const next = e.target.value;
                    setBrandSlug(next);
                    const qs = new URLSearchParams(params.toString());
                    if (next === "all") qs.delete("brand");
                    else qs.set("brand", next);
                    const path = categorySlug ? `/shop/${categorySlug}` : "/shop";
                    const query = qs.toString();
                    router.replace(query ? `${path}?${query}` : path, { scroll: false });
                  }}
                >
                  <option value="all">All brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.slug ?? b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-navy">Max price</p>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                  ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={900}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-brand"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted">
                <span>$50</span>
                <span>$900</span>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-navy">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="size-4 accent-brand"
              />
              In stock only
            </label>
          </div>
        </aside>

        {/* results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {isFetching && items.length === 0
                ? "Loading…"
                : `${productRes?.total ?? items.length} ${items.length === 1 ? "product" : "products"}`}
            </p>
            <div className="relative">
              <select
                className="appearance-none rounded-full border border-line bg-white px-4 py-2 pr-10 text-sm shadow-card outline-none transition focus:border-brand"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                {Object.entries(sortLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
            </div>
          </div>

          {isFetching && items.length === 0 ? (
            <ProductGridSkeleton count={6} />
          ) : items.length === 0 ? (
            <StateBox
              title="No products found"
              body="Try adjusting your filters or search terms to see more hardware."
              cta={{ label: "Clear filters", href: "/shop" }}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {items.length > 0 ? <Pagination page={page} totalPages={totalPages} onChange={goToPage} /> : null}
        </div>
      </div>
    </div>
  );
}