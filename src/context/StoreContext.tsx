"use client";

import { STORE_CONTACT } from "@/lib/constants/contact";
import { useGetSettingsQuery } from "@/store/storeApi";
import type { StoreSettings } from "@/types/store";

export const DEFAULT_SETTINGS: StoreSettings = {
  name: STORE_CONTACT.companyName,
  tagline: STORE_CONTACT.tagline,
  phone: STORE_CONTACT.phone,
  email: STORE_CONTACT.email,
  address: STORE_CONTACT.address,
  hours: STORE_CONTACT.hours,
  freeShippingThreshold: 199,
  freeShippingLabel: "Free shipping on orders over $199",
  taxRate: 0.07,
};

export function useStoreSettings() {
  const { data, isSuccess } = useGetSettingsQuery();
  return { settings: data ?? DEFAULT_SETTINGS, ready: isSuccess };
}
