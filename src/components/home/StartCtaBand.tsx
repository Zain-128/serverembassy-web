"use client";

import Link from "next/link";

export default function StartCtaBand() {
  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se border-t border-white/10 py-12 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl gap-4 sm:gap-5">
            <span
              className="mt-1 shrink-0 font-display text-3xl font-bold leading-none tracking-tighter text-brand sm:text-4xl"
              aria-hidden
            >
              ≫≫
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Don&apos;t Know Where To Start?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                Send a part number, BOM, or rack photo — our team maps availability, lead time, and
                volume pricing so you can move fast.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <Link
              href="/contact"
              className="text-sm font-semibold text-white transition hover:text-brand"
            >
              Get In Touch
            </Link>
            <Link
              href="/#quote"
              className="rounded-lg bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            >
              Schedule A Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
