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
  const activeBanners = banners.filter((b) => b.active);
  if (!activeBanners.length) return fallbackSlides;

  const heroBanners = activeBanners.filter((b) => b.size === "hero");
  const list = heroBanners.length ? heroBanners : activeBanners;

  return list
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map<Slide>((b) => ({
      eyebrow: b.subtitle || fallbackSlides[0].eyebrow,
      title: b.title,
      subtitle: b.ctaLabel || b.cta || fallbackSlides[0].subtitle,
      categories: defaultCategories,
    }));
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
      className="relative isolation-auto min-h-[460px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[600px] xl:min-h-[650px] overflow-hidden bg-[#030816] text-white flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 1. Background Mesh Image + Center Blue Radial Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/home/hero-bg.jpg"
          alt="Hero Background Mesh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85"
        />
        {/* Blue center radial glow matching Figma design */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,rgba(0,102,255,0.48)_0%,rgba(3,8,22,0.92)_70%,#030816_100%)]" />
      </div>

      {/* 2. Left Visual: PC Tower & Server Tower anchored to bottom-left */}
      <div className="pointer-events-none absolute left-0 bottom-0 z-10 hidden md:block w-[240px] lg:w-[320px] xl:w-[400px] 2xl:w-[460px] h-[75%] lg:h-[84%] xl:h-[90%]">
        <div className="relative w-full h-full">
          <Image
            src="/images/home/hero-left.png"
            alt="Powerline PC Hardware & Server Tower"
            fill
            sizes="(max-width: 1024px) 320px, 460px"
            className="object-contain object-left-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>
      </div>

      {/* 3. Right Visual: Headset & MSI GPU anchored to bottom-right */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-10 hidden md:block w-[260px] lg:w-[340px] xl:w-[430px] 2xl:w-[500px] h-[75%] lg:h-[84%] xl:h-[90%]">
        <div className="relative w-full h-full">
          <Image
            src="/images/home/hero-right.png"
            alt="Gaming Headset & GPU"
            fill
            sizes="(max-width: 1024px) 340px, 500px"
            className="object-contain object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            priority
          />
        </div>
      </div>

      {/* Center Content: strictly centered with responsive max-width so text never overlaps side graphics */}
      <div className="relative z-20 mx-auto w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-[620px] xl:max-w-[720px] px-4 sm:px-6 text-center flex flex-col items-center justify-center pt-6 pb-14 sm:pb-16 md:py-14 lg:py-18">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex flex-col items-center justify-center w-full"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex max-w-full items-center justify-center rounded-full bg-[#0066ff] px-3.5 py-1 sm:px-5 sm:py-1.5 md:px-6 md:py-2 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wide text-white shadow-[0_4px_24px_rgba(0,102,255,0.45)] text-center leading-tight">
              <span>{slide.eyebrow}</span>
            </div>

            {/* Main Title */}
            <h1 className="mt-3.5 sm:mt-4 md:mt-5 font-display text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[56px] font-black uppercase leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] whitespace-pre-line">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 sm:mt-3 md:mt-4 font-sans text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-light uppercase tracking-[0.14em] text-white/95 drop-shadow-md">
              {slide.subtitle}
            </p>

            {/* Bottom Pill Badge with Categories */}
            <div className="mt-5 sm:mt-6 md:mt-7 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-1 rounded-full bg-[#0066ff] px-4 py-1.5 sm:px-6 sm:py-2 md:px-7 md:py-2.5 text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider text-white shadow-[0_4px_24px_rgba(0,102,255,0.45)]">
              {slide.categories.map((cat, i) => (
                <span key={cat.label} className="inline-flex items-center gap-2.5 sm:gap-3">
                  {i > 0 ? <span className="text-white/70">•</span> : null}
                  <Link href={cat.href} className="transition hover:text-white/80 whitespace-nowrap">
                    {cat.label}
                  </Link>
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots at Bottom Center */}
      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-3.5 sm:bottom-4 md:bottom-5 z-30 flex justify-center items-center gap-2.5 sm:gap-3">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${i === index
                ? "h-3 w-3 sm:h-3.5 sm:w-3.5 border-2 border-[#0066ff] bg-[#0066ff] ring-2 ring-[#0066ff]/60 p-0.5"
                : "h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
