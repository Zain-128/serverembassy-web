"use client";

import { useCallback } from "react";
import { toggleWishlist } from "./wishlistSlice";
import { useAppDispatch, useAppSelector } from "./index";
import { useToast } from "@/components/Toast";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.wishlist.items);
  const toast = useToast().toast;

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  const toggle = useCallback(
    (productId: string, title?: string) => {
      const exists = items.includes(productId);
      dispatch(toggleWishlist(productId));
      if (exists) {
        toast(title ? `Removed from wishlist: ${title}` : "Removed from wishlist", "info");
      } else {
        toast(title ? `Added to wishlist: ${title}` : "Added to wishlist", "success");
      }
    },
    [dispatch, items, toast],
  );

  return {
    items,
    count: items.length,
    isWishlisted,
    toggle,
  };
}
