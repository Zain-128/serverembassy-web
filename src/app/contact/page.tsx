import type { Metadata } from "next";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { getStoreSettings } from "@/lib/api/store";
import { STORE_CONTACT } from "@/lib/constants/contact";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Power Line Devices",
  description:
    "Get in touch with Power Line Devices for enterprise IT hardware quotes, bulk orders, and technical inquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getStoreSettings().catch(() => null);

  const phone = settings?.phone || STORE_CONTACT.phone;
  const phoneRaw = phone.replace(/[^\d+]/g, "") || STORE_CONTACT.phoneRaw;
  const email = settings?.email || STORE_CONTACT.email;
  const address = settings?.address || STORE_CONTACT.address;
  const hours = settings?.hours || STORE_CONTACT.hours;

  return (
    <div className="container-se py-12">
      <div className="grid gap-12 lg:grid-cols-12">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0066ff]">
              <ShieldCheck size={14} /> Enterprise Support
            </div>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Talk directly to an enterprise hardware specialist for quotes, custom configurations, bulk orders, or order status. Real humans answer our phones.
            </p>

            <div className="mt-8 space-y-5">
              {/* Phone */}
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-line shadow-xs transition hover:border-[#0066ff]/40">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Direct Phone</p>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition"
                  >
                    {phone}
                  </a>
                  <p className="text-xs text-muted">Direct hardware desk • No IVR loops</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-line shadow-xs transition hover:border-[#0066ff]/40">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Email Inquiries</p>
                  <a
                    href={`mailto:${email}`}
                    className="mt-0.5 text-base font-bold text-navy hover:text-[#0066ff] transition break-all"
                  >
                    {email}
                  </a>
                  <p className="text-xs text-muted">Quotes & inquiries answered promptly</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-line shadow-xs transition hover:border-[#0066ff]/40">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Office Location</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy leading-snug">
                    {address}
                  </p>
                  <p className="text-xs text-muted">United States</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-line shadow-xs">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Operating Hours</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">
                    {hours}
                  </p>
                  <p className="text-xs text-muted">Online order processing 24/7</p>
                </div>
              </div>

              {/* Social Channels */}
              <div className="flex items-start gap-4 rounded-2xl bg-white p-4 border border-line shadow-xs transition hover:border-[#0066ff]/40">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0066ff]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Follow Our Channels</p>
                  <div className="mt-2 flex items-center gap-3">
                    <a
                      href={STORE_CONTACT.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#1877F2] transition hover:bg-[#1877F2] hover:text-white"
                    >
                      <Facebook size={14} /> Facebook
                    </a>
                    <a
                      href={STORE_CONTACT.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-bold text-[#E4405F] transition hover:bg-[#E4405F] hover:text-white"
                    >
                      <Instagram size={14} /> Instagram
                    </a>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">Latest hardware inventory drops & data center updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white p-6 sm:p-10 border border-line shadow-sm">
            <h2 className="text-2xl font-bold text-navy">Send us a message</h2>
            <p className="mt-1 text-sm text-muted">
              Fill out the details below and a team member will follow up with you.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
