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
  { href: "/contact", label: "Maintenance" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const { settings: store } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const navLinks = useMemo(() => {
    return FALLBACK_NAV;
  }, []);

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
  const mail = store.email || "info@dummy.com";

  return (
    <footer className="bg-[#05070c] px-4 pb-10 pt-6 sm:px-6">
      <div className="container-se overflow-hidden rounded-[2rem] bg-white shadow-lift">
        {/* Logo + nav */}
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
            <Logo />
          </Link>
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-navy md:justify-end"
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
              className="inline-flex items-center gap-2.5 text-base font-semibold text-navy transition hover:text-brand"
            >
              <Phone size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {phone}
            </a>
            <a
              href={`mailto:${mail}`}
              className="inline-flex items-center gap-2.5 text-base font-semibold text-navy transition hover:text-brand"
            >
              <Mail size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {mail}
            </a>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:border-l md:border-navy/15 md:pl-10">
            <p className="shrink-0 text-base font-semibold text-navy">Stay In Touch</p>
            <form onSubmit={onSubscribe} className="flex min-w-0 flex-1 items-center overflow-hidden rounded-full bg-black p-1">
              <input
                type="email"
                required
                placeholder="Email Address....."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0066ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Submit
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#0066ff]">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="mx-6 h-px bg-navy/10 sm:mx-8 lg:mx-10" />

        {/* Bottom blurbs */}
        <div className="flex flex-wrap justify-between gap-4 px-6 py-6 text-xs text-navy/70 sm:px-8 lg:px-10">
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
        </div>
      </div>
    </footer>
  );
}
