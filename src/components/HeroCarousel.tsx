"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Banner, Product } from "@/types/store";
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
    title: "SHOP NEW, USED &\nREFURBISHED",
    subtitle: "SERVERS, STORAGE & NETWORKING",
    categories: defaultCategories,
  },
  {
    eyebrow: "enterprise hardware · tested · warrantied",
    title: "IN-STOCK RACK\nREADY GEAR",
    subtitle: "SWITCHES, DRIVES, MEMORY & POWER",
    categories: defaultCategories,
  },
  {
    eyebrow: "b2b pricing · volume quotes · fast dispatch",
    title: "BUILD OUT WITH\nCONFIDENCE",
    subtitle: "HARD-TO-FIND SKUS, READY TO SHIP",
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
  return (custom.length ? custom : fallbackSlides).slice(0, 3);
}

export default function HeroCarousel({
  banners,
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
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const slide = slides[index];

  return (
    <section
      className="relative isolation-auto min-h-[560px] md:min-h-[620px] lg:min-h-[660px] overflow-hidden bg-[#030816] text-white flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Mesh Image + Center Blue Radial Glow */}
      <div className="absolute inset-0 z-0 opacity-90">
        <Image
          src="/images/home/hero-bg.jpg"
          alt="Hero Background Mesh"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Blue center radial glow matching Figma */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.42)_0%,rgba(3,8,22,0.92)_75%)]" />
      </div>

      {/* 4-Box Grid Layout: Box 1 (Left Image), Box 2 & 3 (Center Content), Box 4 (Right Image) */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 items-center min-h-[560px] md:min-h-[620px] lg:min-h-[660px] py-6">
        
        {/* Box 1 (Left 1 Box): Dedicated strictly for Left Image */}
        <div className="col-span-1 relative hidden lg:flex h-full items-center justify-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative w-full h-[460px] xl:h-[520px]"
          >
            <Image
              src="/images/home/hero-left.png"
              alt="Powerline PC Hardware Servers"
              fill
              className="object-contain object-left-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              priority
            />
          </motion.div>
        </div>

        {/* Box 2 & 3 (Center 2 Boxes / col-span-2): Dedicated for Center Content */}
        <div className="col-span-1 lg:col-span-2 relative z-20 mx-auto w-full text-center flex flex-col items-center justify-center py-6 px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col items-center justify-center w-full"
            >
              {/* Top Pill Badge */}
              <div className="inline-flex max-w-full items-center justify-center rounded-full bg-[#0066ff] px-6 py-2 text-xs md:text-sm font-semibold tracking-wide text-white shadow-[0_4px_20px_rgba(0,102,255,0.45)] whitespace-nowrap">
                <span>{slide.eyebrow}</span>
              </div>

              {/* Main Title */}
              <h1 className="mt-5 font-display text-3xl sm:text-5xl lg:text-[52px] xl:text-[64px] font-extrabold uppercase leading-[1.04] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] whitespace-pre-line">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 font-sans text-sm sm:text-lg lg:text-xl xl:text-2xl font-light uppercase tracking-[0.14em] text-white/95 drop-shadow-md">
                {slide.subtitle}
              </p>

              {/* Bottom Pill Badge with Categories */}
              <div className="mt-7 inline-flex max-w-full flex-wrap items-center justify-center gap-x-3.5 gap-y-1 rounded-full bg-[#0066ff] px-7 py-2.5 text-xs sm:text-sm font-semibold tracking-wider text-white shadow-[0_4px_20px_rgba(0,102,255,0.45)] whitespace-nowrap">
                {slide.categories.map((cat, i) => (
                  <span key={cat.label} className="inline-flex items-center gap-3.5">
                    {i > 0 ? <span className="text-white/70">•</span> : null}
                    <Link href={cat.href} className="transition hover:text-white/80">
                      {cat.label}
                    </Link>
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Box 4 (Right 1 Box): Dedicated strictly for Right Image */}
        <div className="col-span-1 relative hidden lg:flex h-full items-center justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative w-full h-[480px] xl:h-[540px]"
          >
            <Image
              src="/images/home/hero-right.png"
              alt="Gaming Headset & GPU"
              fill
              className="object-contain object-right-center drop-shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
              priority
            />
          </motion.div>
        </div>

      </div>

      {/* Pagination Dots at Bottom Center */}
      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-3.5 w-3.5 border-2 border-[#0066ff] bg-[#0066ff] ring-2 ring-[#0066ff]/60 p-0.5"
                  : "h-2.5 w-2.5 bg-white hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
