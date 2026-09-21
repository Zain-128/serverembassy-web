"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    name: "Judy D, Customer",
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  },
  {
    name: "Judy D, Customer",
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  },
  {
    name: "Judy D, Customer",
    quote:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#05070c] text-white">
      <div className="container-se pb-14 pt-4 md:pb-16">
        <h2 className="mb-10 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Customer Reviews
        </h2>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {reviews.map((r, idx) => (
            <figure key={`rev-${idx}`} className="max-w-sm">
              <blockquote className="text-sm leading-relaxed text-white/80">
                {r.quote}
              </blockquote>
              <div className="mt-4 flex items-center gap-1 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <figcaption className="mt-3 text-sm text-[#eab308]">
                -{r.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
