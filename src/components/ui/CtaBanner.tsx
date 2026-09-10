"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { EASE, VIEWPORT } from "@/lib/motion";

/**
 * Premium editorial CTA banner — layered gradient, grid texture, glow orbs,
 * floating device optional. Reused for deals, newsletter, final CTA.
 */
export default function CtaBanner({
  eyebrow,
  title,
  description,
  cta,
  href,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  cta: string;
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.section
      className="container-se py-12"
      initial={{ opacity: 0, scale: 0.99 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-mid via-navy to-navy-mid px-8 py-12 text-white shadow-lift md:px-12">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0_28px,rgba(255,255,255,.1)_28px_29px)]" />
        <div className="anim-orb absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/40 blur-2xl" />
        <div className="anim-orb-2 absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#2f6fe4]/30 blur-2xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.2fr_auto]">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
            {description ? <p className="mt-3 max-w-xl text-white/70">{description}</p> : null}
          </div>
          <div className="flex flex-col items-start gap-4">
            {children}
            <Link href={href} className="btn btn-primary group bg-white! text-navy! hover:bg-brand-soft!">
              {cta}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}