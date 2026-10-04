"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Marcus Vance",
    role: "IT Infrastructure Manager, CloudNode",
    quote:
      "Powerline Devices sourced 20 custom server nodes with exact SKU specs in under 48 hours. Excellent service and pristine hardware condition.",
  },
  {
    name: "Sarah Jenkins",
    role: "Lead Network Engineer, TechCore",
    quote:
      "Fast shipping, genuine enterprise components, and flawless testing. Their technical team helped us configure our entire rack setup effortlessly.",
  },
  {
    name: "David Miller",
    role: "Operations Director, DataVault",
    quote:
      "Extremely reliable source for hard-to-find replacement parts. Outstanding support, prompt warranty handling, and competitive pricing.",
  },
];

export default function Testimonials({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const isLight = theme === "light";
  return (
    <section className={isLight ? "bg-white text-[#0b1220]" : "bg-[#05070c] text-white"}>
      <div className="container-se pb-14 pt-4 md:pb-16">
        <h2
          className={`mb-10 font-display text-3xl font-bold tracking-tight sm:text-4xl ${
            isLight ? "text-[#0066ff]" : "text-white"
          }`}
        >
          Customer Reviews
        </h2>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {reviews.map((r, idx) => (
            <figure key={`rev-${idx}`} className="max-w-sm">
              <blockquote className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-white/80"}`}>
                {r.quote}
              </blockquote>
              {/* Stars are present in black theme in Figma */}
              {!isLight ? (
                <div className="mt-4 flex items-center gap-1 text-amber-400" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              ) : null}
              <figcaption className="mt-4 text-sm font-medium">
                <span className="text-[#d97706] font-semibold block">-{r.name}</span>
                <span className={`text-xs block ${isLight ? "text-slate-500" : "text-white/60"}`}>{r.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
