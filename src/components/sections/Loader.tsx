import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/brand/paths";

/** Seconds the hero waits so its entrance plays as the loader lifts. */
export const INTRO_DELAY = 1.45;

/** Delay still remaining before the curtain lifts, measured from navigation start. */
export function introDelay(extra = 0) {
  const elapsed = typeof performance === "undefined" ? 0 : performance.now() / 1000;
  return Math.max(0, INTRO_DELAY + extra - elapsed);
}

/**
 * Opening frame: the ض units assemble into the ring, then the curtain lifts.
 * Pure CSS (see `.loader` in globals.css) so it plays and clears on time even
 * before JavaScript has loaded on slow devices; reduced motion skips it.
 */
export function Loader({ label }: { label: string }) {
  return (
    <div id="site-loader" role="status" aria-label={label} className="loader">
      <svg viewBox={SYMBOL_VIEWBOX} className="loader-symbol" fill="currentColor" aria-hidden>
        {SYMBOL_PATHS.map((d, i) => (
          <path key={i} d={d} style={{ animationDelay: `${(i >> 1) * 70}ms` }} />
        ))}
      </svg>
    </div>
  );
}
