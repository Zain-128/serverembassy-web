import { Suspense } from "react";
import ShopCatalog from "@/components/ShopCatalog";

export default function ShopPage() {
  return (
    <Suspense>
      <ShopCatalog title="Shop" description="Browse enterprise IT hardware by SKU, brand, and category." />
    </Suspense>
  );
}
