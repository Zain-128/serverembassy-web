"use client";

import { useCallback, useMemo } from "react";
import { addItem, clearCart, removeItem, setItemQty } from "./cartSlice";
import { useAppDispatch, useAppSelector } from "./index";
import { useGetProductsByIdsQuery, useGetSettingsQuery } from "./storeApi";
import type { Product } from "@/types/store";

const FALLBACK_SETTINGS = {
  freeShippingThreshold: 199,
  taxRate: 0.07,
  freeShippingLabel: "Free shipping on orders over $199",
  name: "Server Embassy",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
};

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const { data: settingsData } = useGetSettingsQuery();
  const settings = settingsData ?? FALLBACK_SETTINGS;
  const ids = items.map((line) => line.productId);
  const { data: products = [] } = useGetProductsByIdsQuery(ids, { skip: ids.length === 0 });

  const add = useCallback(
    (productId: string, qty = 1) => {
      dispatch(addItem({ productId, qty }));
    },
    [dispatch],
  );
  const setQty = useCallback(
    (productId: string, qty: number) => {
      dispatch(setItemQty({ productId, qty }));
    },
    [dispatch],
  );
  const remove = useCallback(
    (productId: string) => {
      dispatch(removeItem(productId));
    },
    [dispatch],
  );
  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return useMemo(() => {
    const productMap = new Map(products.map((p) => [p.id, p]));
    const lines = items
      .map((line) => {
        const product = productMap.get(line.productId);
        return product ? { product, qty: line.qty } : null;
      })
      .filter((line): line is { product: Product; qty: number } => Boolean(line));

    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
    const threshold = settings.freeShippingThreshold;
    const remainingForFreeShipping = Math.max(0, threshold - subtotal);
    const freeShippingUnlocked = subtotal >= threshold && subtotal > 0;
    const shipping = subtotal === 0 || freeShippingUnlocked ? 0 : 14.99;
    const tax = subtotal * settings.taxRate;
    const progress = Math.min(100, (subtotal / threshold) * 100);

    return {
      items,
      lines,
      count: lines.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      remainingForFreeShipping,
      freeShippingUnlocked,
      progress,
      settings,
      add,
      setQty,
      remove,
      clear,
    };
  }, [add, clear, items, products, remove, setQty, settings]);
}
