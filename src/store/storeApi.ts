import { createApi, fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import {
  mapBanner,
  mapBrand,
  mapCategory,
  mapCmsPage,
  mapProduct,
  mapSettings,
} from "@/lib/mappers";
import { getApiUrl } from "@/lib/api/config";
import type { RootState } from "./index";
import { logout } from "./authSlice";
import type {
  Banner,
  Brand,
  Category,
  CmsPage,
  CustomerOrder,
  Product,
  ProductListResult,
  StoreSettings,
} from "@/types/store";

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
  sort?: "price_asc" | "price_desc" | "newest" | "sku" | "rating";
};

export type CheckoutPayload = {
  email: string;
  customerId?: string;
  paymentMethod: "card" | "paypal" | "wire" | "purchase_order" | "net_terms";
  billingAddress: Record<string, unknown>;
  shippingAddress: Record<string, unknown>;
  items: Array<{ productId: string; qty: number }>;
  couponCode?: string;
};

function toQuery(params: Record<string, string | number | boolean | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val != null && val !== "") qs.set(key, String(val));
  });
  const query = qs.toString();
  return query ? `?${query}` : "";
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${getApiUrl()}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithLogout: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: baseQueryWithLogout,
  tagTypes: ["Settings", "Catalog"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductListResult, ProductQuery | void>({
      query: (params) => `/store/products${toQuery((params ?? {}) as Record<string, string | number | boolean | undefined>)}`,
      transformResponse: (res: ProductListResult & { items: Parameters<typeof mapProduct>[0][] }) => ({
        ...res,
        items: res.items.map(mapProduct),
      }),
      providesTags: ["Catalog"],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/store/products/${slug}`,
      transformResponse: (res: Parameters<typeof mapProduct>[0]) => mapProduct(res),
    }),
    getProductsByIds: builder.query<Product[], string[]>({
      query: (ids) => `/store/products/by-ids?ids=${ids.join(",")}`,
      transformResponse: (res: Parameters<typeof mapProduct>[0][]) => res.map(mapProduct),
    }),
    getCategoryTree: builder.query<Category[], void>({
      query: () => "/store/categories",
      transformResponse: (res: Record<string, unknown>[]) => res.map(mapCategory),
      providesTags: ["Catalog"],
    }),
    getHomepageCategories: builder.query<Category[], void>({
      query: () => "/store/categories/homepage",
      transformResponse: (res: Record<string, unknown>[]) => res.map(mapCategory),
    }),
    getCategoryBySlug: builder.query<Category, string>({
      query: (slug) => `/store/categories/${slug}`,
      transformResponse: (res: Record<string, unknown>) => mapCategory(res),
    }),
    getBrands: builder.query<Brand[], void>({
      query: () => "/store/brands",
      transformResponse: (res: Record<string, unknown>[]) => res.map(mapBrand),
    }),
    getBanners: builder.query<Banner[], void>({
      query: () => "/store/banners",
      transformResponse: (res: Record<string, unknown>[]) => res.map(mapBanner),
    }),
    getSettings: builder.query<StoreSettings, void>({
      query: () => "/store/settings",
      transformResponse: (res: Record<string, unknown>) => mapSettings(res),
      providesTags: ["Settings"],
    }),
    getCmsPageBySlug: builder.query<CmsPage, string>({
      query: (slug) => `/store/pages/${slug}`,
      transformResponse: (res: Record<string, unknown>) => mapCmsPage(res),
    }),
    getMyOrders: builder.query<
      { items: CustomerOrder[]; total: number; page: number; limit: number; totalPages: number },
      void
    >({
      query: () => "/store/me/orders",
      transformResponse: (res: {
        items: CustomerOrder[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }) => res,
      providesTags: ["Catalog"],
    }),
    createOrder: builder.mutation<
      { id: string; orderNumber: string; total: number; discount?: number },
      CheckoutPayload
    >({
      query: (body) => ({ url: "/checkout", method: "POST", body }),
    }),
    createQuote: builder.mutation<
      unknown,
      {
        name: string;
        email: string;
        phone?: string;
        company?: string;
        partNumber?: string;
        quantity?: number;
        targetPrice?: number;
        message?: string;
      }
    >({
      query: (body) => ({ url: "/quotes", method: "POST", body }),
    }),
    subscribeNewsletter: builder.mutation<unknown, string>({
      query: (email) => ({ url: "/newsletter", method: "POST", body: { email } }),
    }),
    createContact: builder.mutation<
      unknown,
      { name: string; email: string; subject?: string; message: string }
    >({
      query: (body) => ({ url: "/contact", method: "POST", body }),
    }),
    validateCoupon: builder.mutation<
      { valid: boolean; code?: string; discount?: number; type?: string; error?: string },
      { code: string; subtotal: number }
    >({
      query: (body) => ({ url: "/store/coupons/validate", method: "POST", body }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductsByIdsQuery,
  useGetCategoryTreeQuery,
  useGetHomepageCategoriesQuery,
  useGetCategoryBySlugQuery,
  useGetBrandsQuery,
  useGetBannersQuery,
  useGetSettingsQuery,
  useGetCmsPageBySlugQuery,
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useCreateQuoteMutation,
  useSubscribeNewsletterMutation,
  useCreateContactMutation,
  useValidateCouponMutation,
} = storeApi;
