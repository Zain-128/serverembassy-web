"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { STORE_CONTACT } from "@/lib/constants/contact";

export default function StartCtaBand({ theme = "dark" }: { theme?: "dark" | "light" }) {
  return (
    <section className="container-se py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#030a1c] via-[#091a3e] to-[#0052cc] p-8 sm:p-10 md:p-12 text-white shadow-lift">
        {/* Background Mesh/Glow Accent */}
        <div className="pointer-events-none absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-2xl items-center gap-4 sm:gap-6">
            <div className="shrink-0 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-white border border-white/15 shadow-inner">
              <PhoneCall size={26} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Don&apos;t Know Where To Start ?
              </h2>
              <p className="mt-2 max-w-lg text-sm font-medium text-white/80 leading-relaxed sm:text-base">
                Our IT hardware engineers are ready to assist you in designing, upgrading, or scaling your enterprise infrastructure.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href={`tel:${STORE_CONTACT.phoneRaw}`}
              className="text-sm font-semibold text-white hover:text-blue-200 transition-colors underline-offset-4 hover:underline"
            >
              Call: {STORE_CONTACT.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-hover hover:scale-105"
            >
              Get In Touch <ArrowRight size={16} className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
