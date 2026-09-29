"use client";

import HeroCarousel from "@/components/HeroCarousel";
import AfterHeroBand from "@/components/home/AfterHeroBand";
import LatestDealsWeek from "@/components/home/LatestDealsWeek";
import PartsPromoBanner from "@/components/home/PartsPromoBanner";
import FeatureProducts from "@/components/home/FeatureProducts";
import GoodCategories from "@/components/home/GoodCategories";
import Testimonials from "@/components/home/Testimonials";
import LatestNews from "@/components/home/LatestNews";
import StartCtaBand from "@/components/home/StartCtaBand";
import {
  useGetBannersQuery,
  useGetBrandsQuery,
  useGetHomepageCategoriesQuery,
  useGetProductsQuery,
} from "@/store/storeApi";

import { FIGMA_MOCK_PRODUCTS } from "@/data/mockProducts";

export default function WhiteHomePage() {
  const { data: brands = [] } = useGetBrandsQuery();
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
  const { data: topRes } = useGetProductsQuery({
    sort: "newest",
    inStock: true,
    limit: 12,
  });

  const rawFeatured = featuredRes?.items?.length ? featuredRes.items : FIGMA_MOCK_PRODUCTS;
  const rawTop = topRes?.items?.length ? topRes.items : FIGMA_MOCK_PRODUCTS;
  const featured = rawFeatured;
  const deals = dealsRes?.items?.length ? dealsRes.items : FIGMA_MOCK_PRODUCTS.slice(0, 6);

  return (
    <div className="bg-white text-[#0b1220]">
      {/* 1. Hero Carousel */}
      <HeroCarousel
        banners={banners}
        featured={featured[0]}
        products={[...featured, ...rawTop].slice(0, 6)}
      />

      {/* 2. Brand Strip, Feature Trio, Mid Headline, Promo Pair */}
      <AfterHeroBand
        brands={brands}
        banners={banners}
        products={[...featured, ...rawTop].slice(0, 4)}
        theme="light"
      />

      {/* 3. Latest Deals For This Week */}
      {dealsLoading ? (
        <section className="bg-white py-14">
          <div className="container-se h-64 animate-pulse rounded-xl bg-gray-100" />
        </section>
      ) : (
        <LatestDealsWeek products={deals} theme="light" />
      )}

      {/* 4. Parts Promo Banner */}
      <PartsPromoBanner theme="light" />

      {/* 5. Feature Products */}
      <FeatureProducts
        categories={homepageCats}
        fallbackProducts={featured}
        theme="light"
      />

      {/* 6. Good Categories */}
      <GoodCategories categories={homepageCats} theme="light" />

      {/* 7. Customer Reviews */}
      <Testimonials theme="light" />

      {/* 8. Latest News */}
      <LatestNews theme="light" />

      {/* 9. Don't Know Where To Start ? CTA Band */}
      <StartCtaBand theme="light" />
    </div>
  );
}
