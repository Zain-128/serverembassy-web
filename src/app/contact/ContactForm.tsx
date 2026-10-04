"use client";

import { type FormEvent, useState } from "react";
import { useCreateContactMutation } from "@/store/storeApi";
import { useToast } from "@/components/Toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const toast = useToast().toast;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sendMessage, { isLoading }] = useCreateContactMutation();

  function handleEmailChange(val: string) {
    setEmail(val);
    if (emailError) {
      if (!val || EMAIL_REGEX.test(val.trim())) {
        setEmailError("");
      }
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address (e.g. name@domain.com)");
      return;
    }
    setEmailError("");

    try {
      await sendMessage({ name: name.trim(), email: trimmedEmail, subject: subject.trim(), message: message.trim() }).unwrap();
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast("Message sent! We'll get back to you shortly.", "success");
    } catch {
      toast("Could not send message. Please try again.", "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-card">
      <label className="mb-3 block text-sm font-medium text-navy">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <label className="mb-3 block text-sm font-medium text-navy">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-ink outline-none transition focus:ring-2 ${
            emailError
              ? "border-red-500 ring-2 ring-red-500/20"
              : "border-line focus:border-brand focus:ring-brand/20"
          }`}
        />
        {emailError ? (
          <p className="mt-1 text-xs font-normal text-red-500">{emailError}</p>
        ) : null}
      </label>
      <label className="mb-3 block text-sm font-medium text-navy">
        Subject <span className="font-normal text-muted">(optional)</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <label className="mb-3 block text-sm font-medium text-navy">
        Message
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 min-h-32 w-full rounded-lg border border-line px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </label>
      <button type="submit" disabled={isLoading} className="btn btn-primary disabled:opacity-60">
        {isLoading ? "Sending…" : "Send"}
      </button>
    </form>
  );
}