"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { EASE } from "@/lib/motion";

/**
 * Subtle page transition wrapper. Keyed to the route so every navigation
 * fades + rises in place (no blocking full-screen loader). Respects reduced
 * motion by rendering children statically.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}