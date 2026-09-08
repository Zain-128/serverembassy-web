"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCustomerLoginMutation, useRegisterMutation } from "@/store/authApi";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast().toast;
  const [customerLogin, { isLoading: signingIn }] = useCustomerLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();

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
      toast("Account created! Welcome to Server Embassy.", "success");
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
    <div className="container-se grid max-w-5xl gap-8 py-12 md:grid-cols-2">
      <form onSubmit={onSignIn} className="rounded-2xl bg-white p-8 ring-1 ring-line">
        <h1 className="text-2xl font-bold text-navy">Sign in</h1>
        <label className="mt-5 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <button type="submit" disabled={signingIn} className="btn btn-primary mt-5 w-full">
          {signingIn ? "Signing in…" : "Log in"}
        </button>
      </form>
      <form onSubmit={onRegister} className="rounded-2xl bg-white p-8 ring-1 ring-line">
        <h2 className="text-2xl font-bold text-navy">Create an account</h2>
        <p className="mt-1 text-sm text-muted">Business accounts can later apply for tax-exempt status.</p>
        <label className="mt-5 block text-sm">
          Full name
          <input
            name="fullName"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          Company
          <input name="company" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="mt-3 block text-sm">
          Password
          <input
            name="password"
            type="password"
            minLength={6}
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2"
          />
        </label>
        <button type="submit" disabled={registering} className="btn btn-dark mt-5 w-full">
          {registering ? "Creating account…" : "Register"}
        </button>
        <p className="mt-4 text-sm text-muted">
          Need a quote instead? <Link href="/contact" className="text-brand">Contact sales</Link>
        </p>
      </form>
    </div>
  );
}