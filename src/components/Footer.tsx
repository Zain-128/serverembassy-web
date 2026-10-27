"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { STORE_CONTACT } from "@/lib/constants/contact";
import {
  useGetCategoryTreeQuery,
  useSubscribeNewsletterMutation,
} from "@/store/storeApi";
import { useStoreSettings } from "@/context/StoreContext";
import Logo from "@/components/Logo";
import { useToast } from "@/components/Toast";
import { navCategories } from "@/lib/nav";
import { useTheme } from "@/context/ThemeContext";

const FALLBACK_NAV = [
  { href: "/shop?q=server", label: "Servers" },
  { href: "/shop?q=storage", label: "Storage" },
  { href: "/shop?q=network", label: "Networking" },
  { href: "/shop?q=component", label: "Components" },
  { href: "/contact", label: "Maintenance" },
  { href: "/contact", label: "Contact" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { settings: store } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const navLinks = useMemo(() => {
    const cats = navCategories(tree, 6);
    if (!cats.length) return FALLBACK_NAV;
    return [
      ...cats.map((c) => ({ href: `/shop/${c.slug}`, label: c.name })),
      { href: "/contact", label: "Contact" },
    ];
  }, [tree]);

  const [email, setEmail] = useState("");
  const [subscribe] = useSubscribeNewsletterMutation();
  const toast = useToast().toast;

  async function onSubscribe(event: FormEvent) {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      toast("Please enter a valid email address (e.g. name@domain.com)", "error");
      return;
    }
    try {
      await subscribe(email.trim()).unwrap();
      setEmail("");
      toast("Subscribed! Welcome on board.", "success");
    } catch {
      toast("Could not subscribe. Try again.", "error");
    }
  }

  const phone = store.phone || STORE_CONTACT.phone;
  const mail = store.email || STORE_CONTACT.email;
  const address = store.address || STORE_CONTACT.address;

  return (
    <footer
      className={`px-2 pb-8 pt-4 sm:px-6 sm:pb-10 sm:pt-6 transition-colors duration-300 ${
        !isLight ? "bg-[#05070c]" : "bg-white"
      }`}
    >
      <div
        className={`container-se overflow-hidden rounded-2xl sm:rounded-[2rem] transition-colors duration-300 ${
          !isLight
            ? "border border-white/10 bg-[#000000] text-white shadow-2xl"
            : "bg-white text-[#0b1220] shadow-lift border border-gray-100"
        }`}
      >
        {/* Logo + nav */}
        <div className="flex flex-col gap-4 px-4 py-5 sm:px-8 sm:py-7 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
            <Logo light={!isLight} />
          </Link>
          <nav
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold md:justify-end ${
              !isLight ? "text-white/80" : "text-[#0b1220]"
            }`}
            aria-label="Footer"
          >
            {navLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="transition hover:text-[#0066ff]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={`mx-4 h-px sm:mx-8 lg:mx-10 ${!isLight ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Contact + newsletter */}
        <div className="grid items-center gap-6 px-4 py-6 sm:px-8 sm:py-8 md:grid-cols-2 md:gap-0 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-4 md:pr-10">
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className={`inline-flex items-center gap-2 text-sm sm:text-base font-semibold transition hover:text-[#0066ff] ${
                !isLight ? "text-white" : "text-[#0b1220]"
              }`}
            >
              <Phone size={16} className="text-[#0066ff] sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
              {phone}
            </a>
            <a
              href={`mailto:${mail}`}
              className={`inline-flex items-center gap-2 text-sm sm:text-base font-semibold transition hover:text-[#0066ff] ${
                !isLight ? "text-white" : "text-[#0b1220]"
              }`}
            >
              <Mail size={16} className="text-[#0066ff] sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
              {mail}
            </a>
            <span
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-medium ${
                !isLight ? "text-white/70" : "text-[#0b1220]/70"
              }`}
            >
              <MapPin size={15} className="text-[#0066ff] shrink-0 sm:w-[16px] sm:h-[16px]" strokeWidth={2.2} />
              {address}
            </span>

            {/* Social Links */}
            <div className="inline-flex items-center gap-2 pt-1 sm:pt-0">
              <span className={`text-xs font-semibold ${!isLight ? "text-white/60" : "text-gray-500"}`}>
                Follow:
              </span>
              <a
                href={STORE_CONTACT.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Power Line Devices on Facebook"
                title="Facebook"
                className={`grid h-7 w-7 place-items-center rounded-full transition hover:scale-110 ${
                  !isLight
                    ? "bg-white/10 text-white hover:bg-[#1877F2] hover:text-white"
                    : "bg-gray-100 text-[#0b1220] hover:bg-[#1877F2] hover:text-white"
                }`}
              >
                <Facebook size={14} />
              </a>
              <a
                href={STORE_CONTACT.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Power Line Devices on Instagram"
                title="Instagram"
                className={`grid h-7 w-7 place-items-center rounded-full transition hover:scale-110 ${
                  !isLight
                    ? "bg-white/10 text-white hover:bg-[#E4405F] hover:text-white"
                    : "bg-gray-100 text-[#0b1220] hover:bg-[#E4405F] hover:text-white"
                }`}
              >
                <Instagram size={14} />
              </a>
            </div>
          </div>

          <div
            className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:border-l md:pl-10 ${
              !isLight ? "md:border-white/10" : "md:border-gray-200"
            }`}
          >
            <p className={`shrink-0 text-sm sm:text-base font-semibold ${!isLight ? "text-white" : "text-[#0b1220]"}`}>
              Stay In Touch
            </p>
            <form
              onSubmit={onSubscribe}
              className={`flex w-full min-w-0 items-center overflow-hidden rounded-full p-1 border ${
                !isLight
                  ? "bg-black text-white border-white/10"
                  : "bg-gray-100 text-black border-gray-200"
              }`}
            >
              <input
                type="email"
                required
                placeholder="Email Address....."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm outline-none rounded-l-full ${
                  !isLight
                    ? "text-white placeholder:text-white/40"
                    : "text-[#0b1220] placeholder:text-gray-400"
                }`}
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#0066ff] px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <span>Submit</span>
                <span className="grid h-4.5 w-4.5 sm:h-5 sm:w-5 place-items-center rounded-full bg-white text-[#0066ff]">
                  <ArrowRight size={11} strokeWidth={2.5} className="sm:w-[12px] sm:h-[12px]" />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className={`mx-4 h-px sm:mx-8 lg:mx-10 ${!isLight ? "bg-white/10" : "bg-gray-100"}`} />

        {/* Bottom blurbs */}
        <div
          className={`flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 px-4 py-5 text-[11px] sm:text-xs sm:px-8 lg:px-10 text-center sm:text-left ${
            !isLight ? "text-white/50" : "text-gray-500"
          }`}
        >
          <p>© {new Date().getFullYear()} Power Line Devices. All rights reserved.</p>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:gap-x-4"
            aria-label="Legal"
          >
            {[
              { href: "/policies/privacy-policy", label: "Privacy Policy" },
              { href: "/policies/terms-of-service", label: "Terms of Service" },
              { href: "/policies/shipping", label: "Shipping" },
              { href: "/policies/returns", label: "Returns" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-[#0066ff]">
                {link.label}
              </Link>
            ))}
          </nav>
          <p>Enterprise Server Hardware, Storage & Networking Solutions</p>
        </div>
      </div>
    </footer>
  );
}
