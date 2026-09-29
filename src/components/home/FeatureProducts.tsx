"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Category, Product } from "@/types/store";
import AddToCartButton from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/format";
import { FIGMA_MOCK_PRODUCTS } from "@/data/mockProducts";

const FIGMA_TABS = [
  { slug: "server-hard-drives", name: "SERVER HARD DRIVES" },
  { slug: "power-supplies", name: "POWER SUPPLIES" },
  { slug: "solid-state-drives", name: "SOLID STATE DRIVES" },
  { slug: "server-memory", name: "SERVER MEMORY" },
  { slug: "network-switches", name: "NETWORK SWITCHES" },
];

const FEATURE_CARD_IMAGES = [
  "/images/home/feature-gpu-evga.png",
  "/images/home/feature-gpu-evga1.png",
  "/images/home/feature-gpu-rog.png",
  "/images/home/feature-gpu-zotac.png",
];

function FeatureCard({
  product,
  index = 0,
  theme = "dark",
}: {
  product: Product;
  index?: number;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  const featImg = FEATURE_CARD_IMAGES[index % FEATURE_CARD_IMAGES.length];
  const comparePrice = 139.0;
  const salePrice = 109.0;

  return (
    <article className="group flex flex-col">
      {/* White Image Box */}
      <Link
        href={`/product/${product.slug}`}
        className={`relative block aspect-square w-full overflow-hidden rounded-2xl bg-white p-3.5 sm:p-4 transition-all duration-300 hover:shadow-xl ${isLight
          ? "border border-gray-100 shadow-sm"
          : "shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          }`}
      >
        {/* Top-left: "In Stock" in electric blue */}
        <span className="text-[12px] sm:text-[13px] font-semibold text-[#0066ff]">
          In Stock
        </span>

        {/* Centered Product Image */}
        <div className="absolute inset-x-3.5 sm:inset-x-4 top-8 bottom-3.5 sm:bottom-4 flex items-center justify-center">
          <Image
            src={featImg}
            alt={product.title || "Product Image"}
            width={400}
            height={400}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            priority={index < 4}
          />
        </div>
      </Link>

      {/* Product Title (3-line wrap matching Figma screenshot) */}
      <Link
        href={`/product/${product.slug}`}
        className={`mt-3.5 block font-sans text-[13px] sm:text-[14px] font-normal leading-[1.3] transition-colors duration-200 line-clamp-3 min-h-[3.9em] ${isLight
          ? "text-[#0b1220] hover:text-[#0066ff]"
          : "text-white hover:text-[#38bdf8]"
          }`}
      >
        {product.title ||
          "CA-2890 Cyber Acoustics USB Powered Sound Bar Speaker"}
      </Link>

      {/* Price row: strikethrough price then green sale price */}
      <div className="mt-2.5 flex items-baseline gap-2.5">
        <span
          className={`text-[13px] sm:text-[14px] line-through font-normal ${isLight ? "text-slate-400" : "text-white/70"
            }`}
        >
          {formatMoney(comparePrice)}
        </span>
        <span
          className={`text-[15px] sm:text-[16px] font-bold ${isLight ? "text-emerald-600" : "text-[#00cc00]"
            }`}
        >
          {formatMoney(salePrice)}
        </span>
      </div>

      {/* ADD TO CART Button */}
      <div className="mt-3.5 w-full">
        <AddToCartButton
          productId={product.id}
          label="ADD TO CART"
          className="w-full rounded-[6px] bg-gradient-to-b from-[#0066ff] to-[#0048ba] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(0,102,255,0.4)] transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
        />
      </div>
    </article>
  );
}

export default function FeatureProducts({
  fallbackProducts = [],
  theme = "dark",
}: {
  categories?: Category[];
  fallbackProducts?: Product[];
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";
  // Default to "POWER SUPPLIES" to match the Figma screenshot
  const [active, setActive] = useState("power-supplies");

  // Use Figma 4 mock cards
  const displayProducts =
    fallbackProducts.length >= 4
      ? fallbackProducts.slice(0, 4)
      : FIGMA_MOCK_PRODUCTS.slice(0, 4);

  return (
    <section
      id="featured"
      className={isLight ? "bg-white text-[#0b1220]" : "bg-black text-white"}
    >
      <div className="container-se py-12 md:py-16">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <h2
            className={`font-display text-xl font-bold uppercase tracking-[0.04em] sm:text-2xl ${isLight ? "text-[#0066ff]" : "text-white"
              }`}
          >
            FEATURE PRODUCTS
          </h2>

          {/* Navigation Tabs */}
          <nav
            className="flex flex-wrap items-center gap-x-4 gap-y-2 overflow-x-auto"
            aria-label="Feature product categories"
          >
            {FIGMA_TABS.map((tab) => {
              const isActive = tab.slug === active;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setActive(tab.slug)}
                  className={`relative whitespace-nowrap pb-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${isActive
                    ? isLight
                      ? "text-[#0066ff]"
                      : "text-white"
                    : isLight
                      ? "text-slate-500 hover:text-[#0b1220]"
                      : "text-white/60 hover:text-white"
                    }`}
                >
                  {tab.name}
                  {isActive ? (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#0066ff]" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 4-column Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, i) => (
            <FeatureCard
              key={`${product.id}-${i}`}
              product={product}
              index={i}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
