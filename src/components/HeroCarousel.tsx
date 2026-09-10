"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Banner, Product } from "@/types/store";
import DeviceScene from "@/components/3d/DeviceScene";
import MagneticButton from "@/components/ui/MagneticButton";
import { EASE, useIsTouch } from "@/lib/motion";

type Slide = {
  eyebrow?: string;
  pre: string;
  gradient: string;
  post: string;
  sub: string;
  cta: string;
  cta2?: string;
  href: string;
  href2?: string;
};

const fallbackSlides: Slide[] = [
  {
    pre: "Server hardware, ",
    gradient: "beautifully",
    post: " curated.",
    sub: "Enterprise switches, storage, and power — tested, warrantied, and ready to ship in 1–2 days.",
    cta: "Shop catalog",
    href: "/shop",
  },
  {
    pre: "Deals up to ",
    gradient: "40% off",
    post: " on in-stock hardware",
    sub: "Rotating deals on enterprise storage, switches, and power — while stock lasts.",
    cta: "Shop deals",
    href: "/shop",
    cta2: "Weekly deals",
    href2: "#deals",
  },
  {
    pre: "Need a ",
    gradient: "volume quote?",
    post: "",
    sub: "Hard-to-find SKUs, bulk pricing, and dedicated account managers for B2B buyers.",
    cta: "Request a quote",
    href: "#quote",
  },
];

function buildSlides(banners: Banner[]): Slide[] {
  const custom = banners
    .filter((b) => b.active && b.size === "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map<Slide>((b) => ({
      eyebrow: b.title.split(" ")[0],
      pre: b.title,
      gradient: "",
      post: "",
      sub: b.subtitle,
      cta: b.cta,
      href: b.href,
    }));
  return [...custom, ...fallbackSlides].slice(0, 4);
}

export default function HeroCarousel({
  banners,
  featured,
}: {
  banners: Banner[];
  featured?: Product;
}) {
  const slides = useMemo(() => buildSlides(banners), [banners]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const touch = useIsTouch();
  const sectionRef = useRef<HTMLElement>(null);

  const icon = featured?.category?.slug?.includes("drive") ?? false ? "hdd" : "network";

  // Cursor parallax (desktop only)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 55, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 55, damping: 18, mass: 0.6 });
  const prodX = useTransform(smx, (v) => v * 22);
  const prodY = useTransform(smy, (v) => v * 16);
  const prodRotX = useTransform(smy, (v) => v * -10);
  const prodRotY = useTransform(smx, (v) => v * 14);
  const gridX = useTransform(smx, (v) => v * 16);
  const gridY = useTransform(smy, (v) => v * 12);
  const orbX = useTransform(smx, (v) => v * -34);
  const orbY = useTransform(smy, (v) => v * -26);

  const onPointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || touch) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reduce, touch, mx, my],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const slide = slides[index];

  return (
    <section
      ref={sectionRef as never}
      className="hero-aurora relative isolation-auto min-h-[700px] overflow-hidden text-white md:h-[660px] md:min-h-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={onPointerMove}
    >
      {/* Layered background */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 56px, rgba(255,255,255,0.05) 56px 57px), repeating-linear-gradient(180deg, transparent 0 18px, rgba(255,255,255,0.06) 18px 19px)", x: reduce ? undefined : gridX, y: reduce ? undefined : gridY, maskImage: "linear-gradient(90deg, transparent 30%, black 74%)", willChange: "transform" }}
        aria-hidden
      />
      <motion.div
        className="anim-orb absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-brand/25 blur-[110px]"
        style={{ x: reduce ? undefined : orbX, y: reduce ? undefined : orbY }}
        aria-hidden
      />
      <motion.div
        className="anim-orb-2 absolute -left-32 bottom-[-160px] h-[460px] w-[460px] rounded-full bg-[#2f6fe4]/20 blur-[120px]"
        style={{ x: reduce ? undefined : orbX, y: reduce ? undefined : orbY }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-[88px] h-[260px] bg-[radial-gradient(closest-side,rgba(244,247,248,0.07),transparent)]" aria-hidden />

      <div className="container-se relative z-10 grid h-full items-center gap-8 pt-12 pb-24 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:pb-0 md:pt-10">
        {/* Copy */}
        <div className="relative z-10 md:pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
                <Sparkles size={13} className="text-sky-300" />
                {slide.eyebrow ?? "Enterprise IT hardware"}
              </p>
              <h1 className="mt-5 max-w-xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                {slide.pre}
                {slide.gradient ? <span className="text-gradient">{slide.gradient}</span> : null}
                {slide.post}
              </h1>
              <p className="mt-4 max-w-md text-base text-white/70 md:text-lg">{slide.sub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton href={slide.href} className="btn btn-primary group text-sm md:text-base">
                  {slide.cta}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticButton>
                {slide.cta2 && slide.href2 ? (
                  <Link href={slide.href2} className="btn btn-ghost text-sm md:text-base">
                    {slide.cta2}
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Product stage */}
        <div className="relative min-h-[280px] [mask-image:linear-gradient(180deg,black_70%,transparent)] md:min-h-[430px] md:[mask-image:none]">
          {featured ? (
            <motion.div
              className="absolute left-1/2 top-1/2 h-[240px] w-[240px] max-w-[78vw] -translate-x-1/2 -translate-y-1/2 md:h-[360px] md:w-[360px] xl:h-[410px] xl:w-[410px]"
              style={{ x: reduce || touch ? undefined : prodX, y: reduce || touch ? undefined : prodY, rotateX: reduce || touch ? undefined : prodRotX, rotateY: reduce || touch ? undefined : prodRotY }}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
            >
              <div className="persp h-full w-full" style={{ perspective: 1200 }}>
                <DeviceScene
                  product={featured}
                  icon={icon}
                  className="h-full w-full"
                  tilt={false}
                  angle={-8}
                  altitude={4}
                />
              </div>

              <Link
                href={`/product/${featured.slug}`}
                className="group absolute right-0 top-[-6px] rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-right backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">From</p>
                <p className="font-display text-xl font-bold text-white">
                  ${Math.floor(featured.price)}
                </p>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-2xl text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Premium hardware, ready to ship.
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      {slides.length > 1 ? (
        <div className="absolute inset-x-0 bottom-6 z-20">
          <div className="container-se flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {slides.map((s, i) => (
                <button
                  key={`d-${i}`}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-brand-soft" : "w-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next slide"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}