"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Heart,
  Mail,
  MapPin,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import FreeShippingBar from "@/components/FreeShippingBar";
import ProductVisual from "@/components/ProductVisual";
import { formatMoney } from "@/lib/format";
import { navCategories } from "@/lib/nav";
import { useStoreSettings } from "@/context/StoreContext";
import { useTheme } from "@/context/ThemeContext";
import { useGetCategoryTreeQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";

const serviceTabs = [
  { label: "HARDWARE", href: "/shop" },
  { label: "COLOCATION", href: "/contact" },
  { label: "FINANCING", href: "/#quote" },
  { label: "BUY BACK", href: "/contact" },
];

const staticLinks = [
  { href: "/shop?q=components", label: "Components" },
  { href: "/contact", label: "Maintenance" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const { settings } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const links = navCategories(tree);
  const { count, lines, subtotal, setQty, remove } = useCart();
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
        className={`sticky top-0 z-40 transition-shadow duration-300 ${
          scrolled ? "shadow-lift" : ""
        }`}
      >
        {/* Announcement */}
        <div className="bg-[#0b1220] text-center text-[11px] tracking-wide text-white/75">
          <div className="container-se py-2">
            the market is changing daily. Stay on top of changes with our{" "}
            <Link href="/shop" className="font-semibold text-white underline underline-offset-2">
              January market update
            </Link>
          </div>
        </div>

        {/* Service tabs + contact */}
        <div className="bg-[#0066ff] text-white">
          <div className="container-se flex flex-wrap items-stretch justify-between gap-y-0">
            <nav className="flex flex-wrap items-stretch" aria-label="Services">
              {serviceTabs.map((tab) => {
                const active = activeTab === tab.label;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    onClick={() => setActiveTab(tab.label)}
                    style={{ color: active ? "#0066ff" : "#ffffff" }}
                    className={`flex items-center px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition sm:px-6 ${
                      active
                        ? "bg-white text-[#0066ff] shadow-sm font-extrabold"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden items-center gap-5 bg-brand-dark/40 px-4 text-[11px] sm:flex lg:px-5">
              <a
                href={`mailto:${settings.email || "homegoodsgalaxy@gmail.com"}`}
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white"
              >
                <Mail size={12} />
                {settings.email || "homegoodsgalaxy@gmail.com"}
              </a>
              <span className="inline-flex items-center gap-1.5 text-white/80">
                <MapPin size={12} />
                {settings.address || "Address Big Ben Street, E17 US, CANADA"}
              </span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className={`transition-colors duration-300 ${isDark ? "border-b border-line bg-white text-navy" : "border-b border-white/10 bg-[#05070c] text-white"}`}>
          <div className="container-se flex items-center justify-between gap-4 py-3.5">
            <Link href="/" aria-label="Power Line Devices home" className="shrink-0">
              <Logo light={!isDark} />
            </Link>

            <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
              {links.map((cat) => {
                const children = tree.find((t) => t.id === cat.id)?.children ?? [];
                const hasKids = children.length > 0;
                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => setOpenMega(cat.id)}
                    onMouseLeave={() => setOpenMega(null)}
                  >
                    <Link
                      href={`/shop/${cat.slug}`}
                      className={`inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold transition ${
                        pathname === `/shop/${cat.slug}`
                          ? "text-brand"
                          : isDark ? "text-navy hover:text-brand" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {cat.name}
                      {hasKids ? <ChevronDown size={14} className="opacity-60" /> : null}
                    </Link>
                    {hasKids && openMega === cat.id ? (
                      <div className={`anim-dropdown absolute left-0 top-full z-50 min-w-[220px] rounded-xl border p-3 shadow-lift ${
                        isDark ? "border-line bg-white text-muted" : "border-white/10 bg-[#0c1018] text-white/70"
                      }`}>
                        <ul className="space-y-1 text-sm">
                          {children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/shop/${child.slug}`}
                                className={`block rounded-lg px-3 py-2 ${
                                  isDark ? "hover:bg-brand-soft hover:text-brand" : "hover:bg-white/10 hover:text-white"
                                }`}
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
              {staticLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2 text-[13px] font-semibold transition ${
                    pathname === link.href ? "text-brand" : isDark ? "text-navy hover:text-brand" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-full transition ${
                  isDark ? "text-navy hover:bg-brand-soft hover:text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Toggle theme"
                title={isDark ? "Switch to light theme" : "Switch to dark theme"}
                onClick={toggleTheme}
              >
                {isDark ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
              </button>
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-full transition ${
                  isDark ? "text-navy hover:bg-brand-soft hover:text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search size={18} />
              </button>
              <Link
                href="/account"
                className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
                  isDark ? "text-navy hover:bg-brand-soft hover:text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={18} />
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </Link>
              <button
                type="button"
                className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
                  isDark ? "text-navy hover:bg-brand-soft hover:text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Open cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={18} />
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              </button>
              <Link
                href="/login"
                className={`hidden h-10 w-10 place-items-center rounded-full transition sm:grid ${
                  isDark ? "text-navy hover:bg-brand-soft hover:text-brand" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Account"
              >
                <User size={18} />
              </Link>
              <button
                type="button"
                className={`grid h-10 w-10 place-items-center rounded-full border xl:hidden ${
                  isDark ? "border-line text-navy" : "border-white/20 text-white"
                }`}
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-line bg-page/80"
              >
                <form onSubmit={onSearch} className="container-se flex items-center gap-3 py-3">
                  <Search size={16} className="text-muted" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search SKU, brand, or product"
                    className="min-w-0 flex-1 bg-transparent py-2 outline-none"
                  />
                  <button type="submit" className="btn btn-primary px-4 py-2 text-sm">
                    Search
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      {menuOpen ? (
        <div className="anim-fade fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm xl:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="anim-drawer-left absolute right-0 top-0 h-full w-[min(100%,360px)] overflow-y-auto bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">
                <X />
              </button>
            </div>
            <form onSubmit={onSearch} className="mb-5 flex items-center rounded-full border border-line bg-page/60 pl-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2"
                placeholder="Search SKU…"
              />
              <button type="submit" className="m-1 grid h-9 w-9 place-items-center rounded-full bg-navy text-white">
                <Search size={16} />
              </button>
            </form>
            <div className="mb-4 flex flex-wrap gap-2">
              {serviceTabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand"
                >
                  {tab.label}
                </Link>
              ))}
            </div>
            <div className="space-y-1 text-sm">
              {tree.map((parent) => (
                <div key={parent.id} className="border-b border-line py-3">
                  <Link href={`/shop/${parent.slug}`} className="font-semibold" onClick={() => setMenuOpen(false)}>
                    {parent.name}
                  </Link>
                  <div className="mt-1 flex flex-col gap-1 pl-3 text-muted">
                    {parent.children?.map((child) => (
                      <Link key={child.id} href={`/shop/${child.slug}`} onClick={() => setMenuOpen(false)}>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {staticLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block py-2" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href="/login" className="block py-2" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="anim-fade fixed inset-0 z-[60] bg-navy/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
          <aside
            className="anim-drawer-right absolute right-0 top-0 flex h-full w-[min(100%,400px)] flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display">Shopping cart</h2>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Close cart">
                <X />
              </button>
            </div>
            <div className="border-b border-line bg-gradient-to-br from-brand-soft/30 to-transparent p-4">
              <FreeShippingBar compact />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <p className="rounded-2xl bg-page/60 p-6 text-center text-sm text-muted">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {lines.map(({ product, qty }) => {
                    const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
                    return (
                      <li key={product.id} className="flex gap-3 rounded-2xl border border-line bg-white p-2.5">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-page/60 ring-1 ring-line">
                          <ProductVisual product={product} icon={icon} className="h-16" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium text-navy">{product.title}</p>
                          <p className="text-sm font-semibold text-navy">{formatMoney(product.price)}</p>
                          <div className="mt-1.5 inline-flex items-center overflow-hidden rounded-full border border-line">
                            <button
                              type="button"
                              className="grid h-7 w-7 place-items-center text-muted transition hover:text-brand"
                              onClick={() => setQty(product.id, qty - 1)}
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                            <button
                              type="button"
                              className="grid h-7 w-7 place-items-center text-muted transition hover:text-brand"
                              onClick={() => setQty(product.id, qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="ml-auto mt-1.5 block text-xs text-sale hover:underline"
                            onClick={() => remove(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="border-t border-line p-4">
              <div className="mb-3 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <Link href="/cart" className="btn btn-outline mb-2 w-full" onClick={() => setCartOpen(false)}>
                View cart
              </Link>
              <Link href="/checkout" className="btn btn-primary w-full" onClick={() => setCartOpen(false)}>
                Checkout
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
