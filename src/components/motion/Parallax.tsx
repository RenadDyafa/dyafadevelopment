"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Scroll-linked layer: the only part of a static section that needs JS.
 * `y` / `scale` / `rotate` are [start, end] ranges over the element's pass
 * through the viewport.
 */
export function Parallax({
  children,
  className,
  innerClassName,
  y,
  scale,
  rotate,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  y?: [string, string];
  scale?: [number, number];
  rotate?: [number, number];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], reduce || !y ? ["0%", "0%"] : y);
  const s = useTransform(scrollYProgress, [0, 1], reduce || !scale ? [1, 1] : scale);
  const r = useTransform(scrollYProgress, [0, 1], reduce || !rotate ? [0, 0] : rotate);
  return (
    <div ref={ref} className={className}>
      <motion.div className={innerClassName} style={{ y: ty, scale: s, rotate: r }}>
        {children}
      </motion.div>
    </div>
  );
}
