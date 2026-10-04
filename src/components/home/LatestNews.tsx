"use client";

import Link from "next/link";

import Image from "next/image";

const posts = [
  {
    date: "27, Jun 2023",
    title: "MAXIMIZED ROI: THE CASE FOR CERTIFIED REFURBISHED ENTERPRISE SERVERS",
    excerpt:
      "Discover how data centers save up to 60% on infrastructure by upgrading with fully tested, OEM-certified server hardware.",
    href: "/shop",
    image: "/images/home/news-circuit.png",
  },
  {
    date: "14, Aug 2023",
    title: "UNDERSTANDING SAS VS. SATA DRIVES FOR ENTERPRISE STORAGE ARRAYS",
    excerpt:
      "Compare throughput, reliability, and cost factors to choose the right storage technology for your mission-critical deployment.",
    href: "/shop",
    image: "/images/home/news-table.png",
  },
  {
    date: "05, Oct 2023",
    title: "TOP HARDWARE UPGRADES TO BOOST DATA CENTER PERFORMANCE IN 2026",
    excerpt:
      "Explore key memory, network adapter, and power redundancy upgrades to optimize uptime and workload capacity.",
    href: "/shop",
    image: "/images/home/news-motherboard.png",
  },
];

export default function LatestNews({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <section className={isLight ? "bg-white text-[#0b1220]" : "bg-[#05070c] text-white"}>
      <div className="container-se py-12 md:py-14">
        <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2
            className={`font-display text-xl font-bold uppercase tracking-[0.04em] sm:text-2xl ${
              isLight ? "text-[#0066ff]" : "text-white"
            }`}
          >
            OUR LATEST NEWS
          </h2>
          <p className={`text-sm ${isLight ? "text-slate-500" : "text-white/50"}`}>
            Dont miss out on this week deals
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <article key={`${post.title}-${index}`} className="group">
              <Link
                href={post.href}
                className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-black/40 transition hover:ring-2 hover:ring-brand/50 shadow-md"
                aria-label={post.title}
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className={`mt-4 text-xs ${isLight ? "text-slate-400" : "text-white/45"}`}>{post.date}</p>
              <h3
                className={`mt-2 font-display text-sm font-bold uppercase leading-snug tracking-wide ${
                  isLight ? "text-[#0b1220]" : "text-white"
                }`}
              >
                <Link href={post.href} className="transition hover:text-brand">
                  {post.title}
                </Link>
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${isLight ? "text-slate-500" : "text-white/50"}`}>
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
