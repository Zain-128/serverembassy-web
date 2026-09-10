"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function AddToCartButton({
  productId,
  label = "Add to Cart",
  className = "btn btn-primary px-3 py-2 text-sm",
  qty = 1,
  onAdd,
}: {
  productId: string;
  label?: string;
  className?: string;
  qty?: number;
  onAdd?: () => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(productId, qty);
        onAdd?.();
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            className="inline-flex items-center gap-1.5"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
          >
            <Check size={16} /> Added
          </motion.span>
        ) : (
          <motion.span key="label" className="inline-flex items-center gap-1.5">
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}