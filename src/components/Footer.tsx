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
    return FALLBACK_NAV;
  }, []);

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

  const phone = store.phone || "(303) 847-0120";
  const mail = store.email || "info@dummy.com";

  return (
    <footer
      className={`px-4 pb-10 pt-6 sm:px-6 transition-colors duration-300 ${
        !isLight ? "bg-[#05070c]" : "bg-white"
      }`}
    >
      <div
        className={`container-se overflow-hidden rounded-[2rem] transition-colors duration-300 ${
          !isLight
            ? "border border-white/10 bg-[#000000] text-white shadow-2xl"
            : "bg-white text-[#0b1220] shadow-lift border border-gray-100"
        }`}
      >
        {/* Logo + nav */}
        <div className="flex flex-col gap-5 px-6 py-7 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
            <Logo light={!isLight} />
          </Link>
          <nav
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold md:justify-end ${
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

        <div className={`mx-6 h-px sm:mx-8 lg:mx-10 ${!isLight ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Contact + newsletter */}
        <div className="grid items-center gap-8 px-6 py-8 sm:px-8 md:grid-cols-2 md:gap-0 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:pr-10">
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className={`inline-flex items-center gap-2.5 text-base font-semibold transition hover:text-[#0066ff] ${
                !isLight ? "text-white" : "text-[#0b1220]"
              }`}
            >
              <Phone size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {phone}
            </a>
            <a
              href={`mailto:${mail}`}
              className={`inline-flex items-center gap-2.5 text-base font-semibold transition hover:text-[#0066ff] ${
                !isLight ? "text-white" : "text-[#0b1220]"
              }`}
            >
              <Mail size={18} className="text-[#0066ff]" strokeWidth={2.2} />
              {mail}
            </a>
          </div>

          <div
            className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:border-l md:pl-10 ${
              !isLight ? "md:border-white/10" : "md:border-gray-200"
            }`}
          >
            <p className={`shrink-0 text-base font-semibold ${!isLight ? "text-white" : "text-[#0b1220]"}`}>
              Stay In Touch
            </p>
            <form
              onSubmit={onSubscribe}
              className={`flex min-w-0 flex-1 items-center overflow-hidden rounded-full p-1 border ${
                !isLight
                  ? "bg-black text-white border-transparent"
                  : "bg-gray-100 text-black border-transparent"
              }`}
            >
              <input
                type="email"
                required
                placeholder="Email Address....."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`min-w-0 flex-1 bg-transparent px-4 py-2 text-sm outline-none rounded-l-full ${
                  !isLight
                    ? "text-white placeholder:text-white/40"
                    : "text-[#0b1220] placeholder:text-gray-400"
                }`}
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0066ff] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Submit
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#0066ff]">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className={`mx-6 h-px sm:mx-8 lg:mx-10 ${!isLight ? "bg-white/10" : "bg-gray-100"}`} />

        {/* Bottom blurbs */}
        <div
          className={`flex flex-wrap justify-between gap-4 px-6 py-6 text-xs sm:px-8 lg:px-10 ${
            !isLight ? "text-white/50" : "text-gray-500"
          }`}
        >
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
          <p>Contrary to popular belief, Lorem Ipsum is not</p>
        </div>
      </div>
    </footer>
  );
}
