"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { hydrateCart, type CartLine } from "./cartSlice";
import { makeStore, useAppDispatch, useAppSelector } from "./index";

const KEY = "se-cart";

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function CartPersist() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const hydrated = useAppSelector((s) => s.cart.hydrated);

  useEffect(() => {
    dispatch(hydrateCart(readCart()));
  }, [dispatch]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [hydrated, items]);

  return null;
}

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <CartPersist />
      {children}
    </Provider>
  );
}
