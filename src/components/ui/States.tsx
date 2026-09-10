"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ShieldAlert, ShoppingBag, Truck, Users } from "lucide-react";
import { EASE } from "@/lib/motion";

function StateShell({
  icon,
  title,
  body,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <motion.div
      className="mx-auto max-w-md rounded-3xl border border-line bg-white p-10 text-center shadow-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-bold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-muted">{body}</p>
      {cta ? (
        <Link href={cta.href} className="btn btn-primary group mt-6">
          {cta.label}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </motion.div>
  );
}

export function StateBox({
  icon,
  title,
  body,
  cta,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <StateShell
      icon={icon ?? <SearchIcon />}
      title={title}
      body={body}
      cta={cta}
    />
  );
}

export function EmptyCart() {
  return (
    <StateShell
      icon={<ShoppingBag size={26} />}
      title="Your cart is empty"
      body="Browse the catalog and add some tested enterprise hardware to your order."
      cta={{ label: "Shop the catalog", href: "/shop" }}
    />
  );
}

export function EmptyOrders() {
  return (
    <StateShell
      icon={<Truck size={26} />}
      title="No orders yet"
      body="When you place an order it will appear here with status and tracking."
      cta={{ label: "Start shopping", href: "/shop" }}
    />
  );
}

export function EmptySearch() {
  return (
    <StateShell
      icon={<SearchIcon />}
      title="No results"
      body="Try changing your search terms or removing some filters."
      cta={{ label: "Clear and browse all", href: "/shop" }}
    />
  );
}

function SearchIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function ErrorState({
  title = "Something went wrong",
  body = "We couldn't load this content. Please try again.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <StateShell
      icon={<ShieldAlert size={26} />}
      title={title}
      body={body}
    />
  );
}

export function ReferralEmpty() {
  return (
    <StateShell
      icon={<Users size={26} />}
      title="No invites yet"
      body="Share your invite link with friends — the first one to bring someone joins the leaderboard."
    />
  );
}