"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/brand/paths";
import { easeArch } from "@/components/motion/Reveal";

function Piece({ d, i, progress }: { d: string; i: number; progress: MotionValue<number> }) {
  const start = (i / SYMBOL_PATHS.length) * 0.82;
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1]);
  const scale = useTransform(progress, [start, start + 0.1], [0.7, 1]);
  return <motion.path d={d} style={{ opacity, scale, transformOrigin: "50px 50px", transformBox: "view-box" }} />;
}

/** Four-stage narrative: the ring assembles stroke by stroke as the story advances. */
export function Approach({ t }: { t: Dictionary }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const a = t.approach;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setStage(Math.min(3, Math.floor(p * 4))));
  const rail = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const gridDraw = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  if (reduce) {
    return (
      <section id="approach" aria-labelledby="approach-title" className="bg-charcoal py-[var(--spacing-section)] text-bone">
        <div className="shell">
          <Header a={a} />
          <ol className="mt-16 grid gap-12 md:grid-cols-2">
            {a.stages.map((s, i) => (
              <li key={s.title} className="border-t border-bone/15 pt-6">
                <p className="mb-3 font-sans text-xs tabular-nums tracking-widest text-sand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mb-3 text-4xl">{s.title}</h3>
                <p className="text-bone/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const s = a.stages[stage];
  return (
    <section id="approach" ref={ref} aria-labelledby="approach-title" className="cv-auto relative h-[420vh] bg-charcoal text-bone">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-[calc(var(--nav-h)+4vh)] pb-[6vh]">
        <div className="shell">
          <Header a={a} />
        </div>

        <div className="shell grid min-h-0 flex-1 items-center gap-10 md:grid-cols-12">
          {/* Stage rail */}
          <ol className="relative hidden flex-col gap-8 md:col-span-2 md:flex">
            <div aria-hidden className="absolute inset-y-1 start-[5px] w-px bg-bone/15">
              <motion.div className="h-full w-full origin-top bg-sand" style={{ scaleY: rail }} />
            </div>
            {a.stages.map((st, i) => (
              <li key={st.title} className="relative flex items-center gap-5 ps-0">
                <span
                  className={`relative z-10 block size-[11px] rotate-45 border transition-colors duration-500 ${i <= stage ? "border-sand bg-sand" : "border-bone/40 bg-charcoal"}`}
                />
                <span className={`text-sm transition-opacity duration-500 ${i === stage ? "opacity-100" : "opacity-70"}`}>{st.title}</span>
              </li>
            ))}
          </ol>

          {/* Oversized stage typography */}
          <div className="relative md:col-span-6" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.7, ease: easeArch }}
              >
                <p aria-hidden data-n={String(stage + 1).padStart(2, "0")} className="display mb-2 text-[clamp(5rem,14vw,12rem)] leading-none text-sand/20 tabular-nums before:content-[attr(data-n)]" />
                <h3 className="display mb-6 text-[length:var(--text-display)]">{s.title}</h3>
                <p className="max-w-md text-[length:var(--text-lede)] leading-relaxed text-bone/75">{s.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Architectural drawing: construction grid + assembling symbol */}
          {/* Sized by the smaller of column width and remaining viewport height, so the full ring always fits. */}
          <div
            aria-hidden
            className="relative mx-auto aspect-square w-[min(70vw,30rem,calc(100svh_-_var(--nav-h)_-_24rem))] md:col-span-4 md:w-[min(100%,calc(100svh_-_var(--nav-h)_-_12rem))]"
          >
            <svg viewBox="-20 -20 140 140" className="absolute inset-0 size-full text-bone/25" fill="none" stroke="currentColor" strokeWidth="0.25">
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <motion.line x1={-20} y1={v} x2={120} y2={v} style={{ pathLength: gridDraw }} />
                  <motion.line x1={v} y1={-20} x2={v} y2={120} style={{ pathLength: gridDraw }} />
                </g>
              ))}
              <motion.line x1={-20} y1={-20} x2={120} y2={120} style={{ pathLength: gridDraw }} />
              <motion.line x1={120} y1={-20} x2={-20} y2={120} style={{ pathLength: gridDraw }} />
              <motion.circle cx={50} cy={50} r={50} style={{ pathLength: gridDraw }} />
            </svg>
            <svg viewBox={SYMBOL_VIEWBOX} className="absolute inset-[10%] text-sand" fill="currentColor">
              {SYMBOL_PATHS.map((d, i) => (
                <Piece key={i} d={d} i={i} progress={scrollYProgress} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function Header({ a }: { a: Dictionary["approach"] }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-4 text-sand">
          <span className="me-3 tabular-nums">04</span>
          {a.eyebrow}
        </p>
        <h2 id="approach-title" className="display text-[length:var(--text-headline)]">
          {a.title}
        </h2>
      </div>
      <p className="placeholder-tag text-sand">{a.note}</p>
    </div>
  );
}
