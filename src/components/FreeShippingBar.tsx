"use client";

import { formatMoney } from "@/lib/format";
import { useStoreSettings } from "@/context/StoreContext";
import { useCart } from "@/lib/cart";

export default function FreeShippingBar({ compact = false }: { compact?: boolean }) {
  const { settings } = useStoreSettings();
  const { subtotal, remainingForFreeShipping, freeShippingUnlocked, progress, count } =
    useCart();

  if (count === 0 && compact) return null;

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-line bg-white/70 p-3.5"
          : "rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft/60 to-white p-4"
      }
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
        {freeShippingUnlocked ? (
          <p className="font-semibold text-brand-dark">You unlocked free shipping</p>
        ) : (
          <p className="text-ink">
            Add <strong>{formatMoney(remainingForFreeShipping)}</strong> more for free shipping
          </p>
        )}
        <span className="text-xs text-muted tabular-nums">
          {formatMoney(subtotal)} / {formatMoney(settings.freeShippingThreshold)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-[#1d4ed8] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
