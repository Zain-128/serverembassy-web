import Link from "next/link";
import { Star } from "lucide-react";
import { discountPercent, formatMoney } from "@/lib/format";
import type { Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import AddToCartButton from "@/components/AddToCartButton";

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

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
  const showRating = (product.rating ?? 0) > 0 && (product.reviewCount ?? 0) > 0;

  return (
    <article className="group card flex h-full flex-col overflow-hidden rounded-2xl!">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden">
        {off > 0 ? (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-sale px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_4px_12px_rgba(163,75,60,0.4)]">
            Save {off}%
          </span>
        ) : null}
        <ProductVisual
          product={product}
          icon={icon}
          className="aspect-[4/3] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-navy px-3 py-2 text-center text-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Quick view →
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {product.brand?.name ?? "Brand"} · {product.category?.name ?? "Hardware"}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 min-h-[2.5rem] font-medium leading-snug transition-colors hover:text-brand"
        >
          {product.title}
        </Link>
        {showRating ? <Rating rating={product.rating} count={product.reviewCount} /> : <span className="text-xs text-muted">New arrival</span>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
          <div className="flex items-baseline gap-2">
            <p className="font-display text-lg text-navy">{formatMoney(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-muted line-through">{formatMoney(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <AddToCartButton productId={product.id} label="Add" className="rounded-full bg-navy px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand" />
        </div>
      </div>
    </article>
  );
}