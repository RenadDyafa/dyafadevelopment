import type { CSSProperties } from "react";
import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/brand/paths";

type Props = {
  className?: string;
  title?: string;
  /** Assemble the 16 strokes around the centre when scrolled into view (CSS). */
  assemble?: boolean;
};

/** The official Dyafa ض ring, rendered from the identity PDF's vector paths. */
export function Symbol({ className, title, assemble = false }: Props) {
  return (
    <svg
      viewBox={SYMBOL_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
      data-reveal={assemble ? "assemble" : undefined}
    >
      {SYMBOL_PATHS.map((d, i) => (
        <path key={i} d={d} style={assemble ? ({ "--d": `${(i >> 1) * 70}ms` } as CSSProperties) : undefined} />
      ))}
    </svg>
  );
}
