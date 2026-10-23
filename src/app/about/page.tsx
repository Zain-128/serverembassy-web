import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: `About Us | ${STORE_CONTACT.companyName}`,
  description:
    "Learn about Power Line Devices — trusted enterprise IT hardware supplier sourcing servers, networking, and storage.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getStoreSettings().catch(() => null);

  const phone = settings?.phone || STORE_CONTACT.phone;
  const phoneRaw = phone.replace(/[^\d+]/g, "") || STORE_CONTACT.phoneRaw;
  const email = settings?.email || STORE_CONTACT.email;
  const address = settings?.address || STORE_CONTACT.address;

  return (
    <div className="container-se max-w-3xl py-12">
      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0066ff]">
        <ShieldCheck size={14} /> Enterprise IT Hardware
      </div>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
        About {settings?.name ?? STORE_CONTACT.companyName}
      </h1>
      <p className="mt-4 text-lg text-muted leading-relaxed">
        {settings?.tagline || STORE_CONTACT.tagline}. We source new, certified refurbished, and end-of-life IT hardware for businesses that need the right part — fast.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Founded", "2012"],
          ["Clients served", "2,000+"],
          ["Inventory access", "$10M+ / 2,000+ brands"],
          ["Orders processed", "2.3M+"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 border border-line shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-line shadow-xs">
        <h3 className="text-xl font-bold text-navy">Connect With Our Team</h3>
        <p className="mt-1 text-sm text-muted">
          Need custom server configurations, hardware advice, or bulk quotes? Reach out directly:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Direct Phone</p>
              <a
                href={`tel:${phoneRaw}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Email Inquiries</p>
              <a
                href={`mailto:${email}`}
                className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition break-all"
              >
                {email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3.5 sm:col-span-2 pt-2 border-t border-line">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Headquarters</p>
              <p className="mt-0.5 font-semibold text-navy">
                {address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-line flex justify-end">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0066ff] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0052cc]"
          >
            Send a Message
          </Link>
        </div>
      </div>
    </div>
  );
}
