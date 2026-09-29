"use client";

import Link from "next/link";
import Image from "next/image";

export interface BrandItem {
  id: string;
  name: string;
  src: string;
  href: string;
  width: number;
  height: number;
}

export const FIGMA_BRANDS: BrandItem[] = [
  {
    id: "juniper",
    name: "Juniper Networks",
    src: "/images/home/brand-juniper.png",
    href: "/shop?q=Juniper",
    width: 154,
    height: 54,
  },
  {
    id: "synology",
    name: "Synology",
    src: "/images/home/brand-synology.png",
    href: "/shop?q=Synology",
    width: 128,
    height: 46,
  },
  {
    id: "veeam",
    name: "VeeAM",
    src: "/images/home/brand-veeam.png",
    href: "/shop?q=VeeAM",
    width: 140,
    height: 40,
  },
  {
    id: "hpe",
    name: "HPE",
    src: "/images/home/brand-hpe.png",
    href: "/shop?q=HPE",
    width: 120,
    height: 44,
  },
  {
    id: "dell",
    name: "Dell Technologies",
    src: "/images/home/brand-dell.png",
    href: "/shop?q=Dell",
    width: 168,
    height: 40,
  },
  {
    id: "cisco",
    name: "CISCO",
    src: "/images/home/brand-cisco.png",
    href: "/shop?q=Cisco",
    width: 104,
    height: 56,
  },
];

export default function BrandLogoSlider({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";

  // Quadruple the array for completely seamless, gap-free infinite scrolling
  const sliderItems = [
    ...FIGMA_BRANDS,
    ...FIGMA_BRANDS,
    ...FIGMA_BRANDS,
    ...FIGMA_BRANDS,
  ];

  return (
    <div
      className={`relative w-full overflow-hidden border-b-2 border-[#0066ff] shadow-[0_4px_20px_rgba(0,102,255,0.15)] ${
        isLight
          ? "border-t border-gray-200 bg-[#f4f6fa]"
          : "border-t border-white/5 bg-[#181a20]"
      }`}
    >
      {/* Left & Right gradient edge fades */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-28 bg-gradient-to-r ${
          isLight
            ? "from-[#f4f6fa] to-transparent"
            : "from-[#181a20] to-transparent"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-28 bg-gradient-to-l ${
          isLight
            ? "from-[#f4f6fa] to-transparent"
            : "from-[#181a20] to-transparent"
        }`}
      />

      {/* Marquee Track */}
      <div className="flex items-center py-5 sm:py-6">
        <div className="animate-brand-marquee flex items-center gap-12 sm:gap-16 lg:gap-24">
          {sliderItems.map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={brand.href}
              title={brand.name}
              className="group relative flex shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              <div
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isLight
                    ? "brightness-0 opacity-70 group-hover:opacity-100"
                    : "opacity-85 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] group-hover:opacity-100 group-hover:drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
                }`}
                style={{ width: `${brand.width}px`, height: `${brand.height}px` }}
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  sizes="200px"
                  className="object-contain"
                  priority={idx < 6}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
