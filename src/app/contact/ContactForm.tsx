"use client";

import { type FormEvent, useState } from "react";
import { useCreateContactMutation } from "@/store/storeApi";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [sendMessage, { isLoading }] = useCreateContactMutation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await sendMessage({ name, email, subject, message }).unwrap();
      setSent(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Could not send message. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-line shadow-card">
        <p className="font-semibold text-navy">Message sent!</p>
        <p className="mt-2 text-sm text-muted">A specialist will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-line shadow-card">
      <label className="mb-3 block text-sm">
        Name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      <label className="mb-3 block text-sm">
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      <label className="mb-3 block text-sm">
        Subject <span className="text-muted">(optional)</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      <label className="mb-3 block text-sm">
        Message
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 min-h-32 w-full rounded-lg border border-line px-3 py-2"
        />
      </label>
      {error ? <p className="mb-3 text-sm text-sale">{error}</p> : null}
      <button type="submit" disabled={isLoading} className="btn btn-primary disabled:opacity-60">
        {isLoading ? "Sending…" : "Send"}
      </button>
    </form>
  );
}