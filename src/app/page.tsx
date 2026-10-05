"use client";

import HeroCarousel from "@/components/HeroCarousel";
import AfterHeroBand from "@/components/home/AfterHeroBand";
import PromoBanners from "@/components/PromoBanners";
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
import { useTheme } from "@/context/ThemeContext";

import { FIGMA_MOCK_PRODUCTS } from "@/data/mockProducts";

export default function HomePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
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
    <div className={`transition-colors duration-300 ${isLight ? "bg-white text-[#0b1220]" : "bg-[#05070c] text-white"}`}>
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
        theme={theme}
      />

      {/* 2.5 Promotional Grid Banners */}
      <PromoBanners banners={banners} />

      {/* 3. Latest Deals For This Week */}
      {dealsLoading ? (
        <section className={isLight ? "bg-white py-14" : "bg-[#05070c] py-14"}>
          <div className="container-se h-64 animate-pulse rounded-xl bg-gray-200/50 dark:bg-white/5" />
        </section>
      ) : (
        <LatestDealsWeek products={deals} theme={theme} />
      )}

      {/* 4. Parts Promo Banner */}
      <PartsPromoBanner theme={theme} />

      {/* 5. Feature Products */}
      <FeatureProducts
        categories={homepageCats}
        fallbackProducts={featured}
        theme={theme}
      />

      {/* 6. Good Categories */}
      <GoodCategories categories={homepageCats} theme={theme} />

      {/* 7. Customer Reviews */}
      <Testimonials theme={theme} />

      {/* 8. Latest News */}
      <LatestNews theme={theme} />

      {/* 9. Don't Know Where To Start ? CTA Band */}
      <StartCtaBand theme={theme} />
    </div>
  );
}
