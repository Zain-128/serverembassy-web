import type { Product } from "@/types/store";

const palettes: Record<string, [string, string]> = {
  switch: ["#2a3c4c", "#3f6f7a"],
  hdd: ["#1c2a38", "#4a7a86"],
  ssd: ["#243544", "#5c7d88"],
  memory: ["#1c2a38", "#3f6f7a"],
  psu: ["#243544", "#6a7c72"],
  cpu: ["#1c2a38", "#4d6e7a"],
  router: ["#2a3c4c", "#3f6f7a"],
  network: ["#243544", "#3f6f7a"],
};

function DriveBays() {
  return (
    <div className="space-y-1.5 px-1">
      {[0, 1, 2].map((r) => (
        <div
          key={r}
          className="flex items-center justify-between gap-3 rounded-md bg-black/30 px-2 py-1.5"
        >
          <span className="h-1.5 flex-1 rounded-full bg-white/45" />
          <span className="h-1.5 w-3 rounded-sm bg-emerald-400/90 shadow-[0_0_6px_rgba(110,231,183,0.8)]" />
        </div>
      ))}
    </div>
  );
}

function NetworkPorts() {
  return (
    <div className="grid grid-cols-4 gap-1.5 px-3">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="aspect-square rounded-[3px] bg-white/55" />
      ))}
    </div>
  );
}

export default function ProductVisual({
  product,
  icon,
  className = "",
}: {
  product: Product;
  icon: string;
  className?: string;
}) {
  const [from, to] = palettes[icon] ?? palettes.network;
  const isDrive = icon === "hdd";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,transparent_0_18px,rgba(255,255,255,.14)_18px_19px)]" />
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      <div className="absolute inset-0 flex min-h-[160px] flex-col items-center justify-center gap-4 px-6 py-8">
        <div className="relative w-2/3 max-w-[190px]">
          <span className="absolute -right-1.5 -top-1.5 z-10 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_8px_2px_rgba(110,231,183,0.55)]" />
          <div className="overflow-hidden rounded-xl border border-white/25 bg-navy/50 py-4 shadow-[0_14px_34px_rgba(10,18,26,0.5)]">
            {isDrive ? <DriveBays /> : <NetworkPorts />}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="rounded-full border border-white/20 bg-black/25 px-3 py-1 font-mono text-xs tracking-wide text-white/90">
            {product.sku}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">{product.condition}</p>
        </div>
      </div>
      <div className="absolute inset-x-8 bottom-2 h-2 rounded-full bg-black/30 blur-md" />
    </div>
  );
}