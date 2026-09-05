export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid h-9 w-9 place-items-center ${light ? "bg-white/15 text-white" : "bg-navy text-white"}`}>
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
          <rect x="2" y="3" width="14" height="2" fill="currentColor" />
          <rect x="2" y="8" width="14" height="2" fill="currentColor" />
          <rect x="2" y="13" width="9" height="2" fill="currentColor" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={`font-display block text-[15px] tracking-tight ${light ? "text-white" : "text-navy"}`}>
          Server Embassy
        </span>
        <span className={`block text-[10px] uppercase tracking-[0.14em] ${light ? "text-white/55" : "text-muted"}`}>
          Enterprise hardware
        </span>
      </span>
    </span>
  );
}
