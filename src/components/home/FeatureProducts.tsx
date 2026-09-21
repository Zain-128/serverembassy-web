"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import AddToCartButton from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/format";
import { useGetProductsQuery } from "@/store/storeApi";

const FALLBACK_TABS = [
  { slug: "server-hard-drives", name: "SERVER HARD DRIVES" },
  { slug: "power-supplies", name: "POWER SUPPLIES" },
  { slug: "solid-state-drives", name: "SOLID STATE DRIVES" },
  { slug: "server-memory", name: "SERVER MEMORY" },
  { slug: "network-switches", name: "NETWORK SWITCHES" },
];

function FeatureCard({ product }: { product: Product }) {
  const icon = product.category?.slug?.includes("drive")
    ? "hdd"
    : product.category?.slug?.includes("switch")
      ? "switch"
      : "network";
  const compare =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden rounded-xl bg-white p-3 transition hover:ring-2 hover:ring-brand/50"
      >
        <span
          className={`absolute left-3 top-3 z-10 text-xs font-semibold ${
            inStock ? "text-brand" : "text-sale"
          }`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
        <div className="aspect-[4/5] overflow-hidden rounded-lg pt-4">
          <ProductVisual product={product} icon={icon} className="h-full" />
        </div>
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className="mt-3 line-clamp-2 min-h-[2.6rem] text-sm font-medium leading-snug text-white transition hover:text-brand"
      >
        {product.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        {compare ? (
          <span className="text-sm text-white/55 line-through">{formatMoney(compare)}</span>
        ) : null}
        <span className="text-base font-bold text-[#39ff14]">{formatMoney(product.price)}</span>
      </div>
      <AddToCartButton
        productId={product.id}
        label="ADD TO CART"
        className="mt-4 w-full rounded-md bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition hover:brightness-110"
      />
    </article>
  );
}

function pickTabs(categories: Category[]) {
  if (!categories.length) return FALLBACK_TABS;
  return categories.slice(0, 5).map((c) => ({ slug: c.slug, name: c.name }));
}

export default function FeatureProducts({
  categories,
  fallbackProducts = [],
}: {
  categories: Category[];
  fallbackProducts?: Product[];
}) {
  const tabs = useMemo(() => pickTabs(categories), [categories]);
  const [active, setActive] = useState(tabs[0]?.slug ?? "");

  useEffect(() => {
    if (!tabs.some((t) => t.slug === active) && tabs[0]) {
      setActive(tabs[0].slug);
    }
  }, [tabs, active]);

  const { data, isFetching } = useGetProductsQuery(
    {
      category: active || undefined,
      featured: true,
      inStock: true,
      limit: 4,
    },
    { skip: !active },
  );

  const { data: categoryAll } = useGetProductsQuery(
    {
      category: active || undefined,
      inStock: true,
      limit: 4,
      sort: "newest",
    },
    { skip: !active || (data?.items?.length ?? 0) > 0 },
  );

  const products =
    (data?.items?.length ? data.items : categoryAll?.items)?.slice(0, 4) ??
    fallbackProducts.slice(0, 4);

  return (
    <section id="featured" className="bg-[#05070c] text-white">
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em] text-white sm:text-2xl">
            Feature Products
          </h2>
          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2 overflow-x-auto"
            aria-label="Feature product categories"
          >
            {tabs.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setActive(tab.slug)}
                  className={`relative whitespace-nowrap pb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition sm:text-xs ${
                    isActive ? "text-white" : "text-white/55 hover:text-white"
                  }`}
                >
                  {tab.name}
                  {isActive ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {isFetching && !products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <FeatureCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center text-sm text-white/55">
            No products in this category yet.{" "}
            <Link href="/shop" className="text-brand hover:underline">
              Browse the full catalog
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}
