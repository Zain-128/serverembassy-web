"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import {
  useGetCategoryTreeQuery,
  useSubscribeNewsletterMutation,
} from "@/store/storeApi";
import { useStoreSettings } from "@/context/StoreContext";
import Logo from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { navCategories } from "@/lib/nav";

const FALLBACK_NAV = [
  { href: "/shop?q=server", label: "Servers" },
  { href: "/shop?q=storage", label: "Storage" },
  { href: "/shop?q=network", label: "Networking" },
  { href: "/shop?q=component", label: "Components" },
  { href: "/about", label: "Maintenance" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const { settings: store } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const navLinks = useMemo(() => {
    const cats = navCategories(tree, 5).map((c) => ({
      href: `/shop/${c.slug}`,
      label: c.name,
    }));
    if (!cats.length) return FALLBACK_NAV;
    return [...cats, { href: "/contact", label: "Contact" }];
  }, [tree]);

  const [email, setEmail] = useState("");
  const [subscribe] = useSubscribeNewsletterMutation();
  const toast = useToast().toast;

  async function onSubscribe(event: FormEvent) {
    event.preventDefault();
    try {
      await subscribe(email).unwrap();
      setEmail("");
      toast("Subscribed! Welcome on board.", "success");
    } catch {
      toast("Could not subscribe. Try again.", "error");
    }
  }

  const phone = store.phone || "(303) 847-0120";
  const mail = store.email || "info@powerlinedevices.com";
  const blurb =
    store.tagline ||
    "Enterprise servers, storage, and networking — tested, warrantied, and ready to ship.";

  return (
    <footer className="bg-[#05070c] px-4 pb-10 pt-6 sm:px-6">
      <div className="container-se overflow-hidden rounded-[2rem] bg-white shadow-lift">
        {/* Logo + nav */}
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
            <Logo />
          </Link>
          <nav
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-navy md:justify-end"
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="transition hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mx-6 h-px bg-navy/15 sm:mx-8 lg:mx-10" />

        {/* Contact + newsletter */}
        <div className="grid items-center gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 md:gap-0 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:pr-10">
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-navy transition hover:text-brand"
            >
              <Phone size={18} className="text-brand" strokeWidth={2} />
              {phone}
            </a>
            <a
              href={`mailto:${mail}`}
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-navy transition hover:text-brand"
            >
              <Mail size={18} className="text-brand" strokeWidth={2} />
              {mail}
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:border-l md:border-navy/15 md:pl-10">
            <p className="shrink-0 text-sm font-semibold text-navy">Stay In Touch</p>
            <form onSubmit={onSubscribe} className="flex min-w-0 flex-1 overflow-hidden rounded-full bg-navy">
              <input
                type="email"
                required
                placeholder="Email Address....."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 bg-gradient-to-b from-[#3b82f6] to-[#1d4ed8] px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 sm:px-5"
              >
                Submit
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-brand">
                  <ArrowRight size={14} strokeWidth={2.5} />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="mx-6 h-px bg-navy/10 sm:mx-8 lg:mx-10" />

        {/* Bottom blurbs */}
        <div className="grid gap-4 px-6 py-6 text-xs leading-relaxed text-muted sm:px-8 md:grid-cols-2 md:gap-10 lg:px-10">
          <p>{blurb}</p>
          <p>
            © {new Date().getFullYear()} {store.name || "Power Line Devices"}. Original and certified
            refurbished IT hardware for teams that can&apos;t afford downtime.
          </p>
        </div>
      </div>
    </footer>
  );
}
