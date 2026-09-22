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

import Image from "next/image";

function HardwareStage({ side }: { side: "left" | "right" }) {
  const imageSrc = side === "left" ? "/images/home/hero-left.png" : "/images/home/hero-right.png";

  return (
    <div className={`relative hidden h-full min-h-[460px] items-center justify-center lg:flex ${side === "left" ? "justify-start" : "justify-end"}`}>
      <motion.div
        className="relative h-[480px] w-full max-w-[480px] xl:h-[540px] xl:max-w-[540px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Image
          src={imageSrc}
          alt={side === "left" ? "Powerline PC Hardware Servers" : "Gaming Headset & GPU"}
          width={650}
          height={750}
          className={`h-full w-full object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.6)] ${side === "left" ? "object-left" : "object-right"}`}
          priority
        />
      </motion.div>
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

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative isolation-auto min-h-[560px] overflow-hidden bg-[#050c1e] text-white md:min-h-[620px] lg:min-h-[680px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Mesh Image */}
      <div className="absolute inset-0 z-0 opacity-90">
        <Image
          src="/images/home/hero-bg.jpg"
          alt="Hero Background Mesh"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000c24]/40 via-transparent to-[#000c24]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 grid min-h-[560px] items-center py-12 md:min-h-[620px] lg:min-h-[680px] lg:grid-cols-[1fr_1.3fr_1fr] lg:gap-2 lg:py-8">
        <HardwareStage side="left" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <p className="mx-auto inline-flex max-w-[92%] items-center justify-center rounded-full bg-[#0066ff] px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_8px_24px_rgba(0,102,255,0.4)] sm:text-[11px]">
                {slide.eyebrow}
              </p>
              <h1 className="mt-6 font-display text-[clamp(2.2rem,5vw,4.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                {slide.title}
              </h1>
              <p className="mt-4 font-display text-[clamp(1.1rem,2.2vw,1.9rem)] font-light uppercase tracking-[0.14em] text-white/90 drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="mx-auto mt-8 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-full bg-[#0066ff] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(0,102,255,0.4)] sm:text-[13px]">
                {slide.categories.map((cat, i) => (
                  <span key={cat.label} className="inline-flex items-center gap-3">
                    {i > 0 ? <span className="text-white/60">•</span> : null}
                    <Link href={cat.href} className="transition hover:text-white/80">
                      {cat.label}
                    </Link>
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <HardwareStage side="right" />
      </div>

      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={`d-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-3.5 w-3.5 border-2 border-[#0066ff] bg-transparent ring-2 ring-[#0066ff]/40 ring-offset-2 ring-offset-transparent"
                  : "h-2.5 w-2.5 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
