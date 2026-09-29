"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealTag = "div" | "section" | "article" | "li" | "span";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      el.classList.add("in-view");
    }, delay || 40);
    return () => clearTimeout(t);
  }, [delay]);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}