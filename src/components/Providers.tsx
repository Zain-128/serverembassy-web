"use client";

import type { ReactNode } from "react";
import ReduxProvider from "@/store/ReduxProvider";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/context/ThemeContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
