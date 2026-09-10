"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useIsTouch } from "@/lib/motion";

/**
 * Magnetic hover element — drifts gently toward the cursor within a small
 * radius and springs back on leave. Renders a <button> by default or a
 * next/link when `href` is provided. Touch & reduced-motion safe.
 */
export default function MagneticButton({
  href,
  children,
  className = "",
  strength = 0.35,
  onClick,
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const touch = useIsTouch();
  const ref = useRef<HTMLElement>(null);
  const x = useRef(0);
  const y = useRef(0);

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce || touch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.current = (e.clientX - (rect.left + rect.width / 2)) * strength;
    y.current = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate3d(${x.current}px, ${y.current}px, 0)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
  }

  const shared = {
    ref: ref as never,
    className: `${className} will-change-transform`,
    "aria-label": ariaLabel,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
  };

  return (
    <motion.span
      whileHover={reduce || touch ? undefined : { scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="inline-block"
    >
      {href ? (
        <Link href={href} {...shared}>
          {children}
        </Link>
      ) : (
        <button type="button" {...shared}>
          {children}
        </button>
      )}
    </motion.span>
  );
}