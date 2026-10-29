"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useScrollTo } from "@/components/motion/SmoothScroll";

type Variant = "solid" | "line" | "ghost-light";

const styles: Record<Variant, string> = {
  solid: "bg-bone text-charcoal hover:bg-sand",
  line: "border border-current/40 hover:border-current",
  "ghost-light": "text-bone/85 hover:text-bone",
};

/** In-page call to action. Real anchor (works without JS); Lenis-smoothed when available. */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const scrollTo = useScrollTo();
  return (
    <motion.a
      href={href}
      onClick={(e) => {
        if (!href.startsWith("#")) return;
        e.preventDefault();
        scrollTo(href);
      }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex h-14 items-center gap-4 px-7 text-sm font-medium tracking-wide transition-colors duration-300 ${styles[variant]} ${className ?? ""}`}
    >
      <span>{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 40 10"
        className="h-2.5 w-7 overflow-visible transition-transform duration-500 ease-[var(--ease-arch)] group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M0 5h38M33 1l5 4-5 4" />
      </svg>
    </motion.a>
  );
}
