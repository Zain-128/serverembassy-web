"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Moon,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useStoreSettings } from "@/context/StoreContext";
import { useGetCategoryTreeQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useTheme } from "@/context/ThemeContext";
import { useAppSelector } from "@/store";
import { formatMoney } from "@/lib/format";

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
  const {
    count,
    lines,
    subtotal,
    remainingForFreeShipping,
    freeShippingUnlocked,
    progress,
    remove,
    setQty,
  } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const token = useAppSelector((s) => s.auth.token);
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const activeTab =
    pathname.startsWith("/shop") || pathname.startsWith("/product") || pathname === "/"
      ? "HARDWARE"
      : pathname.startsWith("/contact")
        ? "COLOCATION"
        : "HARDWARE";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasLocalToken =
    typeof window !== "undefined" ? Boolean(localStorage.getItem("se-customer-token")) : false;
  const isLoggedIn = mounted && (Boolean(token) || hasLocalToken);
  const accountHref = isLoggedIn ? "/account" : "/login";

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

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
    setMenuOpen(false);
    setSearchOpen(false);
  }

  const isLight = theme === "light";

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isLight ? "bg-white" : "bg-[#000000]"
        } ${scrolled ? "shadow-md" : ""}`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-[#000000] text-center text-[11px] sm:text-[12px] tracking-wide text-white">
          <div className="container-se flex items-center justify-between py-1.5 gap-2">
            <span className="hidden sm:inline-block w-24" />
            <div className="flex-1 text-center truncate">
              The market is changing daily. Stay on top of changes with our{" "}
              <Link
                href="/shop"
                className="font-bold text-white underline underline-offset-2 hover:opacity-90"
              >
                market update
              </Link>
            </div>
            {/* Theme Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-white/80 hidden sm:inline select-none">
                {isLight ? "White Theme" : "Black Theme"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={!isLight}
                onClick={toggleTheme}
                title={`Click to switch to ${isLight ? "Black" : "White"} theme`}
                className={`relative inline-flex h-5 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none ring-1 ${
                  isLight ? "bg-emerald-500 ring-emerald-400/60" : "bg-[#0066ff] ring-blue-400/60"
                }`}
              >
                <span className="absolute left-1 text-white select-none pointer-events-none flex items-center justify-center">
                  <Sun size={10} className={`transition-opacity duration-200 ${isLight ? "opacity-100" : "opacity-30"}`} />
                </span>
                <span className="absolute right-1 text-white select-none pointer-events-none flex items-center justify-center">
                  <Moon size={10} className={`transition-opacity duration-200 ${!isLight ? "opacity-100" : "opacity-30"}`} />
                </span>

                <span
                  className={`pointer-events-none z-10 flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                    isLight ? "translate-x-0" : "translate-x-6"
                  }`}
                >
                  {isLight ? (
                    <Sun size={9} className="text-emerald-600 fill-emerald-600" />
                  ) : (
                    <Moon size={9} className="text-[#0066ff] fill-[#0066ff]" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Service Tabs Bar */}
        <div className="bg-[#0066ff] text-white">
          <div className="container-se flex flex-wrap items-stretch justify-between gap-y-0">
            <nav className="flex items-stretch" aria-label="Services">
              {serviceTabs.map((tab) => {
                const active = activeTab === tab.label;
                return (
                  <Link
                    key={tab.label}
                    href={tab.href}
                    className={`flex items-center px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] transition sm:px-6 ${
                      active
                        ? !isLight
                          ? "!bg-[#000000] !text-white font-extrabold shadow-sm"
                          : "!bg-white !text-[#0b1220] font-extrabold shadow-sm"
                        : "font-bold text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </nav>

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

        {/* Main Navigation Bar */}
        <div
          className={`transition-colors duration-300 ${
            !isLight
              ? "border-b border-white/10 bg-[#000000] text-white"
              : "border-b border-gray-100 bg-white text-[#0b1220]"
          }`}
        >
          <div className="container-se flex items-center justify-between gap-6 py-3.5">
            <Link href="/" aria-label="Powerline Devices home" className="shrink-0">
              <Logo light={!isLight} />
            </Link>

            <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="Primary">
              {mainNavItems.map((item) => {
                const categoryMatch = tree.find(
                  (t) =>
                    t.slug.toLowerCase() === item.catSlug ||
                    t.name.toLowerCase() === item.label.toLowerCase(),
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
                      className={`inline-flex items-center gap-1 text-[14.5px] font-semibold transition ${
                        !isLight
                          ? "text-white/90 hover:text-[#0066ff]"
                          : "text-[#0b1220] hover:text-[#0066ff]"
                      }`}
                    >
                      {item.label}
                      {item.hasDropdown ? (
                        <ChevronDown
                          size={14}
                          className={`stroke-[2.5] ${!isLight ? "text-white/70" : "text-[#0b1220]/70"}`}
                        />
                      ) : null}
                    </Link>

                    {hasChildren && openMega === item.label ? (
                      <div
                        className={`absolute left-0 top-full z-50 min-w-[220px] rounded-xl p-3 shadow-xl ${
                          !isLight
                            ? "border border-white/15 bg-[#141414] text-white"
                            : "border border-gray-100 bg-white text-gray-700"
                        }`}
                      >
                        <ul className="space-y-1 text-sm">
                          {children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={`/shop/${child.slug}`}
                                className={`block rounded-lg px-3 py-2 ${
                                  !isLight
                                    ? "text-white hover:bg-white/10 hover:text-[#0066ff]"
                                    : "text-[#0b1220] hover:bg-gray-50 hover:text-[#0066ff]"
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
            </nav>

            {/* Action Icons Right */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`grid h-9 w-9 place-items-center transition ${
                  !isLight ? "text-white hover:text-[#0066ff]" : "text-[#0b1220] hover:text-[#0066ff]"
                }`}
                aria-label="Search"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search size={20} className="stroke-[2.2]" />
              </button>

              <Link
                href="/wishlist"
                className={`relative grid h-9 w-9 place-items-center transition ${
                  !isLight ? "text-white hover:text-[#0066ff]" : "text-[#0b1220] hover:text-[#0066ff]"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} className="stroke-[2.2]" />
                <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#e52e2e] px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              </Link>

              {/* Shopping Cart Button */}
              <button
                type="button"
                className={`relative grid h-9 w-9 place-items-center transition cursor-pointer ${
                  !isLight ? "text-white hover:text-[#0066ff]" : "text-[#0b1220] hover:text-[#0066ff]"
                }`}
                aria-label="Open cart"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingCart size={20} className="stroke-[2.2]" />
                <span className="absolute -right-1.5 -top-1.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#e52e2e] px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              </button>

              <Link
                href={accountHref}
                className={`relative grid h-9 w-9 place-items-center transition ${
                  !isLight ? "text-white hover:text-[#0066ff]" : "text-[#0b1220] hover:text-[#0066ff]"
                }`}
                aria-label={isLoggedIn ? "My Account" : "Account Login"}
                title={isLoggedIn ? "My Account" : "Login"}
              >
                <User size={20} className="stroke-[2.2]" />
                {isLoggedIn ? (
                  <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                ) : null}
              </Link>

              <button
                type="button"
                className={`grid h-9 w-9 place-items-center rounded-lg border lg:hidden ${
                  !isLight
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-gray-200 text-[#0b1220] hover:bg-gray-100"
                }`}
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
                className={`overflow-hidden border-t ${
                  !isLight ? "border-white/10 bg-[#121212]" : "border-gray-100 bg-gray-50"
                }`}
              >
                <form onSubmit={onSearch} className="container-se flex items-center gap-3 py-3">
                  <Search size={18} className="text-gray-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search SKU, brand, or product..."
                    className={`min-w-0 flex-1 bg-transparent py-2 text-sm outline-none ${
                      !isLight ? "text-white placeholder-gray-400" : "text-[#0b1220] placeholder-gray-500"
                    }`}
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-[#0066ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0052cc]"
                  >
                    Search
                  </button>
                </form>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      {/* Cart Slide-Over Drawer */}
      <AnimatePresence>
        {cartOpen ? (
          <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 flex h-full w-[min(100%,420px)] flex-col bg-white text-[#0b1220] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#0066ff]" />
                  <h2 className="font-display text-lg font-bold text-navy">Your Cart</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0066ff]">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Bar */}
              {subtotal > 0 && (
                <div className="border-b border-gray-100 bg-gray-50/70 px-6 py-3 text-xs">
                  {freeShippingUnlocked ? (
                    <p className="font-semibold text-emerald-600">🎉 You unlocked FREE Shipping!</p>
                  ) : (
                    <p className="text-gray-600">
                      Add <strong className="text-navy">{formatMoney(remainingForFreeShipping)}</strong>{" "}
                      more to get <strong className="text-[#0066ff]">FREE Shipping</strong>
                    </p>
                  )}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-[#0066ff] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Drawer Body - Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {lines.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center py-12">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[#0066ff]">
                      <ShoppingCart size={30} />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-navy">Your cart is empty</h3>
                    <p className="mt-1 text-xs text-gray-500 max-w-xs">
                      Explore our hardware catalog to add items to your order.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/shop");
                      }}
                      className="mt-5 rounded-xl bg-[#0066ff] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0052cc]"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  lines.map(({ product, qty }) => {
                    const thumbUrl = product.image || product.images?.[0]?.url;
                    return (
                    <div key={product.id} className="flex gap-3 border-b border-gray-100 pb-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1 flex items-center justify-center">
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={product.title}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-gray-500">
                            {product.sku}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="line-clamp-1 text-sm font-semibold text-navy hover:text-[#0066ff]"
                            >
                              {product.title}
                            </Link>
                            <button
                              type="button"
                              onClick={() => remove(product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="font-mono text-xs text-gray-400">SKU: {product.sku}</p>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                            <button
                              type="button"
                              onClick={() => setQty(product.id, Math.max(1, qty - 1))}
                              className="px-2 py-0.5 text-gray-600 hover:text-navy"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-xs font-bold text-navy">{qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(product.id, qty + 1)}
                              className="px-2 py-0.5 text-gray-600 hover:text-navy"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-semibold text-sm text-navy">
                            {formatMoney(product.price * qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {lines.length > 0 && (
                <div className="border-t border-gray-100 bg-white px-6 py-4 space-y-3">
                  <div className="flex justify-between text-base font-bold text-navy">
                    <span>Subtotal</span>
                    <span className="text-[#0066ff]">{formatMoney(subtotal)}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">Shipping & taxes calculated at checkout.</p>
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setCartOpen(false);
                        router.push("/checkout");
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#0066ff] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0052cc] active:scale-[0.99]"
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </button>
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="block text-center text-xs font-semibold text-gray-500 hover:text-navy py-1"
                    >
                      View Full Shopping Cart
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Mobile Drawer */}
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        >
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

            <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-50 p-3 border border-gray-100">
              <span className="text-xs font-semibold text-gray-700">
                Theme: {isLight ? "White (Light)" : "Black (Dark)"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={!isLight}
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none ring-1 ${
                  isLight ? "bg-emerald-500 ring-emerald-400/60" : "bg-[#0066ff] ring-blue-400/60"
                }`}
              >
                <span className="absolute left-1.5 text-white select-none pointer-events-none flex items-center justify-center">
                  <Sun size={11} className={`transition-opacity duration-200 ${isLight ? "opacity-100" : "opacity-30"}`} />
                </span>
                <span className="absolute right-1.5 text-white select-none pointer-events-none flex items-center justify-center">
                  <Moon size={11} className={`transition-opacity duration-200 ${!isLight ? "opacity-100" : "opacity-30"}`} />
                </span>
                <span
                  className={`pointer-events-none z-10 flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                    isLight ? "translate-x-0" : "translate-x-6"
                  }`}
                >
                  {isLight ? (
                    <Sun size={10} className="text-emerald-600 fill-emerald-600" />
                  ) : (
                    <Moon size={10} className="text-[#0066ff] fill-[#0066ff]" />
                  )}
                </span>
              </button>
            </div>

            <form onSubmit={onSearch} className="mb-5 flex items-center rounded-full border border-gray-200 bg-gray-50 pl-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm rounded-l-full outline-none"
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
              <div className="border-b border-gray-100 py-2.5">
                <Link
                  href={accountHref}
                  className="flex items-center gap-2 font-semibold text-[#0066ff]"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={16} />
                  {isLoggedIn ? "My Account" : "Login / Register"}
                </Link>
              </div>
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
