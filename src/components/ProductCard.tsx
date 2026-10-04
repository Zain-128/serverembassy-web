"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Cpu, HardDrive, Server, ShieldCheck, Heart } from "lucide-react";
import { discountPercent, formatMoney } from "@/lib/format";
import type { Product } from "@/types/store";
import Tilt3D from "@/components/3d/Tilt3D";
import { useIsTouch } from "@/lib/motion";
import AddToCartButton from "@/components/AddToCartButton";
import { useWishlist } from "@/lib/wishlist";

function Rating({ rating = 0, count = 0 }: { rating?: number; count?: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < filled ? "fill-amber-400 text-amber-400" : "text-line"}
          />
        ))}
      </span>
      <span className="text-muted">({count})</span>
    </div>
  );
}

function ProductHardwareFallback({ product }: { product: Product }) {
  const categorySlug = product.category?.slug?.toLowerCase() ?? "";
  const isDrive = categorySlug.includes("drive") || categorySlug.includes("hdd") || categorySlug.includes("ssd");
  const isCpu = categorySlug.includes("cpu") || categorySlug.includes("processor") || categorySlug.includes("memory");
  const Icon = isDrive ? HardDrive : isCpu ? Cpu : Server;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-page via-slate-100 to-brand-soft/30 p-4 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-line">
        <Icon size={24} className="text-brand" />
      </div>
      <span className="mt-2.5 font-mono text-[11px] font-bold tracking-wider text-navy/70">
        {product.sku}
      </span>
      <span className="mt-0.5 text-[10px] font-medium text-muted uppercase tracking-wider">
        {product.brand?.name ?? "Hardware"}
      </span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const showRating = (product.rating ?? 0) > 0 && (product.reviewCount ?? 0) > 0;
  const href = `/product/${product.slug}`;
  const glowRef = useRef<HTMLDivElement>(null);
  const touch = useIsTouch();
  const { isWishlisted, toggle } = useWishlist();
  const favorited = isWishlisted(product.id);

  const imageUrl =
    product.image ||
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url;

  function trackGlow(e: MouseEvent<HTMLDivElement>) {
    if (touch) return;
    const el = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Tilt3D className="h-full" maxTilt={7} scale={1.015}>
      <div
        ref={glowRef}
        onMouseMove={trackGlow}
        className="group preserve-3d relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-white shadow-card transition-[box-shadow,border-color] duration-500 hover:border-brand/30 hover:shadow-lift"
      >
        {/* cursor-following glow */}
        <div
          className="card-radial pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <div className="relative block overflow-hidden bg-page/30">
          {off > 0 ? (
            <span className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_4px_12px_rgba(163,75,60,0.4)]">
              Save {off}%
            </span>
          ) : null}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product.id, product.title);
            }}
            className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
            aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
            title={favorited ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={15}
              className={`transition-colors ${
                favorited ? "fill-red-500 text-red-500" : "text-slate-500 hover:text-red-500"
              }`}
            />
          </button>

          <Link href={href} className="block">
            <div className="relative aspect-[4/3] w-full overflow-hidden p-3 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.title}
                className="h-full w-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to hardware badge if image link breaks
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback-container")) {
                    const fallback = document.createElement("div");
                    fallback.className = "fallback-container h-full w-full flex flex-col items-center justify-center p-3 text-center bg-slate-50 rounded-xl";
                    fallback.innerHTML = `<span class="font-mono text-xs font-bold text-slate-700">${product.sku}</span><span class="text-[10px] text-slate-500 uppercase tracking-wider">${product.brand?.name ?? "Hardware"}</span>`;
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <ProductHardwareFallback product={product} />
            )}
          </div>

          <span className="absolute inset-x-3 bottom-3 z-20 flex translate-y-3 items-center justify-center gap-1 rounded-full bg-navy px-3 py-2 text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View in showroom <ArrowUpRight size={15} />
          </span>
        </Link>
      </div>

        <div className="relative z-10 flex flex-1 flex-col gap-1.5 px-4 pb-4 pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {product.brand?.name ?? "Brand"} · {product.category?.name ?? "Hardware"}
          </p>
          <Link
            href={href}
            className="line-clamp-2 min-h-[2.5rem] font-medium leading-snug text-navy transition-colors hover:text-brand"
          >
            {product.title}
          </Link>
          {showRating ? (
            <Rating rating={product.rating} count={product.reviewCount} />
          ) : (
            <span className="text-xs text-muted">New arrival</span>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
            <div className="flex items-baseline gap-2">
              <p className="font-display text-lg text-navy">{formatMoney(product.price)}</p>
              {product.compareAtPrice ? (
                <p className="text-sm text-muted line-through">
                  {formatMoney(product.compareAtPrice)}
                </p>
              ) : null}
            </div>
            <AddToCartButton
              productId={product.id}
              label="Add"
              className="rounded-full bg-navy px-3.5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.04] hover:bg-brand hover:shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
            />
          </div>
        </div>
      </div>
    </Tilt3D>
  );
}