"use client";

import Link from "next/link";
import FreeShippingBar from "@/components/FreeShippingBar";
import ProductVisual from "@/components/ProductVisual";
import { formatMoney } from "@/lib/format";
import { useGetProductsQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";
import ProductCard from "@/components/ProductCard";

export default function CartPage() {
  const { lines, setQty, remove, subtotal, shipping, tax, total, remainingForFreeShipping } =
    useCart();
  const { data: suggestionRes } = useGetProductsQuery(
    { limit: 4, maxPrice: remainingForFreeShipping + 20, inStock: true },
    { skip: remainingForFreeShipping <= 0 },
  );
  const suggestions = suggestionRes?.items ?? [];

  return (
    <div className="container-se py-8">
      <h1 className="text-3xl font-bold text-navy">Shopping cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-10 text-center ring-1 ring-line">
          <p className="text-muted">Your cart is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-4">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl bg-white ring-1 ring-line">
            <div className="divide-y divide-line">
              {lines.map(({ product, qty }) => (
                <div key={product.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <ProductVisual
                        product={product}
                        icon={product.category?.slug?.includes("drive") ? "hdd" : "network"}
                        className="h-16"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${product.slug}`}
                        className="line-clamp-2 font-medium hover:text-brand"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-muted">SKU {product.sku}</p>
                      <button
                        type="button"
                        className="mt-1 block text-xs font-medium text-sale"
                        onClick={() => remove(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="w-16 text-sm text-muted">{formatMoney(product.price)}</span>
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button type="button" className="px-3 py-1.5" onClick={() => setQty(product.id, qty - 1)}>
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{qty}</span>
                      <button type="button" className="px-3 py-1.5" onClick={() => setQty(product.id, qty + 1)}>
                        +
                      </button>
                    </div>
                    <span className="w-24 text-right font-semibold">{formatMoney(product.price * qty)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="h-fit space-y-4 rounded-2xl bg-white p-5 ring-1 ring-line">
            <FreeShippingBar />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. tax</span>
                <span>{formatMoney(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
            <Link href="/shop" className="btn btn-outline w-full">
              Continue shopping
            </Link>
            <Link href="/checkout" className="btn btn-primary w-full">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}

      {lines.length > 0 && remainingForFreeShipping > 0 && suggestions.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-navy">Add these to unlock free shipping</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
