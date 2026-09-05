"use client";

import Link from "next/link";
import { ShieldCheck, Truck, RefreshCcw, Award, ArrowRight, BadgePercent } from "lucide-react";
import BrandShowcase from "@/components/BrandShowcase";
import CategoryBannerGrid from "@/components/CategoryBannerGrid";
import ProductSection from "@/components/ProductSection";
import PromoBanners from "@/components/PromoBanners";
import QuoteForm from "@/components/QuoteForm";
import Reveal from "@/components/Reveal";
import HeroCarousel from "@/components/HeroCarousel";
import { BannerGridSkeleton, MarqueeSkeleton, SectionSkeleton } from "@/components/Skeleton";
import {
  useGetBannersQuery,
  useGetBrandsQuery,
  useGetHomepageCategoriesQuery,
  useGetProductsQuery,
} from "@/store/storeApi";

const trusts = [
  { icon: ShieldCheck, title: "Original product", text: "Sourced through trusted channels" },
  { icon: Truck, title: "Fast dispatch", text: "In-stock items ship in 1–2 days" },
  { icon: RefreshCcw, title: "30-day returns", text: "RMA-backed window" },
  { icon: Award, title: "Secure checkout", text: "Encrypted payment" },
];

export default function HomePage() {
  const { data: brands = [], isLoading: brandLoading } = useGetBrandsQuery();
  const { data: homepageCats = [], isLoading: catsLoading } = useGetHomepageCategoriesQuery();
  const { data: banners = [] } = useGetBannersQuery();
  const { data: featuredRes, isLoading: featuredLoading } = useGetProductsQuery({
    featured: true,
    limit: 8,
  });
  const { data: topRes, isLoading: topLoading } = useGetProductsQuery({
    sort: "newest",
    inStock: true,
    limit: 12,
  });
  const { data: ratedRes, isLoading: ratedLoading } = useGetProductsQuery({
    sort: "rating",
    inStock: true,
    limit: 8,
  });

  const featured = featuredRes?.items ?? [];
  const featuredIds = new Set(featured.map((p) => p.id));
  const topProducts = (topRes?.items ?? []).filter((p) => !featuredIds.has(p.id)).slice(0, 8);
  const topFallback = topProducts.length ? topProducts : (topRes?.items ?? []).slice(0, 8);
  const topRated = (ratedRes?.items ?? []).filter((p) => !featuredIds.has(p.id)).slice(0, 8);

  return (
    <>
      <HeroCarousel banners={banners} featured={featured[0]} />

      <section className="border-b border-line bg-white/70">
        <div className="container-se grid gap-6 py-9 sm:grid-cols-2 lg:grid-cols-4">
          {trusts.map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <div className="group flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
                  <item.icon size={19} />
                </span>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <PromoBanners banners={banners} />

      <section id="deals" className="container-se py-10">
        <Reveal>
          <div className="shine relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-mid via-navy to-navy-mid p-8 text-white shadow-lift md:p-10">
            <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0_28px,rgba(255,255,255,.1)_28px_29px)]" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/40 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  <BadgePercent size={15} className="text-brand-soft" /> Weekly deals
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">
                  Up to 40% off in-stock hardware
                </h2>
                <p className="mt-3 text-white/70">
                  Rotating deals on enterprise storage, switches, and power — while stock lasts.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4">
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-brand-soft" /> Tested & warrantied</li>
                  <li className="flex items-center gap-2"><Truck size={16} className="text-brand-soft" /> Ships in 1–2 days</li>
                  <li className="flex items-center gap-2"><RefreshCcw size={16} className="text-brand-soft" /> 30-day returns</li>
                </ul>
                <Link href="/shop" className="btn btn-primary group bg-white! text-navy! shadow-[0_10px_24px_rgba(15,23,32,0.35)] hover:bg-brand-soft!">
                  Shop deals
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {catsLoading ? (
        <BannerGridSkeleton />
      ) : (
        <CategoryBannerGrid categories={homepageCats} />
      )}

      {featuredLoading ? (
        <SectionSkeleton id="featured" />
      ) : (
        <div className="bg-white/60">
          <ProductSection
            id="featured"
            eyebrow="Featured"
            title="Featured products"
            description="Hand-picked SKUs for common rack refreshes and replacements."
            href="/shop"
            products={featured}
          />
        </div>
      )}

      {ratedLoading ? (
        <SectionSkeleton id="top-rated" />
      ) : (
        <ProductSection
          id="top-rated"
          eyebrow="Top rated"
          title="Customer favorites"
          description="Highest-rated hardware our customers reorder most."
          href="/shop"
          products={topRated}
        />
      )}

      {topLoading ? (
        <SectionSkeleton id="new-arrivals" />
      ) : (
        <ProductSection
          id="new-arrivals"
          eyebrow="New arrivals"
          title="Fresh in stock"
          description="Recently added enterprise SKUs, tested and ready to ship."
          href="/shop"
          products={topFallback}
        />
      )}

      {brandLoading ? <MarqueeSkeleton /> : <BrandShowcase brands={brands} />}

      <section id="quote" className="container-se py-16">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-label">B2B</p>
              <h2 className="mt-2 text-3xl text-navy">Need a volume quote?</h2>
              <p className="mt-3 max-w-md text-muted">
                Send the part number and quantity. We reply with availability, lead time, and pricing.
              </p>
            </div>
            <QuoteForm />
          </div>
        </Reveal>
      </section>
    </>
  );
}
