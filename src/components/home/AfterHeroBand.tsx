"use client";

import Link from "next/link";
import { Contact, Network, Rocket } from "lucide-react";
import type { Banner, Brand, Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import Reveal from "@/components/Reveal";

const FALLBACK_BRANDS = [
  "Juniper NETWORKS",
  "Synology",
  "VeeAM",
  "HPE",
  "DELL Technologies",
  "CISCO",
];

const features = [
  {
    icon: Network,
    title: "International shipment",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    icon: Rocket,
    title: "Re Shipment",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    icon: Contact,
    title: "Contact Us",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    href: "/contact",
  },
];

type PromoCard = {
  key: string;
  badge: string;
  title: string;
  text: string;
  href: string;
  product?: Product;
};

function buildPromos(banners: Banner[], products: Product[]): PromoCard[] {
  const half = banners
    .filter((b) => b.active && b.size !== "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 2);

  if (half.length >= 2) {
    return half.map((b, i) => ({
      key: b.id,
      badge: "On Sale This Week",
      title: b.title || "Better Quality Better Service for Your",
      text: b.subtitle || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem",
      href: b.href || "/shop",
      product: products[i],
    }));
  }

  return [
    {
      key: "promo-1",
      badge: "On Sale This Week",
      title: "Better Quality Better Service for Your",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem",
      href: "/shop",
      product: products[0],
    },
    {
      key: "promo-2",
      badge: "On Sale This Week",
      title: "Better Quality Better Service for Your",
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem",
      href: "/shop?sort=newest",
      product: products[1],
    },
  ];
}

export default function AfterHeroBand({
  brands,
  banners,
  products = [],
}: {
  brands: Brand[];
  banners: Banner[];
  products?: Product[];
}) {
  const brandNames = brands.length
    ? brands.slice(0, 8).map((b) => b.name)
    : FALLBACK_BRANDS;
  const promos = buildPromos(banners, products);

  return (
    <section className="bg-[#05070c] text-white">
      {/* Brand strip */}
      <div className="border-y border-white/5 bg-[#12151c]">
        <div className="container-se flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-5 sm:justify-between sm:gap-x-6">
          {brandNames.map((name) => (
            <Link
              key={name}
              href={`/shop?q=${encodeURIComponent(name)}`}
              className="font-display text-sm font-semibold tracking-[0.04em] text-white/75 transition hover:text-white sm:text-base"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      <div className="container-se py-14 md:py-16">
        {/* Feature trio */}
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {features.map((item, i) => {
            const body = (
              <>
                <span className="mx-auto mb-4 grid h-12 w-12 place-items-center text-brand md:mx-0">
                  <item.icon size={36} strokeWidth={1.6} />
                </span>
                <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
              </>
            );
            return (
              <Reveal key={item.title} delay={i * 80}>
                {item.href ? (
                  <Link href={item.href} className="group block text-center md:text-left">
                    {body}
                  </Link>
                ) : (
                  <div className="text-center md:text-left">{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        {/* Mid headline */}
        <div className="mx-auto mt-16 max-w-4xl text-center md:mt-20">
          <h2 className="font-display text-[clamp(1.75rem,4.2vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-white">
            Shop new, used & refurbished
          </h2>
          <p className="mt-3 font-display text-[clamp(0.95rem,2vw,1.35rem)] font-medium uppercase tracking-[0.08em] text-white/70">
            Servers, storage & networking
          </p>
        </div>

        {/* Promo pair */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {promos.map((promo, i) => (
            <Reveal key={promo.key} delay={i * 100}>
              <Link
                href={promo.href}
                className="group relative flex min-h-[220px] overflow-hidden rounded-sm border border-white/10 bg-[#0c1018] transition hover:border-brand/40"
              >
                <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-8">
                  <span className="inline-flex w-fit rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {promo.badge}
                  </span>
                  <h3 className="mt-4 max-w-[14ch] font-display text-xl font-bold leading-tight text-white sm:text-2xl">
                    {promo.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">{promo.text}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-semibold text-brand transition group-hover:translate-x-1">
                    Shop Now
                  </span>
                </div>
                <div className="relative hidden w-[42%] shrink-0 sm:block">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(37,99,235,0.22),transparent_65%)]" />
                  {promo.product ? (
                    <div className="absolute inset-3 overflow-hidden rounded-lg sm:inset-4">
                      <ProductVisual
                        product={promo.product}
                        icon={promo.product.category?.slug?.includes("drive") ? "hdd" : "network"}
                        className="h-full"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
