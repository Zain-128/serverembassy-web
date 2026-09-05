"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function AddToCartButton({
  productId,
  label = "Add to Cart",
  className = "btn btn-primary px-3 py-2 text-sm",
}: {
  productId: string;
  label?: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(productId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Added" : label}
    </button>
  );
}
