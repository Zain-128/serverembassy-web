"use client";

import { type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useCreateQuoteMutation } from "@/store/storeApi";
import { useToast } from "@/components/Toast";
import { TextField, TextareaField } from "@/components/ui/fields";

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
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField label="Name" name="name" required placeholder="Jane Doe" />
        <TextField label="Email" name="email" type="email" required placeholder="you@company.com" />
        <TextField label="Phone" name="phone" placeholder="+1 555 000 1234" />
        <TextField label="Company" name="company" placeholder="Acme Corp" />
        <TextField label="Part number" name="partNumber" placeholder="e.g. 00AJ140" />
        <TextField label="Quantity" name="quantity" type="number" min={1} placeholder="10" />
        <TextField label="Target price" name="targetPrice" type="number" min={0} step="0.01" placeholder="e.g. 120.00" />
        <TextareaField label="Message" name="message" placeholder="Anything we should know?" />
      </div>
      <button type="submit" className="btn btn-primary group mt-5">
        Submit
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </form>
  );
}
