"use client";

import Link from "next/link";

export default function StartCtaBand() {
  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se border-t border-white/10 py-12 md:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl items-center gap-4 sm:gap-6">
            <div className="shrink-0 text-[#0066ff]">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="currentColor">
                <path d="M6 6L28 18L6 30V6Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Don&apos;t Know Where To Start ?
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
