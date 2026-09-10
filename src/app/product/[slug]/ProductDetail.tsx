"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import ProductGallery from "@/components/showcase/ProductGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatMoney } from "@/lib/format";
import { EASE } from "@/lib/motion";
import type { Product } from "@/types/store";
import { useCart } from "@/lib/cart";
import { ShieldCheck, Star, Truck, RefreshCcw, Minus, Plus } from "lucide-react";

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const brand = product.brand;
  const category = product.category;
  const icon = category?.icon ?? "network";
  const { add } = useCart();
  const router = useRouter();
  const [tab, setTab] = useState("description");
  const [qty, setQty] = useState(1);

  const setQtyClamped = (n: number) => setQty(Math.min(99, Math.max(1, n)));

  const handleBuyNow = () => {
    add(product.id, qty);
    router.push("/checkout");
  };

  return (
    <div className="container-se py-8">
      <motion.p
        className="text-sm text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/" className="hover:text-brand">Home</Link> / <Link href="/shop" className="hover:text-brand">Shop</Link>
        {category ? (
          <>
            {" / "}
            <Link href={`/shop/${category.slug}`} className="hover:text-brand">{category.name}</Link>
          </>
        ) : null}
      </motion.p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <ProductGallery product={product} icon={icon} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <p className="text-sm font-semibold tracking-wide text-brand">
            {brand?.name} · {product.condition}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-navy md:text-4xl">{product.title}</h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="font-medium text-navy">
              {(product.rating ?? 0) > 0 ? product.rating : "5.0"}
            </span>
            <span>·</span>
            <span>{product.reviewCount ?? 0} reviews</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="font-display text-4xl font-bold text-navy">{formatMoney(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="pb-1 text-muted line-through">{formatMoney(product.compareAtPrice)}</p>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-muted">
            SKU: <span className="font-mono text-navy">{product.sku}</span> ·{" "}
            <span className={product.stock > 0 ? "font-semibold text-green-600" : "font-semibold text-sale"}>
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>{" "}
            · Warranty: {product.warranty}
          </p>

          <ul className="mt-5 space-y-1.5 pl-1 text-sm text-ink/80">
            {product.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line bg-white shadow-soft">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQtyClamped(qty - 1)}
                className="grid h-11 w-11 place-items-center rounded-l-full text-navy transition-colors hover:bg-page"
              >
                <Minus size={15} />
              </button>
              <span className="w-10 text-center font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQtyClamped(qty + 1)}
                className="grid h-11 w-11 place-items-center rounded-r-full text-navy transition-colors hover:bg-page"
              >
                <Plus size={15} />
              </button>
            </div>
            <AddToCartButton productId={product.id} label="Add to Cart" className="btn btn-primary" onAdd={() => {}} qty={qty} />
            <button type="button" className="btn btn-dark" onClick={handleBuyNow}>
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
        </motion.div>
      </div>

      <motion.div
        className="mt-12 overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="flex flex-wrap gap-1 border-b border-line bg-gradient-to-br from-brand-soft/30 to-transparent p-2">
          {["description", "specs", "reviews", "shipping"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                tab === id
                  ? "bg-navy text-white shadow-card"
                  : "text-muted hover:bg-white hover:text-navy"
              }`}
            >
              {id === "specs" ? "Specifications" : id}
            </button>
          ))}
        </div>
        <div className="p-6 text-sm leading-relaxed md:p-8">
          {tab === "description" ? <p className="max-w-3xl text-ink/85">{product.description}</p> : null}
          {tab === "specs" ? (
            <table className="w-full max-w-xl">
              <tbody>
                {product.specs.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <td className="w-2/5 py-2.5 font-medium text-navy">{row.label}</td>
                    <td className="py-2.5 text-muted">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {tab === "reviews" ? (
            <div className="mx-auto max-w-xl text-center py-6">
              <Star size={28} className="mx-auto text-amber-400" />
              <p className="mt-3 font-medium text-navy">No customer reviews yet</p>
              <p className="mt-1 text-muted">
                Be the first to review this SKU after purchase and help other teams shop with confidence.
              </p>
            </div>
          ) : null}
          {tab === "shipping" ? (
            <div className="max-w-xl space-y-3">
              <p>Standard 3–7 business days, expedited 1–3 days.</p>
              <p className="rounded-xl bg-page/60 p-3 text-ink/85">
                Free shipping unlocks at $199 for qualifying US orders. Weight: {product.weightLbs} lbs.
              </p>
            </div>
          ) : null}
        </div>
      </motion.div>

      {related.length ? (
        <section className="mt-12">
          <SectionHeader
            eyebrow="Keep exploring"
            title="Related products"
            description="Hardware our customers often pair with this item."
            href={`/shop${category ? `/${category.slug}` : ""}`}
          />
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