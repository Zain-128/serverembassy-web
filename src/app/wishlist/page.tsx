"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { useGetProductsByIdsQuery, useGetProductsQuery } from "@/store/storeApi";
import ProductCard from "@/components/ProductCard";
import { FIGMA_MOCK_PRODUCTS } from "@/data/mockProducts";
import type { Product } from "@/types/store";

export default function WishlistPage() {
  const { items: wishlistIds, count, clear } = useWishlist();

  const { data: apiProducts = [] } = useGetProductsByIdsQuery(wishlistIds, {
    skip: wishlistIds.length === 0,
  });

  const { data: catalogRes } = useGetProductsQuery(undefined, {
    skip: wishlistIds.length === 0 || apiProducts.length > 0,
  });

  const catalogItems = catalogRes?.items ?? [];
  const allAvailable = [...apiProducts, ...catalogItems, ...FIGMA_MOCK_PRODUCTS];

  // Map product IDs to product objects and deduplicate
  const wishlistedProducts: Product[] = wishlistIds
    .map((id) => allAvailable.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .filter((p, idx, arr) => arr.findIndex((item) => item.id === p.id) === idx);

  return (
    <div className="container-se py-10 md:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-red-600">
            <Heart size={14} className="fill-red-500 text-red-500" /> Favorites ({count})
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted">
            Saved hardware items and equipment for quick access and purchasing.
          </p>
        </div>

        {count > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-soft transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} /> Clear Wishlist
          </button>
        ) : null}
      </div>

      {count === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
            <Heart size={32} />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-navy">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-muted">
            Explore our catalog of enterprise servers, storage devices, and networking gear to add your favorite items here.
          </p>
          <Link
            href="/shop"
            className="btn btn-primary mt-6 inline-flex items-center gap-2"
          >
            <ShoppingBag size={16} /> Browse Shop
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
