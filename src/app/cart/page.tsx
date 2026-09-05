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
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            <table className="w-full text-sm">
              <thead className="bg-page text-left text-muted">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ product, qty }) => (
                  <tr key={product.id} className="border-t border-line">
                    <td className="p-4">
                      <div className="flex gap-3">
                        <div className="h-16 w-16 overflow-hidden rounded-lg">
                          <ProductVisual
                            product={product}
                            icon={product.category?.slug?.includes("drive") ? "hdd" : "network"}
                            className="h-16"
                          />
                        </div>
                        <div>
                          <Link href={`/product/${product.slug}`} className="font-medium hover:text-brand">
                            {product.title}
                          </Link>
                          <button
                            type="button"
                            className="mt-1 block text-xs text-sale"
                            onClick={() => remove(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{formatMoney(product.price)}</td>
                    <td className="p-4">
                      <div className="inline-flex items-center rounded-lg border border-line">
                        <button type="button" className="px-3 py-1" onClick={() => setQty(product.id, qty - 1)}>
                          −
                        </button>
                        <span className="w-8 text-center">{qty}</span>
                        <button type="button" className="px-3 py-1" onClick={() => setQty(product.id, qty + 1)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{formatMoney(product.price * qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
