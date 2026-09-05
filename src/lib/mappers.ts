import type { Banner, Brand, Category, CmsPage, Product, StoreSettings } from "@/types/store";

type ApiProduct = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  brand?: { id: string; slug: string; name: string };
  category?: { id: string; slug: string; name: string; icon?: string };
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  weightLbs?: number;
  condition?: string;
  warranty?: string;
  description?: string;
  features?: string[];
  specs?: Array<{ label: string; value: string }>;
  featured?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string | null;
  status?: string;
  published?: boolean;
};

const conditionMap: Record<string, Product["condition"]> = {
  new: "New",
  certified_refurbished: "Certified Refurbished",
  used: "Used",
};

export function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    sku: p.sku,
    slug: p.slug,
    title: p.title,
    brandId: p.brandId,
    categoryId: p.categoryId,
    brand: p.brand,
    category: p.category,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    stock: p.stock,
    weightLbs: p.weightLbs ?? 1,
    condition: conditionMap[p.condition ?? "new"] ?? "New",
    warranty: p.warranty ?? "30 Days",
    rating: 0,
    reviewCount: 0,
    description: p.description ?? "",
    features: p.features ?? [],
    specs: p.specs ?? [],
    featured: p.featured ?? false,
    deal: p.isDeal ?? false,
    dealEndsAt: p.dealEndsAt ?? null,
    published: p.published ?? p.status === "published",
  };
}

export function mapCategory(c: Record<string, unknown>): Category {
  return {
    id: String(c.id),
    name: String(c.name ?? ""),
    slug: String(c.slug ?? ""),
    parentId: c.parentId ? String(c.parentId) : null,
    description: String(c.description ?? ""),
    bannerTitle: String(c.bannerTitle ?? c.name ?? ""),
    bannerSubtitle: String(c.bannerSubtitle ?? ""),
    showOnHomepage: Boolean(c.showOnHomepage),
    sortOrder: Number(c.sortOrder ?? 0),
    icon: c.icon ? String(c.icon) : "network",
    children: Array.isArray(c.children)
      ? (c.children as Record<string, unknown>[]).map(mapCategory)
      : undefined,
  };
}

export function mapBrand(b: Record<string, unknown>): Brand {
  return {
    id: String(b.id),
    slug: b.slug ? String(b.slug) : undefined,
    name: String(b.name ?? ""),
    featured: Boolean(b.featured),
  };
}

export function mapBanner(b: Record<string, unknown>): Banner {
  return {
    id: String(b.id),
    title: String(b.title ?? ""),
    subtitle: String(b.subtitle ?? ""),
    cta: String(b.ctaLabel ?? "Shop Now"),
    href: String(b.href ?? "/shop"),
    size: (b.size as Banner["size"]) ?? "half",
    sortOrder: Number(b.sortOrder ?? 0),
    active: Boolean(b.active ?? true),
  };
}

export function mapSettings(s: Record<string, unknown>): StoreSettings {
  return {
    name: String(s.storeName ?? "Server Embassy"),
    tagline: String(s.tagline ?? ""),
    phone: String(s.phone ?? ""),
    email: String(s.supportEmail ?? ""),
    address: String(s.address ?? ""),
    hours: String(s.hours ?? ""),
    freeShippingThreshold: Number(s.freeShippingThreshold ?? 199),
    freeShippingLabel: String(
      s.freeShippingLabel ?? "Free shipping on orders over $199",
    ),
    taxRate: Number(s.taxRate ?? 0.07),
  };
}

export function mapCmsPage(p: Record<string, unknown>): CmsPage {
  return {
    slug: String(p.slug ?? ""),
    title: String(p.title ?? ""),
    body: String(p.body ?? ""),
  };
}
