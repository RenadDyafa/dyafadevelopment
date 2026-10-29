"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { FilmPlayer } from "@/components/sections/FilmPlayer";

/**
 * The film takes the whole screen and is played by the scroll itself, so it is
 * always seen whole: it rises out of About's limestone on its first frame,
 * runs to its last frame while pinned, then dims as Expertise rises over it.
 */
export function CinemaStage({ f }: { f: Dictionary["film"] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // 0 when the section's top meets the bottom of the screen; pinned from ~0.22.
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });

  const room = useTransform(p, [0, 0.22, 1], ["#f7f5f0", "#050505", "#050505"]);
  const veil = useTransform(p, [0, 0.24], [1, 0]);
  const push = useTransform(p, [0, 0.24], [1.12, 1]);
  // Expertise is pulled up by one screen and rises over the last stretch of the pin
  // (from 1 - 100/460 ≈ 0.78): the film finishes just before, then dims behind it.
  const film = useTransform(p, [0.22, 0.78], [0, 0.96]);
  const picture = useTransform(p, [0.78, 1], [1, 0.15]);

  if (reduce) {
    return (
      <section id="film" ref={ref} aria-labelledby="film-title" className="relative h-[100svh] min-h-[420px] overflow-hidden bg-ink">
        <h2 id="film-title" className="sr-only">{f.title}</h2>
        <FilmPlayer f={f} progress={film} still />
      </section>
    );
  }

  return (
    <motion.section id="film" ref={ref} aria-labelledby="film-title" style={{ backgroundColor: room }} className="relative h-[460vh]">
      <h2 id="film-title" className="sr-only">{f.title}</h2>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Fills the screen on every device; phones see the centre of the frame */}
        <motion.div style={{ opacity: picture }} className="relative size-full">
          <motion.div style={{ scale: push }} className="absolute inset-0">
            <FilmPlayer f={f} progress={film} />
          </motion.div>
          {/* Limestone veil carried over from About, lifting as the film arrives */}
          <motion.div
            aria-hidden
            style={{ opacity: veil }}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#f7f5f0_0%,rgba(247,245,240,0.85)_40%,rgba(247,245,240,0.4)_100%)]"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
