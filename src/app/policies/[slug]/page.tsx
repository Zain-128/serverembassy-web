import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { getCmsPageBySlug } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";
import { breadcrumbJsonLd } from "@/lib/seo";

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
    body: `## Order Fulfillment & Processing
In-stock orders are processed and prepared for dispatch within 1–2 business days (Monday through Friday, excluding federal holidays).

## Shipping Methods & Domestic Delivery
Orders are shipped via major national carriers (including FedEx and UPS) or certified freight carriers for heavy rack-mount equipment.
- Standard Ground Shipping: Typically delivers within 3–5 business days across the continental United States.
- Free Shipping: Orders qualifying over $199 unlock complimentary standard ground shipping. For orders under $199, standard shipping is calculated at checkout.
- Retail Promotions Policy: Free shipping, discounts and all other promotions apply solely to e-commerce and retail orders, not to bulk or wholesale orders, which are priced by quotation.
- Freight Deliveries: Palletized or multi-node server orders require freight handling. Our logistics team will coordinate dispatch details upon order confirmation.

## Tracking & Order Status
A carrier tracking number is generated and sent to your order email address as soon as your shipment is dispatched.

## Custom Shipping Inquiries
If you have special shipping instructions, dock delivery requirements, or international shipping inquiries, please contact our support desk directly at (321) 788-5899 or email info@powerlinedevices.com before placing your order.`,
  },
  returns: {
    title: "Return Policy",
    body: `## 30-Day Return Window & RMA Authorization
We offer a 30-day return window from the date of confirmed delivery. Before returning any equipment, you must contact our support desk to receive a Return Merchandise Authorization (RMA) number. Returns received without an RMA number cannot be accepted.

## Condition & Eligibility
- Items must be returned in their original condition with all serial numbers, manufacturer tags, and warranty seals intact.
- All original power cables, brackets, transceivers, and packaging materials must be included with the return.
- If you receive a defective or incorrect item, contact our team immediately and we will provide a replacement or full refund.

## Return Shipping Fees
Customers are responsible for return shipping costs for standard discretionary returns or customer-initiated exchanges. For verified defective hardware or items shipped in error, Power Line Devices covers return shipping and provides a prepaid return label.

## Warranty Coverage
Certified refurbished and used hardware items include a 30-day hardware replacement warranty. If a component experiences a hardware failure under normal operating conditions within 30 days of delivery, our support team will replace the unit or issue a refund.

## Refund Process
Once returned items are received and inspected, approved refunds will be processed back to your original payment method within 3–5 business days.

## Requesting a Return
To initiate a return or warranty inquiry, please contact customer support at (321) 788-5899 or email info@powerlinedevices.com with your order number and item details.`,
  },
  "terms-of-service": {
    title: "Terms of Service",
    body: `## Agreement to Terms
These Terms of Service ("Terms") govern your access to and use of the Power Line Devices website and your purchase of enterprise hardware products from us. By placing an order, requesting a quotation, or accessing this site, you agree to be bound by these Terms.

## Products & Pricing Integrity
We specialize in certified refurbished, used, and new enterprise IT hardware, including servers, storage systems, networking switches, and enterprise components. Every product listing displays its tested condition and 30-day replacement warranty. We make every effort to display accurate inventory and pricing, but reserve the right to correct typographical or clerical errors and cancel affected orders prior to fulfillment.

## Retail Promotions & Wholesale Policy
Free shipping, discounts and all other promotions apply solely to e-commerce and retail orders, not to bulk or wholesale orders, which are priced by quotation.

## Orders & Payment Methods
We accept payment by credit card and ACH via Stripe, as well as direct bank wire transfer for high-volume enterprise orders. An order is not confirmed until inventory is reserved and payment verification is complete. We reserve the right to decline or cancel orders suspected of unauthorized payment or reseller fraud.

## Shipping & Delivery
Orders are dispatched via FedEx, UPS, or certified freight carriers. Standard ground shipping is provided for continental US deliveries. Risk of loss passes upon confirmed delivery to the carrier.

## Warranty & 30-Day RMA
All certified hardware is bench-tested prior to shipment and backed by our 30-day hardware replacement warranty. Returns require an authorized Return Merchandise Authorization (RMA) number.

## Limitation of Liability & Governing Law
These Terms are governed by and construed in accordance with the laws of the State of Florida, without regard to conflict-of-law principles. Any legal proceedings arising from these Terms shall be held in the state or federal courts located in Orange County, Florida.

## Contact Information
For questions regarding these Terms, contact us at info@powerlinedevices.com or call (321) 788-5899. Power Line Devices, 1317 Edgewater Dr Suite #6089, Orlando, FL 32804.`,
  },
  terms: {
    title: "Terms of Service",
    body: `## Agreement to Terms
These Terms of Service ("Terms") govern your access to and use of the Power Line Devices website and your purchase of enterprise hardware products from us. By placing an order, requesting a quotation, or accessing this site, you agree to be bound by these Terms.

## Products & Pricing Integrity
We specialize in certified refurbished, used, and new enterprise IT hardware, including servers, storage systems, networking switches, and enterprise components. Every product listing displays its tested condition and 30-day replacement warranty. We make every effort to display accurate inventory and pricing, but reserve the right to correct typographical or clerical errors and cancel affected orders prior to fulfillment.

## Retail Promotions & Wholesale Policy
Free shipping, discounts and all other promotions apply solely to e-commerce and retail orders, not to bulk or wholesale orders, which are priced by quotation.

## Orders & Payment Methods
We accept payment by credit card and ACH via Stripe, as well as direct bank wire transfer for high-volume enterprise orders. An order is not confirmed until inventory is reserved and payment verification is complete. We reserve the right to decline or cancel orders suspected of unauthorized payment or reseller fraud.

## Shipping & Delivery
Orders are dispatched via FedEx, UPS, or certified freight carriers. Standard ground shipping is provided for continental US deliveries. Risk of loss passes upon confirmed delivery to the carrier.

## Warranty & 30-Day RMA
All certified hardware is bench-tested prior to shipment and backed by our 30-day hardware replacement warranty. Returns require an authorized Return Merchandise Authorization (RMA) number.

## Limitation of Liability & Governing Law
These Terms are governed by and construed in accordance with the laws of the State of Florida, without regard to conflict-of-law principles. Any legal proceedings arising from these Terms shall be held in the state or federal courts located in Orange County, Florida.

## Contact Information
For questions regarding these Terms, contact us at info@powerlinedevices.com or call (321) 788-5899. Power Line Devices, 1317 Edgewater Dr Suite #6089, Orlando, FL 32804.`,
  },
  "privacy-policy": {
    title: "Privacy Policy",
    body: `## Privacy Commitment
Power Line Devices respects your privacy. This policy outlines how we handle customer and order information. We do not sell, rent, or trade your personal information to third parties.

## Information We Collect
- Contact Information: Name, business email address, phone number, and company name provided during registration, checkout, or quote submission.
- Order & Shipping Details: Delivery addresses, billing information, and ordered hardware specifications.
- Payment Processing: Credit card details are handled securely by Stripe under strict PCI-DSS Level 1 compliance. Power Line Devices never stores raw payment card numbers.

## Use of Information
We use your information solely to process orders, fulfill shipments, issue tracking notifications, process RMA warranty requests, and respond to sales inquiries.

## Contact Privacy Office
If you have any questions regarding our privacy practices or wish to request data deletion, contact us at info@powerlinedevices.com or call (321) 788-5899.`,
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

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: page.title, path: `/policies/${page.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
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
  </>
);
}
