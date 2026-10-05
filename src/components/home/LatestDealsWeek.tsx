"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import AddToCartButton from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/format";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

function endOfWeekUtc(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  const end = new Date(now);
  end.setUTCDate(now.getUTCDate() + daysUntilSunday);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function useCountdown(targetIso: string | null) {
  const target = useMemo(() => {
    if (targetIso) {
      const d = new Date(targetIso);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return endOfWeekUtc();
  }, [targetIso]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);

  return `${pad(days)} : ${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

import { useGetProductsQuery } from "@/store/storeApi";

const DEAL_IMAGES = [
  "/images/home/deal-speakers.png",
  "/images/home/deal-hdd.png",
  "/images/home/deal-psu.png",
  "/images/home/deal-network-1.png",
  "/images/home/deal-powerline.png",
  "/images/home/deal-network-2.png",
];

function DealCard({
  product,
  index = 0,
  theme = "dark",
}: {
  product: Product;
  index?: number;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
  const compare =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const inStock = product.stock > 0;
  
  const imageUrl =
    product.image ||
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    DEAL_IMAGES[index % DEAL_IMAGES.length];

  const { isWishlisted, toggle } = useWishlist();
  const favorited = isWishlisted(product.id);

  return (
    <article className="group relative flex min-w-[180px] flex-1 flex-col sm:min-w-0">
      <div className="mb-2 flex items-center justify-between">
        <p className={`text-xs font-semibold ${inStock ? "text-[#0066ff]" : "text-sale"}`}>
          {inStock ? "In Stock" : "Out of Stock"}
        </p>
        <button
          type="button"
          onClick={() => toggle(product.id, product.title)}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          title={favorited ? "Remove from wishlist" : "Add to wishlist"}
          className="text-slate-400 transition hover:scale-110 hover:text-red-500"
        >
          <Heart size={16} strokeWidth={2} className={favorited ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>
      <Link
        href={`/product/${product.slug}`}
        className={`block overflow-hidden rounded-xl bg-white p-2 transition hover:scale-[1.03] group-hover:shadow-md ${
          isLight ? "border border-gray-100 shadow-sm" : "shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        }`}
      >
        <div className="aspect-[4/3] relative overflow-hidden rounded-lg flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="h-full w-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <ProductVisual product={product} icon={icon} className="h-full" />
          )}
        </div>
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className={`mt-3 line-clamp-2 min-h-[2.6rem] text-sm font-medium leading-snug transition hover:text-brand ${
          isLight ? "text-[#0b1220]" : "text-white"
        }`}
      >
        {product.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        {compare ? (
          <span className={`text-sm line-through ${isLight ? "text-slate-400" : "text-white/55"}`}>
            {formatMoney(compare)}
          </span>
        ) : null}
        <span className={`text-base font-bold ${isLight ? "text-emerald-600" : "text-[#00d632]"}`}>
          {formatMoney(product.price)}
        </span>
      </div>
      <AddToCartButton
        productId={product.id}
        label="ADD TO CART"
        className="mt-4 w-full rounded-md bg-gradient-to-b from-[#0066ff] to-[#004dc0] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(0,102,255,0.35)] transition hover:brightness-110 disabled:opacity-50"
      />
    </article>
  );
}

export default function LatestDealsWeek({
  products = [],
  theme = "dark",
}: {
  products?: Product[];
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  
  const { data: dealsRes } = useGetProductsQuery({ deal: true, limit: 6 });
  const { data: fallbackRes } = useGetProductsQuery({ limit: 6 }, { skip: Boolean(dealsRes?.items?.length) });

  const apiDeals = dealsRes?.items?.length ? dealsRes.items : fallbackRes?.items ?? [];
  const list = apiDeals.length > 0 ? apiDeals.slice(0, 6) : products.slice(0, 6);

  const endsAt =
    list
      .map((p) => p.dealEndsAt)
      .filter((v): v is string => Boolean(v))
      .sort()[0] ?? null;
  const clock = useCountdown(endsAt);

  if (!list.length) return null;

  return (
    <section id="deals" className={isLight ? "bg-[#f8fafc] text-[#0b1220]" : "bg-[#05070c] text-white"}>
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2
            className={`font-display text-xl font-bold uppercase tracking-[0.04em] sm:text-2xl ${
              isLight ? "text-[#0066ff]" : "text-white"
            }`}
          >
            Latest Deals for This Week
          </h2>
          <div
            className="rounded-full bg-brand px-4 py-2 font-mono text-sm font-semibold tracking-wide text-white tabular-nums shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
            aria-label={`Deal ends in ${clock}`}
          >
            {clock}
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {list.map((product, i) => (
            <DealCard key={product.id} product={product} index={i} theme={theme} />
          ))}
        </div>
      </div>
    </section>
  );
}
