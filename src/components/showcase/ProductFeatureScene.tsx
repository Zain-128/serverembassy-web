"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import type { Product } from "@/types/store";
import DeviceScene from "@/components/3d/DeviceScene";
import MagneticButton from "@/components/ui/MagneticButton";
import { useIsTouch } from "@/lib/motion";

type MotionValue = ReturnType<typeof useSpring>;

function FeaturePoint({
  text,
  index,
  smooth,
}: {
  text: string;
  index: number;
  smooth: MotionValue;
}) {
  const start = 0.28 + index * 0.14;
  const opacity = useTransform(smooth, [start, start + 0.07], [0, 1]);
  const x = useTransform(smooth, [start, start + 0.07], [index % 2 === 0 ? -16 : 16, 0]);
  return (
    <motion.div style={{ opacity, x }} className="flex items-center gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-white shadow-[0_6px_18px_rgba(37,99,235,0.35)]">
        <Check size={15} />
      </span>
      <p className="text-sm font-medium text-navy md:text-base">{text}</p>
    </motion.div>
  );
}

/**
 * Scroll-driven "product launch" section. The featured device stays pinned in
 * the center of the viewport while the scroll progress slowly rotates it,
 * scales it, and reveals feature highlights around it, finishing with a CTA.
 */
export default function ProductFeatureScene({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const touch = useIsTouch();
  const trackRef = useRef<HTMLDivElement>(null);
  const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
  const features = (product.features.length >= 3 ? product.features : [
    ...product.features,
    "Factory-tested performance",
    "Enterprise-grade reliability",
    "Backed by a real warranty",
  ]).slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const rotateY = useTransform(smooth, [0, 0.55, 1], [-16, 0, 30]);
  const scale = useTransform(smooth, [0, 0.55, 1], [0.84, 1.05, 1]);
  const deviceY = useTransform(smooth, [0, 1], ["6vh", "-5vh"]);
  const introOpacity = useTransform(smooth, [0, 0.14, 0.3], [0, 1, 0]);
  const introY = useTransform(smooth, [0, 0.14, 0.3], [30, 0, -24]);
  const lineScale = useTransform(smooth, [0.22, 0.85], [0, 1]);
  const ctaOpacity = useTransform(smooth, [0.82, 0.96], [0, 1]);
  const ctaY = useTransform(smooth, [0.82, 0.96], [30, 0]);

  const points = features.map((text, i) => {
    return { text, i };
  });
  const rotateHint = useTransform(smooth, [0.75, 0.9], [0, 1]);

  if (reduce || touch) {
    return (
      <section className="container-se grid items-center gap-10 py-20 md:grid-cols-2">
        <div>
          <p className="section-label">Spotlight</p>
          <h2 className="mt-2 font-display text-3xl text-navy md:text-4xl">{product.title}</h2>
          <p className="mt-3 max-w-md text-muted">{product.description}</p>
          <ul className="mt-5 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink/80">
                <Check size={15} className="text-brand" /> {f}
              </li>
            ))}
          </ul>
          <Link href={`/product/${product.slug}`} className="btn btn-primary mt-7">
            View product <ArrowRight size={16} />
          </Link>
        </div>
        <DeviceScene product={product} icon={icon} className="mx-auto h-[280px] w-[280px] md:h-[360px] md:w-[360px]" showSku />
      </section>
    );
  }

  return (
    <section ref={trackRef} className="relative h-[360vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* ambient backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(720px 480px at 70% 45%, rgba(37,99,235,0.16), transparent 60%), radial-gradient(560px 380px at 26% 30%, rgba(20,50,110,0.12), transparent 55%)" }}
          aria-hidden
        />
        <div className="container-se grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1fr]">
          {/* intro copy */}
          <div className="relative z-10 order-last px-4 lg:order-first lg:px-0">
            <motion.div style={{ opacity: introOpacity, y: introY }}>
              <p className="section-label">Spotlight</p>
              <h2 className="mt-2 font-display text-3xl text-navy md:text-5xl md:leading-[1.05]">
                A closer look at the
                <br />
                <span className="text-brand">{product.title}</span>
              </h2>
              <p className="mt-4 max-w-md text-muted">{product.description}</p>
            </motion.div>

            {/* feature points */}
            <div className="relative mt-8 space-y-4 lg:mt-10">
              {points.map(({ text, i }) => (
                <FeaturePoint key={text} text={text} index={i} smooth={smooth} />
              ))}
            </div>

            <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="mt-9">
              <MagneticButton href={`/product/${product.slug}`} className="btn btn-primary">
                View product <ArrowRight size={16} />
              </MagneticButton>
            </motion.div>
          </div>

          {/* pinned device */}
          <div className="relative flex h-[320px] items-center justify-center md:h-[440px]">
            <motion.div
              style={{ rotateY, scale, y: deviceY }}
              className="h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
            >
              <div className="persp h-full w-full" style={{ perspective: 1400 }}>
                <DeviceScene product={product} icon={icon} className="h-full w-full" tilt={false} angle={-6} altitude={4} showSku reflection={false} />
              </div>
            </motion.div>

            {/* rotating hint */}
            <motion.p
              className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand backdrop-blur"
              style={{ opacity: rotateHint }}
            >
              &#8635; Scroll keeps rotating
            </motion.p>
          </div>
        </div>

        {/* progress line */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-page" aria-hidden>
          <motion.div className="feature-line h-full w-full origin-top" style={{ scaleY: lineScale }} />
        </div>
      </div>
    </section>
  );
}