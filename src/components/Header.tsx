"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ChevronDown,
  Headphones,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import FreeShippingBar from "@/components/FreeShippingBar";
import ProductVisual from "@/components/ProductVisual";
import { formatMoney } from "@/lib/format";
import { navCategories } from "@/lib/nav";
import { useStoreSettings } from "@/context/StoreContext";
import { useGetCategoryTreeQuery } from "@/store/storeApi";
import { useCart } from "@/lib/cart";

function TopShippingStrip() {
  const { settings } = useStoreSettings();
  const { count, remainingForFreeShipping, freeShippingUnlocked } = useCart();

  if (count > 0 && freeShippingUnlocked) {
    return <>You unlocked free shipping on this order</>;
  }
  if (count > 0 && remainingForFreeShipping > 0) {
    return (
      <>
        Add {formatMoney(remainingForFreeShipping)} more to unlock free shipping
      </>
    );
  }
  return <>{settings.freeShippingLabel || "Free shipping on qualifying US orders"}</>;
}

const staticLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/#brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { settings } = useStoreSettings();
  const { data: tree = [] } = useGetCategoryTreeQuery();
  const links = navCategories(tree);
  const { count, lines, subtotal, setQty, remove } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const next = query.trim();
    router.push(next ? `/shop?q=${encodeURIComponent(next)}` : "/shop");
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/shop") return pathname.startsWith("/shop") || pathname.startsWith("/product");
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href;
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div className="border-b border-white/10 bg-navy text-center text-[11px] font-medium tracking-wide text-white/80">
        <div className="container-se py-2">
          <TopShippingStrip />
        </div>
      </div>

      <div className="container-se grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 lg:grid-cols-[220px_1fr_auto]">
        <Link href="/" aria-label="Server Embassy home">
          <Logo />
        </Link>

        <form onSubmit={onSearch} className="group hidden items-center rounded-full border border-line bg-page/60 pl-4 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/25 lg:flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SKU, brand, or product"
            className="min-w-0 flex-1 bg-transparent py-2.5 outline-none"
          />
          <button type="submit" className="m-1 grid h-9 w-9 place-items-center rounded-full bg-navy text-white transition hover:bg-brand" aria-label="Search">
            <Search size={16} />
          </button>
        </form>

        <div className="flex items-center gap-3">
          {settings.phone ? (
            <div className="hidden items-center gap-2 pr-2 text-sm xl:flex">
              <Headphones className="text-brand" size={16} />
              <a href={`tel:${settings.phone}`} className="font-medium hover:text-brand">
                {settings.phone}
              </a>
            </div>
          ) : null}
          <Link href="/login" className="nav-link hidden items-center gap-1.5 py-1 text-sm md:flex">
            <User size={16} /> Account
          </Link>
          <button
            type="button"
            className="relative flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">{formatMoney(subtotal)}</span>
            {count > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-sale px-1 text-[11px] text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="rounded-full border border-line bg-white p-2.5 shadow-soft lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-line/70 lg:block">
        <div className="container-se flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setCatsOpen(true)}
            onMouseLeave={() => setCatsOpen(false)}
          >
            <button
              type="button"
              className="nav-link flex items-center gap-2 px-3 py-3 text-sm font-semibold text-navy"
            >
              Categories <ChevronDown size={15} className={`transition-transform duration-200 ${catsOpen ? "rotate-180" : ""}`} />
            </button>
            {catsOpen && tree.length ? (
              <div className="anim-dropdown absolute left-0 top-full z-40 min-w-[520px] rounded-2xl border border-line bg-white p-6 shadow-lift">
                <div className="grid grid-cols-2 gap-6">
                  {tree.map((parent) => (
                    <div key={parent.id}>
                      <Link
                        href={`/shop/${parent.slug}`}
                        className="font-display text-navy hover:text-brand"
                        onClick={() => setCatsOpen(false)}
                      >
                        {parent.name}
                      </Link>
                      <ul className="mt-2 space-y-1 text-sm text-muted">
                        {(parent.children?.length ? parent.children : [parent]).map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/shop/${child.slug}`}
                              className="hover:text-navy"
                              onClick={() => setCatsOpen(false)}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {links.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className={`nav-link px-3 py-3 text-sm ${
                pathname === `/shop/${cat.slug}` ? "is-active font-semibold text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {cat.name}
            </Link>
          ))}

          <span className="mx-2 h-4 w-px bg-line" />

          {staticLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link px-3 py-3 text-sm ${
                isActive(link.href) ? "is-active font-semibold text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {menuOpen ? (
        <div className="anim-fade fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)}>
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
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
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
        <div className="anim-fade fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
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
            <div className="border-b border-line p-4">
              <FreeShippingBar compact />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {lines.length === 0 ? (
                <p className="text-sm text-muted">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {lines.map(({ product, qty }) => {
                    const icon = product.category?.slug?.includes("drive") ? "hdd" : "network";
                    return (
                      <li key={product.id} className="flex gap-3">
                        <div className="h-16 w-16 overflow-hidden">
                          <ProductVisual product={product} icon={icon} className="h-16" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-medium">{product.title}</p>
                          <p className="text-sm font-semibold">{formatMoney(product.price)}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <button type="button" onClick={() => setQty(product.id, qty - 1)}>
                              −
                            </button>
                            <span className="w-6 text-center text-sm">{qty}</span>
                            <button type="button" onClick={() => setQty(product.id, qty + 1)}>
                              +
                            </button>
                            <button
                              type="button"
                              className="ml-auto text-xs text-sale"
                              onClick={() => remove(product.id)}
                            >
                              Remove
                            </button>
                          </div>
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
    </header>
  );
}
