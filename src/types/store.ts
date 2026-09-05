export type ProductCondition = "New" | "Certified Refurbished" | "Used";

export type SpecRow = { label: string; value: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  bannerTitle: string;
  bannerSubtitle: string;
  showOnHomepage: boolean;
  sortOrder: number;
  icon?: string;
  children?: Category[];
};

export type Brand = {
  id: string;
  slug?: string;
  name: string;
  featured: boolean;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  brandId: string;
  categoryId: string;
  brand?: { id: string; slug: string; name: string };
  category?: { id: string; slug: string; name: string; icon?: string };
  price: number;
  compareAtPrice: number | null;
  stock: number;
  weightLbs: number;
  condition: ProductCondition;
  warranty: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  specs: SpecRow[];
  featured: boolean;
  deal: boolean;
  dealEndsAt: string | null;
  published: boolean;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  size: "hero" | "half" | "third";
  sortOrder: number;
  active: boolean;
};

export type CmsPage = {
  slug: string;
  title: string;
  body: string;
};

export type StoreSettings = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  freeShippingThreshold: number;
  freeShippingLabel: string;
  taxRate: number;
};

export type ProductListResult = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  placedAt: string;
  items: Array<{
    productId: string;
    sku: string;
    title: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};
