import type { Metadata } from "next";
import { Figtree, Sora } from "next/font/google";
import Providers from "@/components/Providers";
import SiteShell from "@/components/SiteShell";
import { getStoreSettings } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";
import { getSiteUrl } from "@/lib/seo";
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
  const name = settings?.name ?? "Power Line Devices";
  const description =
    "Enterprise IT hardware — servers, server hard drives, memory, power supplies, and network switches. New, used & certified refurbished, in stock and ready to ship.";
  const siteUrl = getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} | Trusted Enterprise IT Hardware`,
      template: `%s | ${name}`,
    },
    description,
    icons: { icon: "/favicon.jpg" },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: name,
      title: `${name} | Trusted Enterprise IT Hardware`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Trusted Enterprise IT Hardware`,
      description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings().catch(() => null);
  const name = settings?.name ?? "Power Line Devices";
  const siteUrl = getSiteUrl();
  const phone = settings?.phone || STORE_CONTACT.phone;
  const email = settings?.email || STORE_CONTACT.email;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: siteUrl,
    telephone: phone,
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1317 Edgewater Dr Suite #6089",
      addressLocality: "Orlando",
      addressRegion: "FL",
      postalCode: "32804",
      addressCountry: "US",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${figtree.variable} ${sora.variable} ${figtree.className}`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
