"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useSubscribeNewsletterMutation } from "@/store/storeApi";
import { useStoreSettings } from "@/context/StoreContext";
import Logo from "@/components/Logo";

const shopLinks = [
  ["Shop all", "/shop"],
  ["Network Switches", "/shop/network-switches"],
  ["Hard Drives", "/shop/hard-drives"],
  ["Brands", "/#brands"],
];

const company = [
  ["About us", "/about"],
  ["Contact", "/contact"],
  ["FAQ", "/faq"],
];

const policies = [
  ["Shipping", "/policies/shipping"],
  ["Return Policy", "/policies/returns"],
];

export default function Footer() {
  const { settings: store } = useStoreSettings();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [subscribe] = useSubscribeNewsletterMutation();

  async function onSubscribe(event: FormEvent) {
    event.preventDefault();
    try {
      await subscribe(email).unwrap();
      setMsg("Subscribed. Welcome on board!");
      setEmail("");
    } catch {
      setMsg("Could not subscribe. Try again.");
    }
  }

  return (
    <footer className="mt-8 border-t border-line bg-navy text-white">
      <div className="h-1 bg-[linear-gradient(90deg,#5fa6b3,#3f6f7a,#2a4a52,#3f6f7a,#5fa6b3)]" />

      <section className="border-b border-white/10">
        <div className="container-se flex flex-col items-center gap-6 py-12 text-center md:flex-row md:justify-between md:text-left">
          <div className="max-w-md">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-soft md:justify-start">
              <Mail size={16} /> Deals & restocks
            </p>
            <h2 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
              Join the stock alert list
            </h2>
            <p className="mt-2 text-sm text-white/60">
              First access to restocks, weekly deals, and hard-to-find SKUs.
            </p>
          </div>
          <form onSubmit={onSubscribe} className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1.5 transition focus-within:border-white/50">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40"
              />
<button type="submit" className="btn btn-primary shrink-0 py-2.5!">
              Join now
            </button>
            </div>
            {msg ? <p className="mt-2 text-xs text-white/70">{msg}</p> : null}
          </form>
        </div>
      </section>

      <div className="container-se grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo light />
          {store.address ? <p className="mt-4 text-sm text-white/60">{store.address}</p> : null}
          {store.phone ? <p className="mt-2 text-sm text-white/60">{store.phone}</p> : null}
          {store.email ? <p className="text-sm text-white/60">{store.email}</p> : null}
        </div>
        {[
          ["Shop", shopLinks],
          ["Company", company],
          ["Policies", policies],
        ].map(([heading, items]) => (
          <div key={String(heading)}>
            <h3 className="font-display mb-3">{heading}</h3>
            <ul className="space-y-2 text-sm text-white/65">
              {(items as string[][]).map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {store.name} · Tested enterprise IT hardware
      </div>
    </footer>
  );
}