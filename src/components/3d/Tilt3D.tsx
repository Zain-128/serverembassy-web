"use client";

import { useCallback, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useIsTouch } from "@/lib/motion";

/**
 * Cursor-following 3D tilt wrapper. Applies rotateX/rotateY toward the
 * pointer with spring smoothing and returns to rest on leave.
 *
 * - Disabled on touch devices and for users who prefer reduced motion.
 * - Set a parent `perspective` via <Tilt3D perspective={...}/> (it renders
 *   its own .persp stage).
 */
export default function Tilt3D({
  children,
  className = "",
  maxTilt = 9,
  scale = 1.03,
  perspective = 1100,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  perspective?: number;
}) {
  const reduce = useReducedMotion();
  const touch = useIsTouch();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const s = useMotionValue(1);
  const sx = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.6 });
  const ss = useSpring(s, { stiffness: 260, damping: 24 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || touch) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      ry.set(px * maxTilt * 2);
      rx.set(-py * maxTilt * 2);
      s.set(scale);
    },
    [reduce, touch, maxTilt, scale, rx, ry, s],
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    s.set(1);
  }, [rx, ry, s]);

  if (reduce || touch) {
    return <div className={`${className} block`}>{children}</div>;
  }

  return (
    <div className={`persp ${className}`} style={{ perspective }}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="preserve-3d will-change-transform h-full w-full"
        style={{ rotateX: sx, rotateY: sy, scale: ss, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}