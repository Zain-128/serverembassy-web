"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { EASE, VIEWPORT } from "@/lib/motion";

const reviews = [
  {
    name: "Marcus R.",
    role: "IT Director · Data Center",
    quote:
      "Rec'd a batch of drives next-day that three other resellers couldn't source. Tested, boxed, and invoiced properly.",
    initials: "MR",
  },
  {
    name: "Priya S.",
    role: "Procurement Lead",
    quote:
      "The catalog made finding a matching SFP transceiver trivial. Pricing beats the big-name distributors.",
    initials: "PS",
  },
  {
    name: "Dan K.",
    role: "Sysadmin",
    quote:
      "Refreshed a full rack without a single DOA unit. The warranty backing gave us real confidence.",
    initials: "DK",
  },
];

export default function Testimonials() {
  return (
    <section className="container-se py-16">
      <motion.div
        className="mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <p className="section-label">Testimonials</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Trusted by teams who can&apos;t afford downtime
        </h2>
        <p className="mt-2 text-muted">
          Real feedback from the datacenter floor, engineering, and procurement.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            className="relative flex h-full flex-col justify-between rounded-3xl border border-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <Quote className="absolute right-6 top-6 text-brand-soft" size={32} />
            <blockquote className="pr-4 text-sm leading-relaxed text-ink/85">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                {r.initials}
              </span>
              <div>
                <p className="font-medium text-navy">{r.name}</p>
                <p className="text-xs text-muted">{r.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}