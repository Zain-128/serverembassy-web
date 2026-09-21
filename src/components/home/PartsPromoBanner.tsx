"use client";

import Link from "next/link";
import type { Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import Reveal from "@/components/Reveal";

export default function PartsPromoBanner({ products = [] }: { products?: Product[] }) {
  const visuals = products.slice(0, 3);

  return (
    <section className="bg-[#05070c]">
      <div className="container-se py-10 md:py-12">
        <Reveal>
          <div className="relative overflow-visible rounded-[2rem] bg-gradient-to-r from-[#1a6dff] via-[#2563eb] to-[#1d4ed8] md:rounded-[2.5rem]">
            <div
              className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] [background-size:22px_22px]"
              aria-hidden
            />
            <div className="pointer-events-none absolute -right-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" aria-hidden />

            <div className="relative grid items-center gap-8 px-7 py-10 sm:px-10 md:grid-cols-[1.05fr_0.95fr] md:px-12 md:py-14 lg:px-14">
              <div className="relative z-10 max-w-xl text-white">
                <span className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand">
                  On Sale This Week
                </span>
                <h2 className="mt-5 font-display text-[clamp(1.65rem,3.4vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white">
                  Search And Order All Your Device Parts In One Location
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                  Servers, storage, networking, and components — sourced, tested, and ready to ship from a single catalog.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex text-base font-bold text-white transition hover:translate-x-1"
                >
                  Shop Now
                </Link>
              </div>

              <div className="relative mx-auto flex h-[220px] w-full max-w-lg items-end justify-center md:h-[280px] md:max-w-none lg:h-[300px]">
                {(visuals.length ? visuals : [null, null, null]).map((product, i) => {
                  const positions = [
                    "z-[1] left-[2%] bottom-2 w-[38%] rotate-[-8deg] md:left-0",
                    "z-[2] left-1/2 bottom-0 w-[42%] -translate-x-1/2 md:bottom-1",
                    "z-[3] right-[2%] bottom-3 w-[38%] rotate-[7deg] md:right-0",
                  ];
                  return (
                    <div
                      key={product?.id ?? `slot-${i}`}
                      className={`anim-float absolute overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-1.5 shadow-[0_28px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm ${positions[i]}`}
                      style={{ animationDelay: `${i * 0.35}s` }}
                    >
                      {product ? (
                        <div className="aspect-[4/5] overflow-hidden rounded-xl">
                          <ProductVisual
                            product={product}
                            icon={product.category?.slug?.includes("drive") ? "hdd" : i === 1 ? "switch" : "network"}
                            className="h-full"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-white/25 to-navy/40" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
