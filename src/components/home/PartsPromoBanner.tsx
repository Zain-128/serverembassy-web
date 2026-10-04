"use client";

import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function PartsPromoBanner({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";

  return (
    <section
      className={`overflow-visible ${isLight
        ? "bg-white pt-16 pb-16 sm:pt-20 sm:pb-20"
        : "bg-black pt-16 pb-16 sm:pt-20 sm:pb-24"
        }`}
    >
      <div className="container-se overflow-visible">
        <Reveal>
          {/* Blue Banner Card */}
          <div className="relative rounded-2xl sm:rounded-[26px] bg-gradient-to-r from-[#0066ff] via-[#0055e6] to-[#0038a8] pl-6 sm:pl-10 md:pl-12 lg:pl-14 pr-6 sm:pr-8 lg:pr-4 py-8 sm:py-10 lg:py-6 shadow-[0_16px_48px_rgba(0,102,255,0.28)]">
            {/* Subtle background dot-mesh pattern */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[26px] opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] [background-size:24px_24px]"
              aria-hidden
            />

            <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_1.15fr]">
              {/* Left Content Column */}
              <div className="relative z-10 max-w-xl text-white">
                {/* On Sale This Week Pill Badge */}
                <span className="inline-flex items-center rounded-full bg-white px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-[#0066ff] shadow-sm">
                  On Sale This Week
                </span>

                {/* Main Heading */}
                <h2 className="mt-4 sm:mt-5 font-display text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold leading-[1.16] tracking-tight text-white">
                  Search and Order All Your Device Parts in One Location
                </h2>

                {/* Subtitle Description */}
                <p className="mt-3 sm:mt-3.5 max-w-sm text-xs sm:text-sm font-normal leading-relaxed text-white/80">
                  Find genuine replacement parts, memory modules, system boards, and power supplies with guaranteed compatibility.
                </p>

                {/* Shop Now Link */}
                <Link
                  href="/shop"
                  className="mt-5 sm:mt-6 inline-block text-xs sm:text-sm font-semibold text-white transition hover:underline"
                >
                  Shop Now
                </Link>
              </div>

              {/* Right Visual Column: PC Towers protruding on top, bottom, and right edge */}
              <div className="relative z-20 flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
                <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none lg:w-[560px] xl:w-[640px] 2xl:w-[690px] aspect-[16/10] -mt-8 sm:-mt-12 lg:-mt-22 xl:-mt-26 lg:-mb-10 xl:-mb-14 lg:-mr-12 xl:-mr-16 2xl:-mr-20">
                  <Image
                    src="/images/home/pc-towers-banner.png"
                    alt="Search and order device parts"
                    fill
                    priority
                    className="object-contain object-bottom drop-shadow-[0_24px_50px_rgba(0,0,0,0.7)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
