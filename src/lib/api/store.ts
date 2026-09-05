import { apiGet } from "./client";
import { storeApi } from "./config";
import {
  mapBanner,
  mapBrand,
  mapCategory,
  mapCmsPage,
  mapProduct,
  mapSettings,
} from "../mappers";
import type { Banner, Brand, Category, CmsPage, Product, ProductListResult, StoreSettings } from "@/types/store";

export type ProductQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  deal?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "sku";
};

export async function getProducts(params: ProductQuery = {}): Promise<ProductListResult> {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val != null && val !== "") qs.set(key, String(val));
  });
  const query = qs.toString();
  const res = await apiGet<{
    items: Parameters<typeof mapProduct>[0][];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(storeApi(`/products${query ? `?${query}` : ""}`));
  return { ...res, items: res.items.map(mapProduct) };
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await apiGet<Parameters<typeof mapProduct>[0]>(storeApi(`/products/${slug}`));
  return mapProduct(res);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const res = await apiGet<Parameters<typeof mapProduct>[0][]>(
    storeApi(`/products/by-ids?ids=${ids.join(",")}`),
  );
  return res.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const items = await getProductsByIds([id]);
  return items[0] ?? null;
}

export async function getCategoryTree(): Promise<Category[]> {
  const res = await apiGet<Record<string, unknown>[]>(storeApi("/categories"));
  return res.map(mapCategory);
}

export async function getHomepageCategories(): Promise<Category[]> {
  const res = await apiGet<Record<string, unknown>[]>(storeApi("/categories/homepage"));
  return res.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiGet<Record<string, unknown>>(storeApi(`/categories/${slug}`));
  return mapCategory(res);
}

export async function getBrands(): Promise<Brand[]> {
  const res = await apiGet<Record<string, unknown>[]>(storeApi("/brands"));
  return res.map(mapBrand);
}

export async function getBanners(): Promise<Banner[]> {
  const res = await apiGet<Record<string, unknown>[]>(storeApi("/banners"));
  return res.map(mapBanner);
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const res = await apiGet<Record<string, unknown>>(storeApi("/settings"));
  return mapSettings(res);
}

export async function getCmsPages(): Promise<CmsPage[]> {
  const res = await apiGet<Record<string, unknown>[]>(storeApi("/pages"));
  return res.map(mapCmsPage);
}

export async function getCmsPageBySlug(slug: string): Promise<CmsPage> {
  const res = await apiGet<Record<string, unknown>>(storeApi(`/pages/${slug}`));
  return mapCmsPage(res);
}
