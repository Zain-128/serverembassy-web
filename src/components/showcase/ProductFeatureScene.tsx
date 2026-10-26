"use client";

import ServerCinematicScrubber from "./ServerCinematicScrubber";
import type { Product } from "@/types/store";

export { ServerCinematicScrubber };

export default function ProductFeatureScene({ product }: { product?: Product }) {
  // Renders the full-width cinematic 3D scroll canvas scrubber
  return <ServerCinematicScrubber />;
}
