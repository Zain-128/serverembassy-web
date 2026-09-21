import Image from "next/image";

export default function Logo({ light = false }: { light?: boolean }) {
  // black icon = white P (for dark surfaces); white icon = blue P (for light surfaces)
  const src = light ? "/brand/logo-icon-dark.jpg" : "/brand/logo-icon-light.jpg";

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={src}
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 shrink-0 rounded-md object-contain"
        priority
        aria-hidden
      />
      <span className="leading-[0.95]">
        <span
          className={`font-display block text-[17px] font-bold uppercase tracking-[0.04em] ${
            light ? "text-white" : "text-brand"
          }`}
        >
          Powerline
        </span>
        <span
          className={`block text-[11px] font-semibold uppercase tracking-[0.22em] ${
            light ? "text-white/70" : "text-navy"
          }`}
        >
          Devices
        </span>
      </span>
    </span>
  );
}
