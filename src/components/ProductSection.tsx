import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/types/store";

export default function ProductSection({
  id,
  eyebrow,
  title,
  description,
  href,
  products,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  products: Product[];
}) {
  if (!products.length) return null;

  return (
    <section id={id} className="container-se py-16">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">{eyebrow}</p>
            <h2 className="mt-2 text-3xl text-navy">{title}</h2>
            <p className="mt-2 max-w-xl text-muted">{description}</p>
          </div>
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
          >
            View all
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 8).map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 80}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}