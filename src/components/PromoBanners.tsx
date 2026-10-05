"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Banner } from "@/types/store";
import Reveal from "@/components/Reveal";

const fallbackHardwareImages: Record<string, string> = {
  server: "/images/home/hero-left-tower.png",
  dell: "/images/home/hero-left-tower.png",
  r740: "/images/home/hero-left-tower.png",
  cisco: "/images/home/deal-network-1.png",
  switch: "/images/home/deal-network-1.png",
  network: "/images/home/deal-network-2.png",
  storage: "/images/home/deal-hdd.png",
  drive: "/images/home/deal-hdd.png",
  hdd: "/images/home/deal-hdd.png",
  memory: "/images/home/feature-gpu-evga.png",
  cpu: "/images/home/feature-gpu-evga.png",
  optics: "/images/home/deal-psu.png",
  component: "/images/home/deal-psu.png",
};

function getBannerImage(banner: Banner, index: number): string {
  if (banner.imageUrl && banner.imageUrl.startsWith("http")) {
    return banner.imageUrl;
  }

  const text = (banner.title + " " + banner.subtitle + " " + banner.href).toLowerCase();
  for (const [key, img] of Object.entries(fallbackHardwareImages)) {
    if (text.includes(key)) return img;
  }

  const defaults = [
    "/images/home/hero-left-tower.png",
    "/images/home/deal-network-1.png",
    "/images/home/deal-hdd.png",
    "/images/home/feature-gpu-evga.png",
  ];
  return defaults[index % defaults.length];
}

export default function PromoBanners({ banners }: { banners: Banner[] }) {
  const tiles = banners
    .filter((b) => b.active && b.size !== "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 4);

  if (!tiles.length) return null;

  return (
    <section className="container-se py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <Sparkles size={14} /> Featured Promotions
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy dark:text-white">
            Special Hardware Deals & Offers
          </h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tiles.map((banner, i) => {
          const imgSrc = getBannerImage(banner, i);

          return (
            <Reveal key={banner.id} delay={(i % 2) * 90}>
              <Link
                href={banner.href || "/shop"}
                className="group relative flex min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#061026] via-[#0a1c44] to-[#12336e] p-6 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-lift sm:p-7"
              >
                {/* Background Glow Orbs & Grid Texture */}
                <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:20px_20px]" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand/20 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                <div className="relative z-10 grid w-full items-center gap-4 sm:grid-cols-[1fr_160px]">
                  {/* Left Column: Text & CTA */}
                  <div className="flex flex-col justify-center">
                    <span className="inline-flex w-fit items-center rounded-full bg-brand/25 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-200 border border-brand/40">
                      On Sale This Week
                    </span>
                    <h3 className="mt-3 font-display text-xl font-bold text-white transition-colors group-hover:text-blue-200 sm:text-2xl leading-snug">
                      {banner.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-2">
                      {banner.subtitle}
                    </p>
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white shadow-md transition-all group-hover:bg-brand-hover group-hover:shadow-lg">
                        {banner.ctaLabel || banner.cta || "Shop Now"}
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Hardware Image */}
                  <div className="relative hidden sm:flex h-36 w-full items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent rounded-2xl blur-md" />
                    <Image
                      src={imgSrc}
                      alt={banner.title}
                      fill
                      sizes="160px"
                      className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}