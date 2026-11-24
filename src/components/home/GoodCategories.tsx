"use client";

import Link from "next/link";
import type { Category } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import { useGetProductsQuery } from "@/store/storeApi";

import Image from "next/image";

const CATEGORY_IMAGES: Record<string, string> = {
  "network-switches": "/images/categories/network-switches.webp",
  "server-memory": "/images/categories/server-memory.webp",
  "power-supplies": "/images/categories/power-supplies.webp",
  "transceiver": "/images/categories/transceiver.webp",
  "firewalls": "/images/categories/firewalls.webp",
  "server-hard-drive": "/images/categories/server-hard-drive.webp",
  "server-hard-drives": "/images/categories/server-hard-drive.webp",
  "storage-devices": "/images/categories/server-hard-drive.webp",
  "solid-state-drives": "/images/categories/server-hard-drive.webp",
  "switches": "/images/categories/network-switches.webp",
  "memory": "/images/categories/server-memory.webp",
  "servers": "/images/home/hero-left-tower.png",
  "rack-servers": "/images/home/hero-left-tower.png",
};

const FALLBACK_CATEGORIES: Category[] = [
  { id: "c-shd", name: "Server Hard Drives", slug: "server-hard-drive" } as unknown as Category,
  { id: "c-switches", name: "Network Switches", slug: "network-switches" } as unknown as Category,
  { id: "c-psu", name: "Power Supplies", slug: "power-supplies" } as unknown as Category,
  { id: "c-mem", name: "Server Memory", slug: "server-memory" } as unknown as Category,
  { id: "c-trans", name: "Transceivers", slug: "transceiver" } as unknown as Category,
  { id: "c-fw", name: "Firewalls & Security", slug: "firewalls" } as unknown as Category,
];

function CategoryTile({ category, theme = "dark" }: { category: Category; theme?: "dark" | "light" }) {
  const isLight = theme === "light";
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

  const imageSrc =
    CATEGORY_IMAGES[category.slug] ||
    CATEGORY_IMAGES[category.name.toLowerCase().replace(/\s+/g, "-")] ||
    (FALLBACK_CATEGORIES.find((c) => c.name.toLowerCase() === category.name.toLowerCase())
      ? CATEGORY_IMAGES[
          FALLBACK_CATEGORIES.find((c) => c.name.toLowerCase() === category.name.toLowerCase())!.slug
        ]
      : null);

  return (
    <Link href={`/shop/${category.slug}`} className="group block text-center">
      <div
        className={`overflow-hidden rounded-xl bg-white p-3 sm:p-4 transition group-hover:scale-[1.03] group-hover:shadow-md ${
          isLight ? "border border-gray-100 shadow-sm" : "shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        }`}
      >
        <div className="aspect-square relative overflow-hidden rounded-lg flex items-center justify-center">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={category.name}
              width={382}
              height={382}
              className="h-full w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
          ) : product ? (
            <ProductVisual product={product} icon={icon} className="h-full" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-soft to-white"
              aria-hidden
            >
              <span className="font-display text-3xl font-bold text-brand/40">
                {category.name.slice(0, 1)}
              </span>
            </div>
          )}
        </div>
      </div>
      <p
        className={`mt-3 text-sm font-semibold uppercase tracking-[0.06em] transition group-hover:text-brand ${
          isLight ? "text-[#0b1220]" : "text-white"
        }`}
      >
        {category.name}
      </p>
      <p className={`mt-1 text-xs ${isLight ? "text-slate-500" : "text-white/45"}`}>
        {data?.total ? `${data.total} Items` : "Explore Catalog"}
      </p>
    </Link>
  );
}

export default function GoodCategories({
  categories,
  theme = "dark",
}: {
  categories: Category[];
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  const list = categories.length ? categories.slice(0, 6) : FALLBACK_CATEGORIES;

  return (
    <section className={isLight ? "bg-white text-[#0b1220]" : "bg-[#05070c] text-white"}>
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2
            className={`font-display text-xl font-bold uppercase tracking-[0.04em] sm:text-2xl ${
              isLight ? "text-[#0066ff]" : "text-white"
            }`}
          >
            Featured Hardware Categories
          </h2>
          <p className={`text-sm ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Don&apos;t miss out on this week&apos;s enterprise hardware deals
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {list.map((cat) => (
            <CategoryTile key={cat.id} category={cat} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}
