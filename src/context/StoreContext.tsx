"use client";

import { useGetSettingsQuery } from "@/store/storeApi";
import type { StoreSettings } from "@/types/store";

export const DEFAULT_SETTINGS: StoreSettings = {
  name: "Server Embassy",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  freeShippingThreshold: 199,
  freeShippingLabel: "Free shipping on orders over $199",
  taxRate: 0.07,
};

export function useStoreSettings() {
  const { data, isSuccess } = useGetSettingsQuery();
  return { settings: data ?? DEFAULT_SETTINGS, ready: isSuccess };
}
