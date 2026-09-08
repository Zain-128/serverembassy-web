"use client";

import { type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useCreateQuoteMutation } from "@/store/storeApi";
import { useToast } from "@/components/Toast";

export default function QuoteForm() {
  const toast = useToast().toast;
  const [createQuote] = useCreateQuoteMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    try {
      await createQuote({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? "") || undefined,
        company: String(fd.get("company") ?? "") || undefined,
        partNumber: String(fd.get("partNumber") ?? "") || undefined,
        quantity: Number(fd.get("quantity")) || undefined,
        targetPrice: Number(fd.get("targetPrice")) || undefined,
        message: String(fd.get("message") ?? "") || undefined,
      }).unwrap();
      event.currentTarget.reset();
      toast("Quote request submitted! Our team will follow up shortly.", "success");
    } catch {
      toast("Could not submit quote. Is the API running?", "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-white p-8 shadow-card">
      <h2 className="font-display text-2xl text-navy">Request a quote</h2>
      <p className="mt-1 text-sm text-muted">
        Bulk orders, hard-to-find SKUs, or dedicated account management.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Name
          <input name="name" required className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Email
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Phone
          <input name="phone" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Company
          <input name="company" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Part Number
          <input name="partNumber" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Quantity
          <input name="quantity" type="number" min={1} className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="text-sm font-medium">
          Target Price
          <input name="targetPrice" type="number" min={0} step="0.01" className="mt-1 w-full rounded-lg border border-line px-3 py-2" />
        </label>
        <label className="col-span-full text-sm font-medium">
          Message
          <textarea name="message" className="mt-1 min-h-24 w-full rounded-lg border border-line px-3 py-2" />
        </label>
      </div>
      <button type="submit" className="btn btn-primary group mt-5">
        Submit
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
