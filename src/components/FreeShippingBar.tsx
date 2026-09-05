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
    <div className={compact ? "border border-line bg-white p-3" : "border border-line bg-brand-soft p-4"}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
        {freeShippingUnlocked ? (
          <p className="font-semibold text-brand-dark">You unlocked free shipping</p>
        ) : (
          <p className="text-ink">
            Add <strong>{formatMoney(remainingForFreeShipping)}</strong> more for free
            shipping
          </p>
        )}
        <span className="text-xs text-muted">
          {formatMoney(subtotal)} / {formatMoney(settings.freeShippingThreshold)}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden bg-line">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
