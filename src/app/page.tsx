"use client";

import BrandShowcase from "@/components/BrandShowcase";
import ProductSection from "@/components/ProductSection";
import ProductFeatureScene from "@/components/showcase/ProductFeatureScene";
import QuoteForm from "@/components/QuoteForm";
import Reveal from "@/components/Reveal";
import HeroCarousel from "@/components/HeroCarousel";
import AfterHeroBand from "@/components/home/AfterHeroBand";
import FeatureProducts from "@/components/home/FeatureProducts";
import GoodCategories from "@/components/home/GoodCategories";
import LatestDealsWeek from "@/components/home/LatestDealsWeek";
import LatestNews from "@/components/home/LatestNews";
import NewsletterCta from "@/components/home/NewsletterCta";
import PartsPromoBanner from "@/components/home/PartsPromoBanner";
import StartCtaBand from "@/components/home/StartCtaBand";
import Testimonials from "@/components/home/Testimonials";
import ValueProp from "@/components/home/ValueProp";
import { MarqueeSkeleton, SectionSkeleton } from "@/components/Skeleton";
import {
  useGetBannersQuery,
  useGetBrandsQuery,
  useGetHomepageCategoriesQuery,
  useGetProductsQuery,
} from "@/store/storeApi";

export default function HomePage() {
  const { data: brands = [], isLoading: brandLoading } = useGetBrandsQuery();
  const { data: homepageCats = [] } = useGetHomepageCategoriesQuery();
  const { data: banners = [] } = useGetBannersQuery();
  const { data: featuredRes } = useGetProductsQuery({
    featured: true,
    limit: 8,
  });
  const { data: dealsRes, isLoading: dealsLoading } = useGetProductsQuery({
    deal: true,
    inStock: true,
    limit: 6,
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
  const deals = dealsRes?.items?.length
    ? dealsRes.items
    : [...featured, ...topFallback].slice(0, 6);

  return (
    <>
      <HeroCarousel
        banners={banners}
        featured={featured[0]}
        products={[...featured, ...topFallback].slice(0, 6)}
      />

      <AfterHeroBand
        brands={brands}
        banners={banners}
        products={[...featured, ...topFallback].slice(0, 4)}
      />

      {dealsLoading ? (
        <section className="bg-[#05070c] py-14">
          <div className="container-se h-64 animate-pulse rounded-xl bg-white/5" />
        </section>
      ) : (
        <LatestDealsWeek products={deals} />
      )}

      <PartsPromoBanner />

      <FeatureProducts categories={homepageCats} fallbackProducts={featured} />

      <GoodCategories categories={homepageCats} />

      <Testimonials />

      <LatestNews />

      <StartCtaBand />

      {featured[1] ? <ProductFeatureScene product={featured[1]} /> : null}

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

      <ValueProp />

      {brandLoading ? <MarqueeSkeleton /> : <BrandShowcase brands={brands} />}

      <NewsletterCta />

      <section id="quote" className="container-se py-16">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="section-label">B2B</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy">Need a volume quote?</h2>
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
