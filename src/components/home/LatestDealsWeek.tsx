"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import AddToCartButton from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/format";

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
      if (!Number.isNaN(d.getTime()) && d.getTime() > Date.now()) return d;
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

function DealCard({ product }: { product: Product }) {
  const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
  const compare =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const inStock = product.stock > 0;

  return (
    <article className="flex min-w-[180px] flex-1 flex-col sm:min-w-0">
      <p className={`mb-2 text-xs font-semibold ${inStock ? "text-brand" : "text-sale"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </p>
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-xl bg-white p-2 transition hover:ring-2 hover:ring-brand/50"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
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
        className="mt-4 w-full rounded-md bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition hover:brightness-110 disabled:opacity-50"
      />
    </article>
  );
}

export default function LatestDealsWeek({ products }: { products: Product[] }) {
  const list = products.slice(0, 6);
  const endsAt =
    list
      .map((p) => p.dealEndsAt)
      .filter((v): v is string => Boolean(v))
      .sort()[0] ?? null;
  const clock = useCountdown(endsAt);

  if (!list.length) return null;

  return (
    <section id="deals" className="bg-[#05070c] text-white">
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Latest Deals for THis Week
          </h2>
          <div
            className="rounded-full bg-brand px-4 py-2 font-mono text-sm font-semibold tracking-wide text-white tabular-nums shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
            aria-label={`Deal ends in ${clock}`}
          >
            {clock}
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {list.map((product) => (
            <DealCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
