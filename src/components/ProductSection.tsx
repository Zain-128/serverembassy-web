import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
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
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        href={href}
      />
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