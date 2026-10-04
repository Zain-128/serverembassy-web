"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cpu, HardDrive, Server } from "lucide-react";
import type { Product } from "@/types/store";
import { EASE } from "@/lib/motion";

export default function ProductGallery({
  product,
  icon,
}: {
  product: Product;
  icon: string;
}) {
  const imageUrls =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : product.image
        ? [product.image]
        : [];

  const [selectedImage, setSelectedImage] = useState<string>(imageUrls[0] || "");

  const categorySlug = product.category?.slug?.toLowerCase() ?? "";
  const isDrive = categorySlug.includes("drive") || categorySlug.includes("hdd") || categorySlug.includes("ssd");
  const isCpu = categorySlug.includes("cpu") || categorySlug.includes("processor") || categorySlug.includes("memory");
  const HardwareIcon = isDrive ? HardDrive : isCpu ? Cpu : Server;

  return (
    <div className="relative">
      <div className="relative aspect-square w-full rounded-3xl border border-line bg-white p-6 shadow-card flex items-center justify-center overflow-hidden">
        {selectedImage || imageUrls.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedImage || imageUrls[0]}
              src={selectedImage || imageUrls[0]}
              alt={product.title}
              className="h-full w-full object-contain"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE }}
              onError={(e) => {
                // If image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-center p-8 bg-slate-50/80 rounded-2xl border border-dashed border-line">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-white shadow-sm ring-1 ring-line">
              <HardwareIcon size={40} className="text-brand" />
            </div>
            <p className="mt-4 font-mono text-sm font-bold text-navy">{product.sku}</p>
            <p className="mt-1 text-xs text-muted uppercase tracking-wider">
              {product.brand?.name ?? "Hardware Product"}
            </p>
          </div>
        )}
      </div>

      {/* thumbnail gallery if multiple images */}
      {imageUrls.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(url)}
              className={`relative h-20 w-20 shrink-0 rounded-2xl border-2 bg-white p-2 overflow-hidden transition-all ${
                selectedImage === url ? "border-brand ring-2 ring-brand/20" : "border-line hover:border-brand/40"
              }`}
            >
              <img src={url} alt={`${product.title} ${idx + 1}`} className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}