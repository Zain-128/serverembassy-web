"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductVisual from "@/components/ProductVisual";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/store";
import { useCart } from "@/lib/cart";
import { ShieldCheck, Star, Truck, RefreshCcw } from "lucide-react";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const brand = product.brand;
  const category = product.category;
  const { add } = useCart();
  const router = useRouter();
  const [tab, setTab] = useState("description");

  return (
    <div className="container-se py-8">
      <p className="text-sm text-muted">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/shop/${category.slug}`}>{category.name}</Link>
          </>
        ) : null}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <ProductVisual
            product={product}
            icon={category?.icon ?? "network"}
            className="h-[380px] rounded-3xl"
          />
          <p className="mt-3 text-xs text-muted">* Image may not exactly match the product.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-brand">
            {brand?.name} · {product.condition}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-navy">{product.title}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            {product.rating} ({product.reviewCount} reviews)
          </div>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-3xl font-bold">{formatMoney(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-muted line-through">{formatMoney(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-muted">
            SKU: {product.sku} · {product.stock > 0 ? "In stock" : "Out of stock"} · Warranty:{" "}
            {product.warranty}
          </p>
          <ul className="mt-5 list-disc space-y-1 pl-5 text-sm text-ink/80">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton productId={product.id} className="btn btn-primary" />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => {
                add(product.id);
                router.push("/checkout");
              }}
            >
              Buy Now
            </button>
          </div>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="group rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <Truck size={16} />
              </span>
              <p className="mt-2 font-medium">Free Ground Shipping</p>
              <p className="text-muted">On orders over $199 (US)</p>
            </div>
            <div className="group rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <ShieldCheck size={16} />
              </span>
              <p className="mt-2 font-medium">{product.warranty}</p>
              <p className="text-muted">See warranty policy</p>
            </div>
            <div className="group rounded-2xl bg-white p-4 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <RefreshCcw size={16} />
              </span>
              <p className="mt-2 font-medium">30-day returns</p>
              <p className="text-muted">RMA required</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line">
        <div className="flex flex-wrap gap-1 border-b border-line p-2">
          {["description", "specs", "reviews", "shipping"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                tab === id
                  ? "bg-navy text-white shadow-card"
                  : "text-muted hover:bg-page hover:text-navy"
              }`}
            >
              {id === "specs" ? "Specifications" : id}
            </button>
          ))}
        </div>
        <div className="p-6 text-sm leading-relaxed">
          {tab === "description" ? <p>{product.description}</p> : null}
          {tab === "specs" ? (
            <table className="w-full max-w-xl">
              <tbody>
                {product.specs.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <td className="py-2 font-medium">{row.label}</td>
                    <td className="py-2 text-muted">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {tab === "reviews" ? (
            <p>No customer reviews yet. Be the first to review this SKU after purchase.</p>
          ) : null}
          {tab === "shipping" ? (
            <p>
              Standard 3–7 business days, expedited 1–3 days. Free shipping unlocks at $199 for
              qualifying US orders. Weight: {product.weightLbs} lbs.
            </p>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold text-navy">Related products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 80}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
