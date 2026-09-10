"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { EASE, VIEWPORT } from "@/lib/motion";

/**
 * Consistent section header used across the whole site:
 * <eyebrow> <title> <description> + optional "View all" link.
 * Wrapped in a fade-up reveal.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  href,
  hrefLabel = "View all",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <motion.div
      className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${
        align === "center" ? "text-center" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={align === "center" ? "mx-auto" : ""}>
        <p className="section-label">{eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className={`mt-2 max-w-2xl text-muted ${align === "center" ? "mx-auto" : ""}`}>
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
        >
          {hrefLabel}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      ) : null}
    </motion.div>
  );
}