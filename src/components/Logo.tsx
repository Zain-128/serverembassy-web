import Image from "next/image";

const BRAND = "Power Line Devices";

export default function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  const src = light
    ? compact
      ? "/brand/logo-icon-dark.jpg"
      : "/brand/logo-full-dark.jpg"
    : compact
      ? "/brand/logo-icon-light.jpg"
      : "/brand/logo-full-light.jpg";

  return (
    <span className="inline-flex items-center">
      <Image
        src={src}
        alt={BRAND}
        width={compact ? 40 : 168}
        height={compact ? 40 : 48}
        className={
          compact
            ? "h-9 w-9 object-contain"
            : "h-10 w-auto max-w-[168px] object-contain object-left md:h-11"
        }
        priority
      />
    </span>
  );
}
