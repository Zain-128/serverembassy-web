"use client";

import { motion } from "motion/react";
import { ShieldCheck, Truck, RefreshCcw, BadgeCheck, Star } from "lucide-react";
import { EASE, VIEWPORT } from "@/lib/motion";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Genuine, tested hardware",
    text: "Every SKU is sourced through trusted channels and bench-tested before it ships.",
  },
  {
    icon: Truck,
    title: "Fast dispatch",
    text: "In-stock items ship within 1–2 business days from our warehouse.",
  },
  {
    icon: RefreshCcw,
    title: "30-day returns",
    text: "RMA-backed return window gives you confidence in every purchase.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty included",
    text: "Each product ships with a real warranty backing from our team.",
  },
];

const stats = [
  { value: "1–2", label: "Day dispatch" },
  { value: "30", label: "Day returns" },
  { value: "100%", label: "Tested batch" },
  { value: "4.9★", label: "Buyer rating" },
];

export default function ValueProp() {
  return (
    <section className="container-se py-16">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="section-label">Why Server Embassy</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
            Built for teams that run on uptime
          </h2>
          <p className="mt-3 max-w-md text-muted">
            We&apos;re a specialty IT hardware reseller — not a marketplace of listings. Every unit is a
            real, tested, warranty-backed product ready to ship to your rack.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:max-w-md">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-brand">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              className="group rounded-3xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
            >
              <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                <b.icon size={22} />
              </span>
              <h3 className="mt-4 font-semibold text-navy">{b.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialBar() {
  return (
    <motion.div
      className="mt-4 flex max-w-md items-center gap-3 text-sm text-muted"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span>Loved by IT teams across the country</span>
    </motion.div>
  );
}