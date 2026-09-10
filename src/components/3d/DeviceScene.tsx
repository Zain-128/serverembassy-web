"use client";

import { type ReactNode } from "react";
import type { Product } from "@/types/store";
import ProductVisual from "@/components/ProductVisual";
import Tilt3D from "@/components/3d/Tilt3D";

/**
 * Pseudo-3D presentation of a product "device". ProductVisual art becomes the
 * front face of a floating slab with depth plates, a light sheen, a soft
 * glow and a floor shadow/reflection — giving a physical, showroom feel
 * without any real 3D assets.
 *
 * Usage surfaces (hero, cards, product gallery) all feed the same
 * `{ product, icon }` contract as the legacy ProductVisual.
 */
export default function DeviceScene({
  product,
  icon,
  className = "",
  tilt = true,
  float = true,
  angle = 0,
  altitude = 0,
  glow = true,
  reflection = true,
  interactive = true,
  showSku = false,
}: {
  product: Product;
  icon: string;
  className?: string;
  /** Enable cursor tilt (desktop only; auto-disabled on touch). */
  tilt?: boolean;
  /** Idle floating motion. */
  float?: boolean;
  /** Base rotation in deg (gallery "views"). */
  angle?: number;
  /** Base X rotation in deg. */
  altitude?: number;
  glow?: boolean;
  reflection?: boolean;
  interactive?: boolean;
  showSku?: boolean;
}) {
  const face = <ProductVisual product={product} icon={icon} className="h-full w-full" />;

  const object = (
    <div className="preserve-3d relative h-full w-full" style={{ transform: `rotateY(${angle}deg) rotateX(${altitude}deg)` }}>
      <div className="device-sheen preserve-3d absolute inset-0 backface-hidden">
        <div className="absolute inset-0 translate-z-0 backface-hidden rounded-[1.35rem]">{face}</div>
        <div className="absolute inset-0 rounded-[1.35rem] bg-[#0a1830] backface-hidden" style={{ transform: "translateZ(-20px)" }} />
        <div className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-navy-mid/80 to-[#071225]/90 backface-hidden" style={{ transform: "translateZ(-10px)" }} />
        <div className="device-edge-light absolute inset-x-4 top-0 h-px rounded-full" style={{ transform: "translateZ(2px)" }} />
        {showSku ? (
          <p
            className="absolute left-4 top-3 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10px] tracking-wide text-white/80 backdrop-blur-sm"
            style={{ transform: "translateZ(30px)" }}
          >
            {product.sku}
          </p>
        ) : null}
      </div>
    </div>
  );

  const inner = tilt ? (
    <Tilt3D className="h-full w-full">{object}</Tilt3D>
  ) : (
    object
  );

  return (
    <div className={`relative ${className}`}>
      {glow ? (
        <div
          className="anim-pulse-glow absolute left-1/2 top-1/2 -z-10 h-[130%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(59,130,246,0.32), transparent 70%)" }}
        />
      ) : null}

      <div className={float ? "anim-float-y-slow h-full will-change-transform" : "h-full"}>
        {inner}
      </div>

      <div
        className="device-floor pointer-events-none absolute inset-x-[12%] -bottom-[6%] h-[14%]"
        style={{ opacity: interactive ? 1 : 0.6 }}
      />

      {reflection ? <Reflection>{face}</Reflection> : null}
    </div>
  );
}

function Reflection({ children }: { children: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-x-[6%] top-full mt-2 h-[42%] overflow-hidden opacity-15 blur-[3px]" aria-hidden>
      <div className="-scale-y-100 origin-top">{children}</div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, var(--color-page) 92%)" }} />
    </div>
  );
}