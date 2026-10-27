import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { getCmsPageBySlug } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCmsPageBySlug(slug).catch(() => null);
  const title = page?.title || FALLBACK_POLICIES[slug]?.title;
  if (!title) return {};
  return {
    title: `${title} | ${STORE_CONTACT.companyName}`,
    alternates: { canonical: `/policies/${slug}` },
  };
}

function renderInlineLinks(text: string) {
  // Replace email and phone with clickable links
  const parts = text.split(/(info@powerlinedevices\.com|\(321\)\s*788-5899)/g);
  return parts.map((part, idx) => {
    if (part === "info@powerlinedevices.com") {
      return (
        <a key={idx} href={`mailto:${part}`} className="font-semibold text-[#0066ff] hover:underline">
          {part}
        </a>
      );
    }
    if (/\(321\)\s*788-5899/.test(part)) {
      return (
        <a key={idx} href={`tel:${STORE_CONTACT.phoneRaw}`} className="font-semibold text-[#0066ff] hover:underline">
          {part}
        </a>
      );
    }
    return part;
  });
}

// CMS page bodies are a single plain-text field. Blank lines separate blocks;
// a block is rendered as a heading if every non-empty line in it starts with "## ",
// as a bullet list if every line starts with "- ", and as a paragraph otherwise.
function PolicyBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);

  return (
    <div className="mt-4 space-y-4 leading-relaxed text-muted">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return null;

        if (lines.every((l) => l.startsWith("## "))) {
          return (
            <h2 key={i} className="pt-3 text-xl font-bold text-navy">
              {lines.map((l) => l.slice(3)).join(" ")}
            </h2>
          );
        }

        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{renderInlineLinks(l.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{renderInlineLinks(lines.join(" "))}</p>;
      })}
    </div>
  );
}

const FALLBACK_POLICIES: Record<string, { title: string; body: string }> = {
  shipping: {
    title: "Shipping Policy",
    body: `## Order Processing & Handling
All orders for in-stock enterprise hardware are processed and packed within 1–2 business days (Monday through Friday, excluding federal holidays). Orders placed before 2:00 PM EST on business days are queued for expedited carrier pickup on the same day.

## Shipping Methods & Domestic Delivery
We partner with FedEx, UPS, and certified freight carriers to ensure timely and secure transit for critical infrastructure components.
- Ground Shipping: Delivered within 3–5 business days across the continental United States. Orders qualifying over $199 unlock complimentary standard ground shipping.
- Expedited Air (Overnight & 2-Day): Available at checkout for time-sensitive emergency hardware deployments.
- LTL & Palletized Freight: Required for large enterprise chassis, multi-node rack servers, and high-density SAN enclosures. Lift-gate delivery and dock coordination are available upon request.

## International Shipments & Customs
Power Line Devices ships enterprise IT equipment worldwide. All international shipments are processed Delivery At Place (DAP) unless arranged otherwise with your account manager. Import duties, customs clearance tariffs, and local taxes are the responsibility of the consignee.

## Tracking & Transit Insurance
A tracking number and bill of lading (BOL) are automatically generated and sent via email upon carrier scan. Every shipment is fully insured against damage or loss during transit until delivery confirmation.

## Delivery Inquiries & Support
If you have questions regarding expedited courier routing, freight handling, or scheduling a specific delivery window, please contact our logistics desk at (321) 788-5899 or email info@powerlinedevices.com.`,
  },
  returns: {
    title: "Return Policy",
    body: `## 30-Day Return Window & RMA Authorization
We back our enterprise hardware with a 30-day return window from the confirmed carrier delivery date. Before returning any equipment, you must request a Return Merchandise Authorization (RMA) number from our support desk. Packages received without an authorized RMA number will be refused.

## Eligibility & Condition Requirements
To be eligible for a return or exchange:
- Items must be in their original received condition with all factory serial numbers, tamper-evident seals, and warranty stickers intact.
- All original accessories, power cords, transceivers, brackets, and static-shielding packaging must be included.
- Defective hardware or incorrect items delivered will be replaced or refunded with zero restocking fees.
- Customer-remorse returns or incorrectly ordered hardware may be subject to a standard 15% restocking and testing fee to cover component bench-recertification.

## Hardware Warranty & Replacement
Certified Refurbished hardware includes our comprehensive 30-day hardware replacement warranty. If a component fails under standard operating data center conditions within the warranty period, our technical staff will dispatch an advance replacement or issue a full refund upon diagnostics.

## Refund Processing Timeline
Once your return is delivered to our Florida testing facility, our certified technicians inspect and bench-test the hardware within 2–3 business days. Approved refunds are credited directly to your original payment method (Stripe card charge or wire credit) within 3–5 business days.

## Requesting an RMA
To start a return or exchange, contact our customer service department at (321) 788-5899 or email info@powerlinedevices.com with your Order Number and item serial number.`,
  },
};

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let page = await getCmsPageBySlug(slug).catch(() => null);

  const fallback = FALLBACK_POLICIES[slug];
  if (!page && fallback) {
    page = { slug, title: fallback.title, body: fallback.body };
  } else if (!page) {
    notFound();
  }

  // If page body is a 1-sentence draft (less than 100 characters) and a detailed policy exists, use the detailed policy
  const effectiveBody =
    page.body && page.body.trim().length > 100
      ? page.body
      : fallback?.body || page.body;

  return (
    <div className="container-se max-w-3xl py-12">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">{page.title}</h1>
      <PolicyBody body={effectiveBody} />

      {/* Official Contact Block on all Policy Pages */}
      <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-line shadow-xs">
        <h3 className="text-lg font-bold text-navy">Questions Regarding This Policy?</h3>
        <p className="mt-1 text-sm text-muted">
          Our team is available to assist with any inquiries regarding our {page.title.toLowerCase()}:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Direct Phone</p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Official Email</p>
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
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Mailing Address</p>
              <p className="mt-0.5 font-semibold text-navy">
                {STORE_CONTACT.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
