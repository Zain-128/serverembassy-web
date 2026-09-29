"use client";

export default function Logo({ light = false }: { light?: boolean }) {
  const textColor = light ? "#ffffff" : "#0066ff";
  const subTextColor = light ? "rgba(255,255,255,0.85)" : "#0066ff";
  const lineBg = light ? "rgba(255,255,255,0.4)" : "#0066ff";

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      {/* Icon: Blue slanted container with sharp yellow bolt */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0066ff] shadow-sm overflow-hidden">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
        >
          {/* Parallelogram/P Background */}
          <path
            d="M3 2H15C18.3137 2 21 4.68629 21 8C21 11.3137 18.3137 14 15 14H7V22H3V2Z"
            fill="#0066ff"
          />
          {/* Yellow Lightning Bolt */}
          <path
            d="M13 2L4.5 13H11.5L9.5 22L19.5 9.5H12.5L13 2Z"
            fill="#ffcc00"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className="font-display text-[22px] font-black italic tracking-tight uppercase"
          style={{ color: textColor }}
        >
          POWERLINE
        </span>
        <div className="flex items-center gap-1 mt-0.5 w-full">
          <span className="h-[1.5px] flex-1 inline-block" style={{ backgroundColor: lineBg }} />
          <span
            className="text-[9px] font-extrabold uppercase tracking-[0.25em] px-0.5"
            style={{ color: subTextColor }}
          >
            DEVICES
          </span>
          <span className="h-[1.5px] flex-1 inline-block" style={{ backgroundColor: lineBg }} />
        </div>
      </div>
    </div>
  );
}
