"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Banner, Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import { EASE } from "@/lib/motion";

type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  categories: { label: string; href: string }[];
};

const defaultCategories = [
  { label: "Servers", href: "/shop?q=server" },
  { label: "Storage", href: "/shop?q=storage" },
  { label: "Networking", href: "/shop?q=network" },
  { label: "Cloud", href: "/shop" },
  { label: "ITAD", href: "/contact" },
];

const fallbackSlides: Slide[] = [
  {
    eyebrow: "your global end to end it solution partner | not your typical VAR",
    title: "Shop new, used & refurbished",
    subtitle: "Servers, storage & networking",
    categories: defaultCategories,
  },
  {
    eyebrow: "enterprise hardware · tested · warrantied",
    title: "In-stock rack ready gear",
    subtitle: "Switches, drives, memory & power",
    categories: defaultCategories,
  },
  {
    eyebrow: "b2b pricing · volume quotes · fast dispatch",
    title: "Build out with confidence",
    subtitle: "Hard-to-find SKUs, ready to ship",
    categories: defaultCategories,
  },
];

function buildSlides(banners: Banner[]): Slide[] {
  const custom = banners
    .filter((b) => b.active && b.size === "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map<Slide>((b) => ({
      eyebrow: b.subtitle || fallbackSlides[0].eyebrow,
      title: b.title,
      subtitle: b.cta || fallbackSlides[0].subtitle,
      categories: defaultCategories,
    }));
  return (custom.length ? custom : fallbackSlides).slice(0, 4);
}

function HardwareStage({
  products,
  side,
}: {
  products: Product[];
  side: "left" | "right";
}) {
  const primary = products[0];
  const secondary = products[1];
  const offset = side === "left" ? "-translate-x-[8%]" : "translate-x-[8%]";

  return (
    <div className={`relative hidden h-full min-h-[420px] items-center justify-center lg:flex ${offset}`}>
      {primary ? (
        <motion.div
          className={`anim-float absolute ${side === "left" ? "left-[8%] top-[12%]" : "right-[6%] top-[8%]"} h-[210px] w-[210px] xl:h-[250px] xl:w-[250px]`}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="h-full w-full overflow-hidden rounded-[28px] border border-white/15 bg-white/5 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
            <ProductVisual
              product={primary}
              icon={primary.category?.slug?.includes("drive") ? "hdd" : "network"}
              className="h-full rounded-2xl"
            />
          </div>
        </motion.div>
      ) : null}
      {secondary ? (
        <motion.div
          className={`anim-float-slow absolute ${side === "left" ? "bottom-[10%] right-[4%]" : "bottom-[12%] left-[2%]"} h-[150px] w-[150px] xl:h-[180px] xl:w-[180px]`}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <div className="h-full w-full overflow-hidden rounded-[24px] border border-white/15 bg-white/5 p-2.5 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <ProductVisual
              product={secondary}
              icon={secondary.category?.slug?.includes("drive") ? "hdd" : "switch"}
              className="h-full rounded-xl"
            />
          </div>
        </motion.div>
      ) : (
        <div
          className={`absolute ${side === "left" ? "bottom-[14%] right-[10%]" : "bottom-[16%] left-[8%]"} h-28 w-28 rounded-full border border-brand/40 bg-brand/20 blur-0`}
          aria-hidden
        />
      )}
    </div>
  );
}

export default function HeroCarousel({
  banners,
  featured,
  products = [],
}: {
  banners: Banner[];
  featured?: Product;
  products?: Product[];
}) {
  const slides = useMemo(() => buildSlides(banners), [banners]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const stageProducts = useMemo(() => {
    const pool = [featured, ...products].filter(Boolean) as Product[];
    const unique: Product[] = [];
    const seen = new Set<string>();
    for (const p of pool) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      unique.push(p);
      if (unique.length >= 4) break;
    }
    return unique;
  }, [featured, products]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="hero-aurora relative isolation-auto min-h-[560px] overflow-hidden text-white md:min-h-[620px] lg:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-hex absolute inset-0 opacity-70" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(6,12,24,0.55)_72%,rgba(6,12,24,0.88)_100%)]"
        aria-hidden
      />
      <div className="anim-orb absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-brand/25 blur-[100px]" aria-hidden />
      <div className="anim-orb-2 absolute right-[10%] bottom-[12%] h-72 w-72 rounded-full bg-[#3b82f6]/20 blur-[110px]" aria-hidden />

      <div className="container-se relative z-10 grid min-h-[560px] items-center py-14 md:min-h-[620px] lg:min-h-[680px] lg:grid-cols-[0.95fr_1.2fr_0.95fr] lg:gap-4 lg:py-10">
        <HardwareStage products={stageProducts.slice(0, 2)} side="left" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="mx-auto inline-flex max-w-[92%] items-center justify-center rounded-full bg-brand px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-[11px]">
                {slide.eyebrow}
              </p>
              <h1 className="mt-6 font-display text-[clamp(2rem,5.4vw,4.25rem)] font-bold uppercase leading-[0.98] tracking-[-0.02em] text-white">
                {slide.title}
              </h1>
              <p className="mt-4 font-display text-[clamp(1.05rem,2.4vw,1.85rem)] font-medium uppercase tracking-[0.06em] text-white/85">
                {slide.subtitle}
              </p>
              <div className="mx-auto mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-brand px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white sm:text-[13px]">
                {slide.categories.map((cat, i) => (
                  <span key={cat.label} className="inline-flex items-center gap-2">
                    {i > 0 ? <span className="text-white/50">•</span> : null}
                    <Link href={cat.href} className="transition hover:text-white/80">
                      {cat.label}
                    </Link>
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <HardwareStage products={stageProducts.slice(2, 4)} side="right" />
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-7 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={`d-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-brand ring-2 ring-brand/40 ring-offset-2 ring-offset-transparent" : "w-2.5 bg-white/35 hover:bg-white/65"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
