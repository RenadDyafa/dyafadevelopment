"use client";

import type { ReactNode } from "react";
import { useScrollTo } from "@/components/motion/SmoothScroll";

/** Plain in-page anchor, smoothed through Lenis once JS is available. */
export function ScrollLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const scrollTo = useScrollTo();
  return (
    <a href={href} className={className} onClick={(e) => (e.preventDefault(), scrollTo(href))}>
      {children}
    </a>
  );
}
