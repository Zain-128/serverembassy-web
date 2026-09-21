"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Judy D.",
    role: "Customer",
    quote:
      "Ordered replacement drives for a production array and had them on the dock in two days — tested, labeled, and ready to slot in.",
  },
  {
    name: "Marcus R.",
    role: "Customer",
    quote:
      "Hard-to-find switch modules showed up with matching firmware notes. Pricing beat our usual distributor by a clear margin.",
  },
  {
    name: "Priya S.",
    role: "Customer",
    quote:
      "Volume quote turned around the same afternoon. Every PSU in the shipment powered up clean on first rack install.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se pb-14 pt-4 md:pb-16">
        <h2 className="mb-10 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Customer Reviews
        </h2>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {reviews.map((r) => (
            <figure key={r.name} className="max-w-sm">
              <blockquote className="text-sm leading-relaxed text-white/70">
                {r.quote}
              </blockquote>
              <div className="mt-4 flex items-center gap-0.5 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <figcaption className="mt-3 text-sm text-white/80">
                <p>-{r.name}</p>
                <p className="text-white/45">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
