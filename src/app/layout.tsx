import type { Metadata } from "next";
import { Figtree, Sora } from "next/font/google";
import Providers from "@/components/Providers";
import SiteShell from "@/components/SiteShell";
import { getStoreSettings } from "@/lib/api/store";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings().catch(() => null);
  const name = settings?.name ?? "Server Embassy";
  return {
    title: {
      default: `${name} | Trusted Enterprise IT Hardware`,
      template: `%s | ${name}`,
    },
    description:
      "Enterprise IT hardware — server hard drives, memory, power supplies, network switches, and more.",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${sora.variable} ${figtree.className}`}>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
