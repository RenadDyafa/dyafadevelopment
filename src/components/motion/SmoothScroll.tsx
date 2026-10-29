"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useCallback, type ReactNode } from "react";

/**
 * Lenis drives the real window scroll position, so Motion's useScroll and the
 * R3F scene (which both read window scroll) stay in sync without a second loop.
 * Smoothing is disabled entirely for users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, anchors: false }}>
      {children}
    </ReactLenis>
  );
}

/** Scroll to an in-page target through Lenis when available, natively otherwise. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string, offset = 0) => {
      const el = document.querySelector<HTMLElement>(target);
      if (!el) return;
      // Sections use content-visibility, so heights above the target can settle while
      // scrolling; snap to the target's final position once the glide completes.
      if (lenis)
        lenis.scrollTo(el, {
          offset,
          duration: 1.6,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          onComplete: () => lenis.scrollTo(el, { offset, immediate: true }),
        });
      else el.scrollIntoView({ behavior: "auto", block: "start" });
      // Move focus for keyboard and screen-reader users.
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    },
    [lenis],
  );
}
