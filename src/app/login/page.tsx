"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCustomerLoginMutation, useRegisterMutation } from "@/store/authApi";

export default function LoginPage() {
  const router = useRouter();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [customerLogin, { isLoading: signingIn }] = useCustomerLoginMutation();
  const [register, { isLoading: registering }] = useRegisterMutation();

  async function onSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignInError(null);
    const form = new FormData(event.currentTarget);
    try {
      await customerLogin({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }).unwrap();
      router.push("/account");
    } catch {
      setSignInError("Invalid email or password.");
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterError(null);
    const form = new FormData(event.currentTarget);
    try {
      await register({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        fullName: String(form.get("fullName") ?? ""),
        company: String(form.get("company") ?? "") || undefined,
      }).unwrap();
      router.push("/account");
    } catch (e) {
      const msg =
        e && typeof e === "object" && "data" in e && e.data && typeof e.data === "object" && "error" in e.data
          ? String((e.data as { error: unknown }).error)
          : "Unable to create an account. Please try again.";
      setRegisterError(msg);
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
        {signInError && <p className="mt-3 text-sm text-sale">{signInError}</p>}
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
        {registerError && <p className="mt-3 text-sm text-sale">{registerError}</p>}
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