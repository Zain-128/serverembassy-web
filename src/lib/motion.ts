import { useEffect, useState } from "react";

/** Convenient easing curve used across the site. */
export const EASE = [0.22, 0.61, 0.36, 1] as const;

/** Shared viewport config so every reveal behaves identically. */
export const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export const stagger = (delay = 0.06) => ({
  visible: { transition: { staggerChildren: delay } },
});

/**
 * True when the device uses a coarse pointer (touch) — used to disable
 * cursor-driven 3D effects on mobile.
 */
export function useIsTouch() {
  const [touch, setTouch] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = (e: MediaQueryListEvent) => setTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return touch;
}

export { useReducedMotion } from "motion/react";