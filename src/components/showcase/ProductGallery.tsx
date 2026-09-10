"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCw } from "lucide-react";
import type { Product } from "@/types/store";
import DeviceScene from "@/components/3d/DeviceScene";
import { EASE } from "@/lib/motion";

type View = { id: string; label: string; angle: number; altitude: number };

const views: View[] = [
  { id: "front", label: "Front", angle: 0, altitude: 0 },
  { id: "iso", label: "3/4", angle: 22, altitude: -6 },
  { id: "top", label: "Top", angle: 0, altitude: 48 },
];

/**
 * Interactive product gallery for the detail page — the device is presented
 * in pseudo-3D with a set of camera views, floating motion and a live cursor
 * tilt. Smoothly cross-fades between views.
 */
export default function ProductGallery({
  product,
  icon,
}: {
  product: Product;
  icon: string;
}) {
  const [view, setView] = useState(views[0]);

  return (
    <div className="relative">
      <div className="relative aspect-square w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={view.id}
            className="h-full w-full"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* translucent showroom plinth */}
            <div
              className="absolute inset-x-[6%] top-[6%] bottom-[12%] rounded-[1.6rem] border border-line/80 opacity-80"
              aria-hidden
            />
            <DeviceScene
              product={product}
              icon={icon}
              className="h-full w-full"
              angle={view.angle}
              altitude={view.altitude}
              showSku
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-white/85 text-muted backdrop-blur transition-colors hover:border-brand/40 hover:text-brand active:rotate-45"
          aria-label="Rotate view"
          title="Rotate view"
          onClick={() => setView(views[(views.findIndex((v) => v.id === view.id) + 1) % views.length])}
        >
          <RotateCw size={16} />
        </button>
      </div>

      {/* view selector */}
      <div className="mt-4 flex justify-center gap-2">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
              view.id === v.id
                ? "bg-navy text-white shadow-card"
                : "bg-white text-muted ring-1 ring-line hover:text-navy"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-muted">
        Interactive 3D presentation · drag-free cursor tilt · image may not exactly match the product.
      </p>
    </div>
  );
}