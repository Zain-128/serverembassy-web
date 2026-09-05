import { getStoreSettings } from "@/lib/api/store";

export default async function AboutPage() {
  const settings = await getStoreSettings().catch(() => null);

  return (
    <div className="container-se max-w-3xl py-12">
      <h1 className="text-4xl font-bold text-navy">About {settings?.name ?? "Server Embassy"}</h1>
      <p className="mt-4 text-lg text-muted">
        {settings?.tagline ||
          "Trusted enterprise IT hardware"}. We source new, certified refurbished, and end-of-life IT hardware for
        businesses that need the right part — fast.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ["Founded", "2012"],
          ["Clients served", "2,000+"],
          ["Inventory access", "$10M+ / 2,000+ brands"],
          ["Orders processed", "2.3M+"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <p className="text-sm text-muted">{label}</p>
            <p className="text-xl font-bold text-navy">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
