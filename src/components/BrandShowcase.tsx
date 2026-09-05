import Link from "next/link";
import type { Brand } from "@/types/store";
import Reveal from "@/components/Reveal";

export default function BrandShowcase({ brands }: { brands: Brand[] }) {
  const list = brands.length ? brands : [];

  if (!list.length) return null;

  const loop = [...list, ...list];

  return (
    <section id="brands" className="container-se py-16">
      <Reveal>
        <div className="mb-8">
          <p className="section-label">Partners</p>
          <h2 className="mt-2 text-3xl text-navy">Shop by brand</h2>
          <p className="mt-2 max-w-xl text-muted">
            Enterprise SKUs from the manufacturers we stock every week.
          </p>
        </div>
      </Reveal>
      <div className="pause-on-hover relative overflow-hidden rounded-3xl border border-line bg-white py-2">
        <div className="anim-marquee flex w-max items-stretch">
          {loop.map((brand, i) => (
            <Link
              key={`${brand.id}-${i}`}
              href={`/shop?brand=${encodeURIComponent(brand.slug ?? brand.id)}`}
              className="group flex min-h-24 items-center justify-center px-8 transition-colors hover:bg-brand-soft sm:min-h-28"
            >
              <span className="font-display text-xl tracking-tight text-navy transition-colors group-hover:text-brand">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
}