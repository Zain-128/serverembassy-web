"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { Banner, Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";

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
  from: string;
  mid: string;
};

const fallbackSlides: Slide[] = [
  {
    pre: "Server ",
    gradient: "Embassy",
    post: "",
    sub: "Enterprise switches, storage, and power — tested, warrantied, and ready to ship in 1–2 days.",
    cta: "Shop catalog",
    href: "/shop",
    from: "#1e3a70",
    mid: "#0e2447",
  },
  {
    pre: "Deals up to ",
    gradient: "40% off",
    post: " on hardware",
    sub: "Rotating deals on in-stock storage, switches, and power — while stock lasts.",
    cta: "Shop deals",
    href: "/shop",
    cta2: "Weekly deals",
    href2: "#deals",
    from: "#20528a",
    mid: "#0e2447",
  },
  {
    pre: "Need a ",
    gradient: "volume quote?",
    post: "",
    sub: "Hard-to-find SKUs, bulk pricing, and dedicated account managers for B2B buyers.",
    cta: "Request a quote",
    href: "#quote",
    from: "#1e3a70",
    mid: "#0a1a36",
  },
];

function buildSlides(banners: Banner[]): Slide[] {
  const custom = banners
    .filter((b) => b.active && b.size === "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map<Slide>((b) => ({
      pre: b.title,
      gradient: "",
      post: "",
      sub: b.subtitle,
      cta: b.cta,
      href: b.href,
      from: "#20528a",
      mid: "#0a1a36",
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

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <section
      className="hero-carousel h-[560px] md:h-[620px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={`${s.pre}-${i}`}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "z-[1] opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
            style={{
              background: `radial-gradient(900px 420px at 78% 18%, rgba(59,130,246,0.25), transparent 58%), linear-gradient(160deg, ${s.from} 0%, ${s.mid} 60%, #0a1a36 100%)`,
            }}
          >
            <div
              className="container-se relative z-10 grid h-full items-end gap-12 pb-16 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-14"
              aria-hidden={!active}
            >
              <div className={`min-w-0 ${active ? "anim-fade" : ""}`}>
                <p className="rise inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                  <Sparkles size={13} className="text-white/70" />
                  {s.eyebrow ?? "Enterprise IT hardware"}
                </p>
                <h1 className="rise rise-2 mt-5 font-display text-4xl tracking-tight text-white md:text-6xl">
                  {s.pre}
                  {s.gradient ? <span className="text-gradient">{s.gradient}</span> : null}
                  {s.post}
                </h1>
                <p className="rise rise-3 mt-4 max-w-lg text-base text-white/70 md:text-lg">{s.sub}</p>
                <div className="rise rise-4 mt-7 flex flex-wrap items-center gap-3">
                  <Link href={s.href} className="btn btn-primary group">
                    {s.cta}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  {s.cta2 && s.href2 ? (
                    <Link href={s.href2} className="btn btn-ghost">
                      {s.cta2}
                    </Link>
                  ) : null}
                </div>
              </div>

              {featured ? (
                <div className="relative hidden justify-self-end lg:block">
                  <Link
                    href={`/product/${featured.slug}`}
                    className="shine anim-float-slow group relative block w-[300px] overflow-hidden rounded-3xl border border-white/15 shadow-lift xl:w-[340px]"
                  >
                    <ProductVisual
                      product={featured}
                      icon={featured.category?.slug?.includes("drive") ? "hdd" : "network"}
                      className="aspect-[4/3]"
                    />
                    <span className="absolute inset-x-4 bottom-4 translate-y-2 rounded-full bg-white/95 px-4 py-2 text-center text-sm font-semibold text-navy opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View product →
                    </span>
                  </Link>
                  <div className="anim-float absolute -right-2 -top-4 rounded-2xl bg-white px-4 py-2.5 shadow-lift">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">From</p>
                    <p className="font-display text-xl font-bold text-navy">${Math.floor(featured.price)}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}

      {slides.length > 1 ? (
        <>
          <div className="absolute bottom-6 left-0 right-0 z-20">
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
        </>
      ) : null}
    </section>
  );
}