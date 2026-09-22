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

import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
      <div className={`container-se overflow-hidden rounded-[2rem] shadow-lift transition-colors duration-300 ${
        isDark ? "bg-white text-navy" : "border border-white/10 bg-[#0b1220] text-white"
      }`}>
        {/* Logo + nav */}
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
            <Logo light={!isDark} />
          </Link>
          <nav
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold md:justify-end ${
              isDark ? "text-navy" : "text-white/80"
            }`}
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <Link key={`${link.href}-${link.label}`} href={link.href} className="transition hover:text-brand">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`mx-6 h-px sm:mx-8 lg:mx-10 ${isDark ? "bg-navy/15" : "bg-white/10"}`} />

        {/* Contact + newsletter */}
        <div className="grid items-center gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 md:gap-0 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:pr-10">
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className={`inline-flex items-center gap-2.5 text-base font-semibold transition hover:text-brand ${
                isDark ? "text-navy" : "text-white"
              }`}
            >
              <Phone size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {phone}
            </a>
            <a
              href={`mailto:${mail}`}
              className={`inline-flex items-center gap-2.5 text-base font-semibold transition hover:text-brand ${
                isDark ? "text-navy" : "text-white"
              }`}
            >
              <Mail size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {mail}
            </a>
          </div>

          <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:border-l md:pl-10 ${
            isDark ? "md:border-navy/15" : "md:border-white/10"
          }`}>
            <p className={`shrink-0 text-base font-semibold ${isDark ? "text-navy" : "text-white"}`}>Stay In Touch</p>
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

        <div className={`mx-6 h-px sm:mx-8 lg:mx-10 ${isDark ? "bg-navy/10" : "bg-white/10"}`} />

        {/* Bottom blurbs */}
        <div className={`flex flex-wrap justify-between gap-4 px-6 py-6 text-xs sm:px-8 lg:px-10 ${
          isDark ? "text-navy/70" : "text-white/50"
        }`}>
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
        </div>
      </div>
    </footer>
  );
}
