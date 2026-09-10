"use client";

import { type FormEvent, useState } from "react";
import { motion } from "motion/react";
import { BellRing } from "lucide-react";
import { useSubscribeNewsletterMutation } from "@/store/storeApi";
import { useToast } from "@/components/Toast";
import { EASE, VIEWPORT } from "@/lib/motion";

export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribe] = useSubscribeNewsletterMutation();
  const toast = useToast().toast;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await subscribe(email).unwrap();
      setEmail("");
      setSubscribed(true);
      toast("You're on the list!", "success");
    } catch {
      toast("Could not subscribe. Try again.", "error");
    }
  }

  return (
    <motion.section
      className="container-se py-16"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white px-8 py-12 text-center shadow-lift md:px-14">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-brand-soft blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            <BellRing size={14} /> Stock alerts & deals
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
            First access to restocks and weekly hardware deals
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Join thousands of buyers who get notified the moment hard-to-find enterprise SKUs land back in stock.
          </p>

          {subscribed ? (
            <p className="mx-auto mt-6 w-fit rounded-full bg-green-50 px-5 py-2 text-sm font-semibold text-green-700">
              You&apos;re on the list — welcome aboard.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-full border border-line bg-page/60 p-1.5 transition focus-within:border-brand focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/20">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-muted/60"
              />
              <button type="submit" className="btn btn-primary shrink-0 px-5! py-2.5!">
                Join now
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-muted">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </motion.section>
  );
}