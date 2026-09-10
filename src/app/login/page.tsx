"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, BadgePercent, Headphones, Lock, ShieldCheck, Truck } from "lucide-react";
import { useCustomerLoginMutation, useRegisterMutation } from "@/store/authApi";
import { useToast } from "@/components/Toast";
import { TextField } from "@/components/ui/fields";
import { EASE } from "@/lib/motion";

const trustPoints = [
  { icon: Truck, text: "In-stock enterprise hardware ships in 1–2 days" },
  { icon: ShieldCheck, text: "Every unit tested, bench-verified & warranteed" },
  { icon: BadgePercent, text: "Volume quotes and B2B pricing on request" },
  { icon: Headphones, text: "Real humans answer the phone, not bots" },
];

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast().toast;
  const [customerLogin, { isLoading: signingIn }] = useCustomerLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();
  const [tab, setTab] = useState<"signin" | "register">("signin");

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await customerLogin({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }).unwrap();
      toast("Welcome back!", "success");
      router.push("/account");
    } catch {
      toast("Invalid email or password.", "error");
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await register({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        fullName: String(form.get("fullName") ?? ""),
        company: String(form.get("company") ?? "") || undefined,
      }).unwrap();
      toast("Account created! Welcome aboard.", "success");
      router.push("/account");
    } catch (e) {
      const msg =
        e && typeof e === "object" && "data" in e && e.data && typeof e.data === "object" && "error" in e.data
          ? String((e.data as { error: unknown }).error)
          : "Unable to create an account. Please try again.";
      toast(msg, "error");
    }
  }

  return (
    <div className="container-se py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[1.75rem] border border-line shadow-lift lg:grid-cols-[0.9fr_1.1fr]">
        {/* brand panel */}
        <div className="relative hidden bg-navy p-10 text-white lg:block">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0_28px,rgba(255,255,255,.1)_28px_29px)]" />
          <div className="anim-orb absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/40 blur-2xl" />
          <div className="anim-orb-2 absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-[#2f6fe4]/30 blur-2xl" />
          <div className="relative flex h-full flex-col">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-soft">
              <Lock size={14} /> Secure account access
            </p>
            <motion.h1
              className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Welcome back to your hardware workspace
            </motion.h1>
            <p className="mt-3 text-sm text-white/60">
              Track orders, save quotes, and get invited-referral rewards all in one place.
            </p>
            <div className="mt-8 space-y-4">
              {trustPoints.map((tp, i) => (
                <motion.div
                  key={tp.text}
                  className="flex items-center gap-3 text-sm text-white/80"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-soft">
                    <tp.icon size={16} />
                  </span>
                  {tp.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* form panel */}
        <div className="bg-white p-8 md:p-10">
          <div className="mx-auto max-w-md">
            <div className="flex gap-1 rounded-full bg-page p-1">
              {(
                [
                  ["signin", "Sign in"],
                  ["register", "Create account"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
                    tab === id ? "bg-white text-navy shadow-sm" : "text-muted hover:text-navy"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "signin" ? (
              <motion.form
                key="signin"
                onSubmit={onSignIn}
                className="mt-8 space-y-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h2 className="font-display text-2xl font-bold text-navy">Sign in</h2>
                <TextField label="Email" name="email" type="email" required placeholder="you@company.com" />
                <TextField label="Password" name="password" type="password" required placeholder="••••••••" />
                <button type="submit" disabled={signingIn} className="btn btn-primary group w-full">
                  {signingIn ? "Signing in…" : "Log in"}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <p className="text-center text-xs text-muted">
                  Protected by encrypted authentication.
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={onRegister}
                className="mt-8 space-y-5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h2 className="font-display text-2xl font-bold text-navy">Create account</h2>
                <p className="-mt-3 text-sm text-muted">Business accounts can later apply for tax-exempt status.</p>
                <TextField label="Full name" name="fullName" required placeholder="Jane Doe" />
                <TextField label="Email" name="email" type="email" required placeholder="you@company.com" />
                <TextField label="Company" name="company" placeholder="Optional" />
                <TextField label="Password" name="password" type="password" minLength={6} required placeholder="Minimum 6 characters" />
                <button type="submit" disabled={registering} className="btn btn-dark w-full">
                  {registering ? "Creating account…" : "Register"}
                </button>
                <p className="text-center text-xs text-muted">
                  Need a quote instead? <Link href="/contact" className="font-semibold text-brand hover:underline">Contact sales</Link>
                </p>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}