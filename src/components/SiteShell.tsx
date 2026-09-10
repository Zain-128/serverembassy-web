import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import type { ReactNode } from "react";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}