"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Lock, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import FreeShippingBar from "@/components/FreeShippingBar";
import ProductVisual from "@/components/ProductVisual";
import { formatMoney } from "@/lib/format";
import { useGetProductsQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";
import ProductCard from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { StateBox } from "@/components/ui/States";
import SectionHeader from "@/components/ui/SectionHeader";
import { EASE } from "@/lib/motion";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, shipping, tax, total, remainingForFreeShipping } =
    useCart();
  const { data: suggestionRes, isLoading: suggestionsLoading } = useGetProductsQuery(
    { limit: 4, maxPrice: remainingForFreeShipping + 20, inStock: true },
    { skip: remainingForFreeShipping <= 0 },
  );
  const suggestions = suggestionRes?.items ?? [];

  if (lines.length === 0) {
    return (
      <div className="container-se py-16">
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-navy">
          Shopping cart
        </h1>
        <div className="mt-8">
          <StateBox
            icon={<ShoppingBag size={26} />}
            title="Your cart is empty"
            body="Browse the catalog and add tested enterprise hardware to your order."
            cta={{ label: "Shop the catalog", href: "/shop" }}
          />
        </div>
        {suggestions.length ? (
          <div className="mt-12">
            <SectionHeader eyebrow="Popular" title="You might also like" href="/shop" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="container-se py-8">
      <div className="mb-6 flex items-end justify-between border-b border-line pb-6">
        <div>
          <nav className="text-xs text-muted">
            <Link href="/" className="transition-colors hover:text-brand">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-navy">Cart</span>
          </nav>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
            Shopping cart
          </h1>
        </div>
        <p className="hidden text-sm text-muted sm:block">
          {lines.length} {lines.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* line items */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {lines.map(({ product, qty }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-page/60 ring-1 ring-line">
                    <ProductVisual
                      product={product}
                      icon={product.category?.slug?.includes("drive") ? "hdd" : "network"}
                      className="h-20"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${product.slug}`}
                      className="line-clamp-2 font-medium text-navy transition-colors hover:text-brand"
                    >
                      {product.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">SKU {product.sku}</p>
                    <button
                      type="button"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-sale transition hover:text-red-700"
                      onClick={() => remove(product.id)}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="w-16 text-sm text-muted">{formatMoney(product.price)}</span>
                  <div className="inline-flex items-center rounded-full border border-line bg-white">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="grid h-9 w-9 place-items-center text-muted transition hover:text-brand disabled:opacity-40"
                      onClick={() => setQty(product.id, qty - 1)}
                      disabled={qty <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="grid h-9 w-9 place-items-center text-muted transition hover:text-brand"
                      onClick={() => setQty(product.id, qty + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="w-24 text-right font-semibold text-navy">
                    {formatMoney(product.price * qty)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <FreeShippingBar />
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-medium">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="font-medium">{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Est. tax</span>
              <span className="font-medium">{formatMoney(tax)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-navy">
              <span>Total</span>
              <span className="text-brand">{formatMoney(total)}</span>
            </div>
          </div>
          <Link href="/checkout" className="btn btn-primary group w-full">
            Proceed to checkout
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/shop" className="btn btn-outline w-full">
            Continue shopping
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <Lock size={12} /> Secure checkout · Encrypted
          </p>
        </aside>
      </div>

      {remainingForFreeShipping > 0 ? (
        <section className="mt-12">
          <SectionHeader
            eyebrow="Add more"
            title="Unlock free shipping"
            description={
              remainingForFreeShipping > 0
                ? `Add just ${formatMoney(remainingForFreeShipping)} more to get free shipping.`
                : undefined
            }
            href="/shop"
          />
          {suggestionsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : suggestions.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}