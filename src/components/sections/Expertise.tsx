"use client";

import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { RevealText, easeArch, easeCinema } from "@/components/motion/Reveal";
import { Symbol } from "@/components/brand/Symbol";

// Each capability shifts the room's tone — all derived from the brand palette.
const TONES = ["#232224", "#4f4f46", "#19181a", "#3a3934"];
// Wide screens with motion allowed: the section pins and the scroll walks through 01–04.
const PIN_QUERY = "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)"; // the `stage` variant

type Item = Dictionary["expertise"]["items"][number];

export function Expertise({ t }: { t: Dictionary }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = t.expertise.items;
  const item = items[active];

  useEffect(() => {
    const mq = matchMedia(PIN_QUERY);
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const frame = useRef<HTMLDivElement>(null);
  // The first image is unveiled when the panel arrives, not on page load.
  const seen = useInView(frame, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const drift = useTransform(scrollYProgress, (p) => `${(0.5 - ((p * items.length) % 1 || 0)) * 9}%`);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (pinned) setActive(Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length))));
  });

  // While pinned, choosing an item scrolls to its stretch of the section.
  const choose = (i: number) => {
    const el = ref.current;
    if (!pinned || !el) return setActive(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + ((i + 0.5) / items.length) * (el.offsetHeight - window.innerHeight);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const onKey = (e: KeyboardEvent) => {
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    const keys: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, ArrowRight: dir, ArrowLeft: -dir };
    if (e.key in keys) {
      e.preventDefault();
      const next = (active + keys[e.key] + items.length) % items.length;
      choose(next);
      if (!pinned) setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section
      id="expertise"
      ref={ref}
      aria-labelledby="expertise-title"
      className="relative isolate z-10 overflow-x-clip text-bone motion-safe:-mt-[100svh] stage:h-[400vh]"
    >
      {/* The room rises over the end of the film: transparent at the top, then the tone of the active item */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 motion-safe:[mask-image:linear-gradient(180deg,transparent_0,#000_75svh)]"
        animate={{ backgroundColor: TONES[active] }}
        initial={{ backgroundColor: TONES[0] }}
        transition={{ duration: 1, ease: easeCinema }}
      />
      <div className="stage:sticky stage:top-0 stage:flex stage:h-[100svh] stage:flex-col stage:justify-center">
        <div className="shell pt-[var(--spacing-section)] stage:pt-[calc(var(--nav-h)+1.5rem)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-6 text-sand">
                <span className="me-3 tabular-nums">02</span>
                {t.expertise.eyebrow}
              </p>
              <RevealText id="expertise-title" as="h2" lines={[t.expertise.title]} className="display text-[length:var(--text-display)]" />
            </div>
            <p className="placeholder-tag text-sand">{t.expertise.note}</p>
          </div>
        </div>

        {/* Phones and tablets: the four capabilities stacked, each image unveiled as it arrives */}
        <ol className="shell grid gap-16 py-[clamp(3rem,7vw,6rem)] pb-[var(--spacing-section)] wide:hidden">
          {items.map((it, i) => (
            <StackedItem key={it.id} item={it} n={i + 1} reduce={!!reduce} />
          ))}
        </ol>

        {/* Wide screens: index + exhibition panel */}
        <div className="shell hidden gap-x-12 py-[clamp(3rem,7vw,6rem)] pb-[var(--spacing-section)] wide:grid wide:grid-cols-12 stage:py-[clamp(1.5rem,4vh,3rem)]">
          <LayoutGroup>
            <div role="tablist" aria-orientation="vertical" aria-label={t.expertise.title} onKeyDown={onKey} className="flex flex-col lg:col-span-5">
              {items.map((it, i) => {
                const selected = i === active;
                return (
                  <button
                    key={it.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${it.id}`}
                    aria-selected={selected}
                    aria-controls={`panel-${it.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(i)}
                    className="group relative flex items-baseline gap-6 border-t border-bone/15 py-6 text-start last:border-b"
                  >
                    {selected && (
                      <motion.span
                        layoutId="expertise-rule"
                        className="absolute inset-x-0 -top-px h-px bg-sand"
                        transition={{ duration: 0.7, ease: easeArch }}
                      />
                    )}
                    <span className="font-sans text-xs tabular-nums tracking-widest text-sand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <motion.span
                      layout="position"
                      className={`display text-[clamp(1.4rem,2.4vw,2.2rem)] transition-opacity duration-500 ${selected ? "opacity-100" : "opacity-70 group-hover:opacity-90"}`}
                    >
                      {it.title}
                    </motion.span>
                  </button>
                );
              })}
              {pinned && (
                <div aria-hidden className="mt-8 h-px w-full bg-bone/10">
                  <motion.div className="h-full origin-[0%_50%] bg-sand rtl:origin-[100%_50%]" style={{ scaleX: scrollYProgress }} />
                </div>
              )}
            </div>
          </LayoutGroup>

          <div
            role="tabpanel"
            id={`panel-${item.id}`}
            aria-labelledby={`tab-${item.id}`}
            className="relative grid gap-8 lg:col-span-7 lg:grid-cols-7"
          >
            <div ref={frame} className="relative aspect-[4/5] overflow-hidden bg-ink lg:col-span-4 stage:aspect-auto stage:h-[min(60vh,38rem)]">
              <AnimatePresence mode="popLayout">
                {seen && (
                  <motion.div
                    key={item.id}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)", y: "10%" }}
                    animate={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0% 0% 0%)", y: "0%" }}
                    exit={reduce ? { opacity: 0 } : { y: "-14%", opacity: 0, filter: "brightness(0.4)" }}
                    transition={{ duration: 1.1, ease: easeCinema }}
                  >
                    <motion.div
                      className="absolute -inset-[6%]"
                      initial={{ scale: reduce ? 1 : 1.3 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.6, ease: easeCinema }}
                    >
                      {/* Slow drift while the visitor scrolls through this item's stretch */}
                      <motion.div className="absolute inset-0" style={pinned ? { y: drift } : undefined}>
                        <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -end-10 size-40 text-sand/70 mix-blend-overlay"
                animate={{ rotate: active * 45 }}
                transition={{ duration: 1.4, ease: easeCinema }}
              >
                <Symbol className="size-full" />
              </motion.div>
            </div>

            <div className="flex flex-col justify-end lg:col-span-3">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                  transition={{ duration: 0.55, ease: easeArch }}
                >
                  <p aria-hidden data-n={String(active + 1).padStart(2, "0")} className="display mb-6 text-[clamp(4rem,8vw,7rem)] leading-none text-sand/25 tabular-nums before:content-[attr(data-n)]" />
                  <h3 className="display mb-5 text-3xl">{item.title}</h3>
                  <p className="mb-8 leading-relaxed text-bone/75">{item.summary}</p>
                  <Points points={item.points} reduce={!!reduce} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Points({ points, reduce }: { points: Item["points"]; reduce: boolean }) {
  return (
    <ul className="space-y-3">
      {points.map((pt, i) => (
        <motion.li
          key={pt}
          initial={{ opacity: 0, x: reduce ? 0 : -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: easeArch }}
          className="flex items-center gap-4 border-b border-bone/10 pb-3 text-sm text-bone/85"
        >
          <span aria-hidden className="block size-1.5 rotate-45 bg-sand" />
          {pt}
        </motion.li>
      ))}
    </ul>
  );
}

/** Stacked layout: each item settles in calmly once, the image clearing from a soft blur. */
function StackedItem({ item, n, reduce }: { item: Item; n: number; reduce: boolean }) {
  const calm = (delay: number) =>
    reduce
      ? { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.4 } } }
      : {
          hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
          shown: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.4, delay, ease: easeArch } },
        };

  return (
    <motion.li
      className="grid gap-6 border-t border-bone/15 pt-6 md:grid-cols-2 md:gap-10"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div className="relative aspect-[4/5] overflow-hidden" variants={calm(0)}>
        <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
      </motion.div>
      <motion.div className="flex flex-col justify-end" variants={calm(0.25)}>
        <span className="mb-4 font-sans text-xs tabular-nums tracking-widest text-sand">{String(n).padStart(2, "0")}</span>
        <h3 className="display mb-4 text-3xl">{item.title}</h3>
        <p className="mb-6 leading-relaxed text-bone/75">{item.summary}</p>
        <Points points={item.points} reduce={reduce} />
      </motion.div>
    </motion.li>
  );
}
