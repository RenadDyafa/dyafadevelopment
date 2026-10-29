import type { CSSProperties } from "react";

/**
 * Official brand pattern (identity PDF, p.11) used as a CSS mask so it can
 * take any token colour via `currentColor`. `size` is the tile width in px.
 */
export function Pattern({ className, size = 320, style }: { className?: string; size?: number; style?: CSSProperties }) {
  const mask = `url(/brand/pattern.svg) 0 0 / ${size}px auto repeat`;
  return (
    <div
      aria-hidden
      className={className}
      style={{ backgroundColor: "currentColor", WebkitMask: mask, mask, ...style }}
    />
  );
}
