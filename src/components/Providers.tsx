"use client";

import type { ReactNode } from "react";
import ReduxProvider from "@/store/ReduxProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
