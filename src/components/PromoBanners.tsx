"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Banner } from "@/types/store";
import Reveal from "@/components/Reveal";

export default function PromoBanners({ banners }: { banners: Banner[] }) {
  const tiles = banners
    .filter((b) => b.active && b.size !== "hero")
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 4);

  if (!tiles.length) return null;

  return (
    <section className="container-se py-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {tiles.map((banner, i) => (
          <Reveal key={banner.id} delay={(i % 2) * 90}>
            <Link
              href={banner.href}
              className={`shine group relative block overflow-hidden rounded-2xl text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
                i === 0 ? "min-h-52" : "min-h-44"
              }`}
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(135deg, #243544, #3f6f7a)"
                    : "linear-gradient(135deg, #1c2a38, #6a7c72)",
              }}
            >
              <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,.14)_18px_19px)]" />
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative flex min-h-full flex-col justify-end p-6">
                <h3 className="font-display text-2xl">{banner.title}</h3>
                <p className="mt-2 text-sm text-white/70">{banner.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                  {banner.cta}
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}