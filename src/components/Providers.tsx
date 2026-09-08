"use client";

import type { ReactNode } from "react";
import ReduxProvider from "@/store/ReduxProvider";
import { ToastProvider } from "@/components/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ToastProvider>{children}</ToastProvider>
    </ReduxProvider>
  );
}
