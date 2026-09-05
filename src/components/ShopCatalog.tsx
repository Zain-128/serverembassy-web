"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { useGetBrandsQuery, useGetCategoryTreeQuery, useGetProductsQuery } from "@/store/storeApi";
import type { Category } from "@/types/store";

type SortKey = "featured" | "price-asc" | "price-desc" | "latest";

const sortMap: Record<SortKey, "price_asc" | "price_desc" | "sku" | undefined> = {
  featured: undefined,
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  latest: "sku",
};

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

  return (
    <div className="container-se py-8">
      <div className="mb-6">
        <p className="text-sm text-muted">Home / Shop {title !== "Shop" ? `/ ${title}` : ""}</p>
        <h1 className="mt-1 text-3xl font-bold text-navy">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-muted">{description}</p> : null}
        {q ? (
          <p className="mt-2 text-sm">
            Results for <strong>{q}</strong>
          </p>
        ) : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-white p-5 shadow-card">
          <h2 className="font-semibold">Filters</h2>
          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-muted">Category</legend>
            <div className="mt-2 space-y-2 text-sm">
              {flatCategories
                .filter((c) => !c.parentId || c.showOnHomepage)
                .map((c) => (
                  <a key={c.id} href={`/shop/${c.slug}`} className="block hover:text-brand">
                    {c.name}
                  </a>
                ))}
            </div>
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-muted">Brand</legend>
            <select
              className="mt-2 w-full rounded-full border border-line bg-white px-4 py-2 transition focus:border-brand"
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
          </fieldset>
          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-muted">Max price (${maxPrice})</legend>
            <input
              type="range"
              min={50}
              max={900}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
          </fieldset>
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="size-4 accent-brand"
            />
            In stock only
          </label>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {isFetching && items.length === 0
                ? "Loading…"
                : `${productRes?.total ?? items.length} products`}
            </p>
            <select
              className="rounded-full border border-line bg-white px-4 py-2 text-sm shadow-card transition focus:border-brand"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Default sorting</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="latest">Sort by SKU</option>
            </select>
          </div>
          {isFetching && items.length === 0 ? (
            <ProductGridSkeleton count={6} />
          ) : items.length === 0 ? (
            <p className="rounded-2xl bg-white p-10 text-center text-muted ring-1 ring-line">
              No products match these filters.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        </div>
      </div>
    </div>
  );
}
