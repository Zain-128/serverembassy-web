"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useStoreSettings } from "@/context/StoreContext";
import { useGetCategoryTreeQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";

const serviceTabs = [
  { label: "HARDWARE", href: "/shop" },
  { label: "COLOCATION", href: "/contact" },
  { label: "FINANCING", href: "/#quote" },
  { label: "BUY BACK", href: "/contact" },
];

const mainNavItems = [
  { label: "Servers", href: "/shop?q=servers", hasDropdown: true, catSlug: "servers" },
  { label: "Storage", href: "/shop?q=storage", hasDropdown: true, catSlug: "storage" },
  { label: "Networking", href: "/shop?q=networking", hasDropdown: true, catSlug: "networking" },
  { label: "Components", href: "/shop?q=components", hasDropdown: true, catSlug: "components" },
  { label: "Maintenance", href: "/contact", hasDropdown: true, catSlug: "maintenance" },
  { label: "Contact", href: "/contact", hasDropdown: false, catSlug: "" },
];

export default function Header() {
  const { settings } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("HARDWARE");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  useEffect(() => {
    if (pathname.startsWith("/shop") || pathname.startsWith("/product") || pathname === "/") {
      setActiveTab("HARDWARE");
    } else if (pathname.startsWith("/contact")) {
      setActiveTab("COLOCATION");
    }
  }, [pathname]);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
    setMenuOpen(false);
    setSearchOpen(false);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Top Announcement Bar - Pure Black (#000000) */}
        <div className="bg-[#000000] text-center text-[11px] sm:text-[12px] tracking-wide text-white">
          <div className="container-se py-1.5">
            the market is changing daily. Stay on top of changes with our{" "}
            <Link href="/shop" className="font-bold text-white underline underline-offset-2 hover:opacity-90">
              January market update
            </Link>
          </div>
        </div>

        {/* Service Tabs + Contact Info Bar - Electric Blue (#0066ff) */}
        <div className="bg-[#0066ff] text-white">
          <div className="container-se flex flex-wrap items-stretch justify-between gap-y-0">
            {/* Service Tabs */}
            <nav className="flex items-stretch" aria-label="Services">
              {serviceTabs.map((tab) => {
                const active = activeTab === tab.label;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex items-center px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition sm:px-6 ${
                      active
                        ? "!bg-white !text-[#0b1220] font-extrabold shadow-sm"
                        : "font-bold text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

            {/* Contact Info (Clean Text without Icons) */}
            <div className="hidden items-center gap-6 text-[11px] font-medium sm:flex">
              <a
                href={`mailto:${settings.email || "homegoodsgalaxy@gmail.com"}`}
                className="text-white hover:underline"
              >
                {settings.email || "homegoodsgalaxy@gmail.com"}
              </a>
              <span className="text-white">
                {settings.address || "Address Big Ben Street, E17 US, CANADA"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Header / Navigation Bar - Clean White (#ffffff) */}
        <div className="border-b border-gray-100 bg-white text-[#0b1220]">
          <div className="container-se flex items-center justify-between gap-6 py-3.5">
            {/* Logo */}
            <Link href="/" aria-label="Powerline Devices home" className="shrink-0">
              <Logo light={false} />
            </Link>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary">
              {mainNavItems.map((item) => {
                const categoryMatch = tree.find(
                  (t) => t.slug.toLowerCase() === item.catSlug || t.name.toLowerCase() === item.label.toLowerCase()
                );
                const children = categoryMatch?.children ?? [];
                const hasChildren = item.hasDropdown && children.length > 0;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenMega(item.label)}
                    onMouseLeave={() => setOpenMega(null)}
                  >
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-[14.5px] font-semibold text-[#0b1220] transition hover:text-[#0066ff]"
                    >
                      {item.label}
                      {item.hasDropdown ? (
                        <ChevronDown size={14} className="text-[#0b1220]/70 stroke-[2.5]" />
                      ) : null}
                    </Link>

                    {hasChildren && openMega === item.label ? (
                      <div className="absolute left-0 top-full z-50 min-w-[220px] rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-gray-700">
                        <ul className="space-y-1 text-sm">
                          {children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/shop/${child.slug}`}
                                className="block rounded-lg px-3 py-2 text-[#0b1220] hover:bg-gray-50 hover:text-[#0066ff]"
                                onClick={() => setOpenMega(null)}
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>

            {/* Action Icons Right */}
            <div className="flex items-center gap-4">
              {/* Search Icon */}
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-[#0b1220] transition hover:text-[#0066ff]"
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search size={20} className="stroke-[2.2]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/account"
                className="relative grid h-9 w-9 place-items-center text-[#0b1220] transition hover:text-[#0066ff]"
                aria-label="Wishlist"
              >
                <Heart size={20} className="stroke-[2.2]" />
                <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#e52e2e] px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </Link>

              {/* Shopping Cart Icon */}
              <button
                type="button"
                className="relative grid h-9 w-9 place-items-center text-[#0b1220] transition hover:text-[#0066ff]"
                aria-label="Open cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={20} className="stroke-[2.2]" />
                <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#e52e2e] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              </button>

              {/* Account Icon */}
              <Link
                href="/login"
                className="grid h-9 w-9 place-items-center text-[#0b1220] transition hover:text-[#0066ff]"
                aria-label="Account"
              >
                <User size={20} className="stroke-[2.2]" />
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 text-[#0b1220] lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Expandable Search Bar */}
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-gray-100 bg-gray-50"
              >
                <form onSubmit={onSearch} className="container-se flex items-center gap-3 py-3">
                  <Search size={18} className="text-gray-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search SKU, brand, or product..."
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#0b1220] outline-none"
                  />
                  <button type="submit" className="rounded-lg bg-[#0066ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc]">
                    Search
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[min(100%,360px)] overflow-y-auto bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={onSearch} className="mb-5 flex items-center rounded-full border border-gray-200 bg-gray-50 pl-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm"
                placeholder="Search SKU…"
              />
              <button type="submit" className="m-1 grid h-8 w-8 place-items-center rounded-full bg-[#0066ff] text-white">
                <Search size={14} />
              </button>
            </form>
            <div className="mb-4 flex flex-wrap gap-2">
              {serviceTabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0066ff]"
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <div className="space-y-1 text-sm border-t border-gray-100 pt-3">
              {mainNavItems.map((item) => (
                <div key={item.label} className="border-b border-gray-100 py-2.5">
                  <Link href={item.href} className="font-semibold text-[#0b1220]" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
