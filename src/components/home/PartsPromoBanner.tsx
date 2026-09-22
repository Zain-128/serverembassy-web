"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PartsPromoBanner() {
  return (
    <section className="bg-[#05070c]">
      <div className="container-se py-10 md:py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0066ff] via-[#0055e0] to-[#0040c0] md:rounded-[2.5rem]">
            <div
              className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.4)_1px,transparent_0)] [background-size:20px_20px]"
              aria-hidden
            />

            <div className="relative grid items-center gap-8 px-7 py-10 sm:px-10 md:grid-cols-[1.05fr_0.95fr] md:px-12 md:py-12 lg:px-14">
              <div className="relative z-10 max-w-xl text-white">
                <span className="inline-flex rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0066ff]">
                  On Sale This Week
                </span>
                <h2 className="mt-5 font-display text-[clamp(1.65rem,3.4vw,2.75rem)] font-bold leading-[1.12] tracking-tight text-white">
                  Search And order All Your device Parts In One Location
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex text-base font-bold text-white transition hover:translate-x-1"
                >
                  Shop Now
                </Link>
              </div>

              <div className="relative mx-auto flex h-[240px] w-full max-w-md items-center justify-center md:h-[300px] md:max-w-none lg:h-[320px]">
                <Image
                  src="/images/home/pc-towers-banner.png"
                  alt="Search and order device parts"
                  width={600}
                  height={400}
                  className="h-full w-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
