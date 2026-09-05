"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/store";
import Reveal from "@/components/Reveal";

const palettes: Record<string, [string, string]> = {
  switch: ["#1c2a38", "#3f6f7a"],
  hdd: ["#243544", "#4a7a86"],
  ssd: ["#1c2a38", "#5c7d88"],
  memory: ["#243544", "#3f6f7a"],
  psu: ["#1c2a38", "#6a7c72"],
  cpu: ["#243544", "#4d6e7a"],
  router: ["#1c2a38", "#3f6f7a"],
  network: ["#243544", "#3f6f7a"],
};

export default function CategoryBannerGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;

  return (
    <section className="container-se py-16">
      <Reveal>
        <div className="mb-8">
          <p className="section-label">Catalog</p>
          <h2 className="mt-2 text-3xl text-navy">Shop by category</h2>
          <p className="mt-2 max-w-xl text-muted">
            Category banners for the hardware families we stock every week.
          </p>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const [from, to] = palettes[cat.icon ?? "network"] ?? palettes.network;
          return (
            <Reveal key={cat.id} delay={(i % 3) * 90}>
              <Link
                href={`/shop/${cat.slug}`}
                className="shine group relative block min-h-52 overflow-hidden rounded-2xl text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                style={{ background: `linear-gradient(145deg, ${from}, ${to})` }}
              >
                <div className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,.14)_18px_19px)]" />
                <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 transition-transform duration-700 group-hover:scale-[1.35]" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-xl" />
                <div className="relative flex min-h-52 flex-col justify-end p-6">
                  <h3 className="font-display text-2xl tracking-tight">
                    {cat.bannerTitle || cat.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-white/70">
                    {cat.bannerSubtitle || cat.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                    Shop {cat.name}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}