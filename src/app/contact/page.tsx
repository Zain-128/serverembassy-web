import { getStoreSettings } from "@/lib/api/store";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const settings = await getStoreSettings().catch(() => null);

  return (
    <div className="container-se grid gap-8 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-navy">Contact</h1>
        <p className="mt-3 text-muted">Talk to a hardware specialist for quotes, bulk orders, or order status.</p>
        <div className="mt-6 space-y-2 text-sm">
          {settings?.address ? <p>{settings.address}</p> : null}
          {settings?.phone ? <p>{settings.phone}</p> : null}
          {settings?.email ? <p>{settings.email}</p> : null}
          {settings?.hours ? <p>{settings.hours}</p> : null}
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
