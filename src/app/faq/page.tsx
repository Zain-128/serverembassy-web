import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { STORE_CONTACT } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${STORE_CONTACT.companyName}`,
  description:
    "Common questions and answers regarding orders, shipping, payment methods, warranty, and returns at Power Line Devices.",
  alternates: { canonical: "/faq" },
};

const groups = [
  {
    title: "Shipping",
    items: [
      ["Do you offer free shipping?", "Yes — qualifying US orders over $199 unlock free ground shipping. Expedited and freight options are also available."],
      ["Do you ship internationally?", "Yes. Duties and taxes are paid by the customer unless quoted otherwise."],
    ],
  },
  {
    title: "Condition & warranty",
    items: [
      ["What is certified refurbished?", "Tested, repaired if needed, and sold with a 30-day replacement window."],
      ["How do returns work?", "Request an RMA within 30 days. Unused items may incur a restocking fee."],
    ],
  },
  {
    title: "Payments",
    items: [
      ["Which cards do you take?", "Visa, Mastercard, American Express, Discover, plus PayPal and wire for B2B."],
      ["Can we use a purchase order?", "Authorized business accounts can check out with PO / net terms."],
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container-se max-w-3xl py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">Frequently Asked Questions</h1>
      <p className="mt-3 text-base text-muted">
        Find quick answers to common questions about hardware purchasing, warranties, shipping, and payment terms.
      </p>

      {groups.map((group) => (
        <section key={group.title} className="mt-8">
          <h2 className="text-xl font-bold text-navy">{group.title}</h2>
          <div className="mt-3 space-y-3">
            {group.items.map(([q, a]) => (
              <details key={q} className="rounded-2xl bg-white p-4 sm:p-5 border border-line shadow-xs group">
                <summary className="cursor-pointer font-bold text-navy hover:text-[#0066ff] transition">{q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      {/* Still Have Questions Box */}
      <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-line shadow-xs">
        <h3 className="text-xl font-bold text-navy">Still have questions?</h3>
        <p className="mt-1 text-sm text-muted">
          Our team is available Monday through Friday to answer technical questions and configure custom quotes:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Direct Line</p>
              <a
                href={`tel:${STORE_CONTACT.phoneRaw}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition"
              >
                {STORE_CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Email Us</p>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition break-all"
              >
                {STORE_CONTACT.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:col-span-2 pt-2 border-t border-line">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Office Address</p>
              <p className="mt-0.5 font-semibold text-navy">
                {STORE_CONTACT.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line flex justify-end">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0052cc]"
          >
            Contact Support Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
