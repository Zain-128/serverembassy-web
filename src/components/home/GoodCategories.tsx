"use client";

import Link from "next/link";
import type { Category } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import { useGetProductsQuery } from "@/store/storeApi";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-1", name: "ACCESSORIES", slug: "accessories", count: 5 } as unknown as Category,
  { id: "cat-2", name: "phone cases", slug: "phone-cases", count: 8 } as unknown as Category,
  { id: "cat-3", name: "phone glasses", slug: "phone-glasses", count: 50 } as unknown as Category,
  { id: "cat-4", name: "headphones", slug: "headphones", count: 6 } as unknown as Category,
  { id: "cat-5", name: "mobile phones", slug: "mobile-phones", count: 4 } as unknown as Category,
  { id: "cat-6", name: "chargers", slug: "chargers", count: 9 } as unknown as Category,
];

function CategoryTile({ category }: { category: Category }) {
  const isFallback = !category.slug || category.slug.startsWith("cat-");
  const { data } = useGetProductsQuery(
    {
      category: category.slug,
      limit: 1,
      inStock: true,
    },
    { skip: isFallback }
  );
  const product = data?.items?.[0];
  const count = (category as unknown as { count?: number }).count ?? data?.total ?? 0;
  const icon =
    category.icon ??
    (category.slug.includes("drive")
      ? "hdd"
      : category.slug.includes("switch")
        ? "switch"
        : "network");

  return (
    <Link href={`/shop/${category.slug}`} className="group block text-center">
      <div className="overflow-hidden rounded-xl bg-white p-4 transition group-hover:ring-2 group-hover:ring-brand/50">
        <div className="aspect-square overflow-hidden rounded-lg">
          {product ? (
            <ProductVisual product={product} icon={icon} className="h-full" />
          ) : (
            <div
              className="flex h-full items-center justify-center bg-gradient-to-br from-brand-soft to-white"
              aria-hidden
            >
              <span className="font-display text-3xl font-bold text-brand/40">
                {category.name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.06em] text-white transition group-hover:text-brand">
        {category.name}
      </p>
      <p className="mt-1 text-xs text-white/45">
        {count} {count === 1 ? "Item" : "Items"}
      </p>
    </Link>
  );
}

export default function GoodCategories({ categories }: { categories: Category[] }) {
  const list = categories.length ? categories.slice(0, 6) : FALLBACK_CATEGORIES;

  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.04em] text-white sm:text-2xl">
            OUR GOOD CATEGORIES
          </h2>
          <p className="text-sm text-white/50">Dont miss out on this waek deals</p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {list.map((cat) => (
            <CategoryTile key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
