"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { apertureRadiusVh } from "@/lib/hero/camera";
import { detectQuality, supportsWebGL, type Quality } from "@/lib/hero/webgl";
import { Cta } from "@/components/ui/Cta";
import { easeArch } from "@/components/motion/Reveal";
import { introDelay } from "@/components/sections/Loader";

const ArchitectureScene = dynamic(() => import("@/components/three/ArchitectureScene"), { ssr: false });

type Mode = "pending" | "cinematic" | "static";

export function HeroSequence({ t }: { t: Dictionary }) {
  const reduce = useReducedMotion();
  const container = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<Quality>("low");
  const [active, setActive] = useState(true);
  const [mounted3d, setMounted3d] = useState(false);

  useEffect(() => {
    const cinematic = !reduce && supportsWebGL();
    setQuality(detectQuality());
    setMode(cinematic ? "cinematic" : "static");
    if (!cinematic) window.dispatchEvent(new Event("dyafa:scene-ready"));
  }, [reduce]);

  // The section height depends on mode/quality; make Motion re-measure the scroll range.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, [mode, quality]);

  // Keep three.js off the critical path: the poster (the scene's exact first frame)
  // shows until the visitor first moves, touches, scrolls or types.
  useEffect(() => {
    if (mode !== "cinematic") return;
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      setMounted3d(true);
    };
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [mode]);

  // Render the WebGL scene only while the hero is on screen.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: container, offset: ["start start", "end end"] });
  const cinematic = mode === "cinematic";

  return (
    <section
      id="home"
      ref={container}
      aria-label={t.brand.full}
      className="relative bg-charcoal text-bone"
      // Reserve the cinematic height from the first paint so the scroll range never jumps.
      style={{ height: mode === "static" ? "100svh" : quality === "high" ? "460vh" : "380vh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Poster: a captured first frame of the scene, shown until WebGL takes over. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,#1b1a1c 0%,#3d3a35 52%,#9c8b72 78%,#6f6657 100%)" }}
        />
        {mode !== "static" && (
          <Image
            src="/images/hero-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[46%_50%]"
          />
        )}

        {cinematic && mounted3d ? (
          <div className="absolute inset-0 animate-[fade-in_1s_ease-out]">
            <ArchitectureScene
              progress={scrollYProgress}
              quality={quality}
              active={active}
              still={!!reduce}
              onReady={() => window.dispatchEvent(new Event("dyafa:scene-ready"))}
            />
          </div>
        ) : mode === "static" ? (
          <Image
            src="/images/monolith-ring.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
        ) : null}

        {/* Legibility veil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(25,24,26,0.8)_0%,rgba(25,24,26,0.35)_30%,rgba(25,24,26,0)_55%,rgba(25,24,26,0)_85%,rgba(25,24,26,0.3)_100%)]"
        />
        {/* A soft pool of shade under the words only, so the stone above keeps its light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_42%_at_50%_80%,rgba(25,24,26,0.5)_0%,rgba(25,24,26,0)_100%)]"
        />

        {cinematic && <Aperture progress={scrollYProgress} />}

        <HeroIntro t={t} progress={scrollYProgress} cinematic={cinematic} reduce={!!reduce} />
        {cinematic && <Statements t={t} progress={scrollYProgress} />}
        {cinematic && <RevealCaption t={t} progress={scrollYProgress} />}
      </div>
    </section>
  );
}

/* Signature transition: the ring's opening becomes an image mask. */
function Aperture({ progress }: { progress: MotionValue<number> }) {
  const radius = useTransform(progress, (p) => Math.min(apertureRadiusVh(p), 170));
  const clip = useMotionTemplate`circle(${radius}vh at 50% 50%)`;
  const opacity = useTransform(progress, [0.72, 0.79], [0, 1]);
  const scale = useTransform(progress, [0.74, 1], [1.22, 1]);
  return (
    <motion.div aria-hidden className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip, opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image src="/images/monolith-ring.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_32%]" />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(25,24,26,0.75),rgba(25,24,26,0)_55%)]" />
    </motion.div>
  );
}

function HeroIntro({
  t,
  progress,
  cinematic,
  reduce,
}: {
  t: Dictionary;
  progress: MotionValue<number>;
  cinematic: boolean;
  reduce: boolean;
}) {
  const opacity = useTransform(progress, [0, 0.09], [1, 0]);
  const y = useTransform(progress, [0, 0.1], [0, -60]);
  const d = reduce ? 0 : introDelay();
  // Headline and body are painted from the server render (they are LCP candidates on
  // phones) and only settle into place; smaller details fade in as well.
  const rise = (delay: number, fade = true) => ({
    initial: { opacity: fade ? 0 : 1, y: reduce ? 0 : 36 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.3 : 1.2, delay: d + delay, ease: easeArch },
  });

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-end pb-[max(2.5rem,6vh)] pt-[var(--nav-h)] squat:pb-6 [text-shadow:0_2px_24px_rgba(10,10,10,0.55)]"
      style={cinematic ? { opacity, y } : undefined}
    >
      <div className="shell grid items-end gap-10 squat:gap-4 flat:grid-cols-12 flat:gap-6 lg:grid-cols-12">
        <div className="flat:col-span-6 lg:col-span-7">
          <motion.p {...rise(0.1)} className="eyebrow mb-6 font-medium text-bone/85 squat:mb-3">
            {t.hero.eyebrow}
          </motion.p>
          <h1 className="sr-only">
            {t.brand.full} — {t.hero.title}
          </h1>
          <div aria-hidden className="overflow-hidden">
            <motion.div
              initial={{ y: reduce ? 0 : "22%" }}
              animate={{ y: "0%" }}
              transition={{ duration: reduce ? 0.3 : 1.6, delay: d, ease: easeArch }}
              className="display text-[min(clamp(4.5rem,12.5vw,13.5rem),24svh)] font-medium! leading-[0.8] text-bone rtl:leading-[1.15]"
            >
              {t.hero.wordmark}
            </motion.div>
          </div>
        </div>
        <div className="flat:col-span-6 lg:col-span-5 lg:pb-4">
          <motion.p {...rise(0.35, false)} className="display mb-5 text-[length:var(--text-headline)] font-medium! text-bone squat:mb-3 flat:text-[1.6rem]">
            {t.hero.title}
          </motion.p>
          <motion.p {...rise(0.5, false)} className="mb-9 max-w-md text-[length:var(--text-lede)] leading-relaxed text-bone squat:mb-5 squat:text-base squat:leading-normal flat:hidden">
            {t.hero.body}
          </motion.p>
          <motion.div {...rise(0.65)} className="flex flex-wrap items-center gap-3">
            <Cta href="#developments">{t.hero.primary}</Cta>
            <Cta href="#about" variant="ghost-light">
              {t.hero.secondary}
            </Cta>
          </motion.div>
        </div>
      </div>
      <motion.div
        {...rise(1)}
        aria-hidden
        className="pointer-events-none absolute bottom-[calc(50%-3rem)] end-[calc(var(--spacing-gutter)/2)] hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="eyebrow text-[0.6rem] text-bone/60 [writing-mode:vertical-rl]">{t.hero.scroll}</span>
        <span className="relative block h-12 w-px overflow-hidden bg-bone/20">
          <span className="scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-bone" />
        </span>
      </motion.div>
    </motion.div>
  );
}

function Statement({ text, progress, range }: { text: string; progress: MotionValue<number>; range: [number, number] }) {
  const [a, b] = range;
  const opacity = useTransform(progress, [a, a + 0.035, b - 0.035, b], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b], [40, -40]);
  const blur = useTransform(progress, [a, a + 0.035, b - 0.035, b], [8, 0, 0, 8]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.p
      style={{ opacity, y, filter }}
      className="display absolute inset-x-0 text-center text-[length:var(--text-display)] text-bone"
    >
      {text}
    </motion.p>
  );
}

function Statements({ t, progress }: { t: Dictionary; progress: MotionValue<number> }) {
  const geoOpacity = useTransform(progress, [0.4, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
  const geoY = useTransform(progress, [0.4, 0.65], [30, -30]);
  const [s1, s2, s3] = t.hero.statements;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <Statement text={s1} progress={progress} range={[0.12, 0.2]} />
      <Statement text={s2} progress={progress} range={[0.2, 0.28]} />
      <Statement text={s3} progress={progress} range={[0.28, 0.37]} />
      <motion.div style={{ opacity: geoOpacity, y: geoY }} className="absolute bottom-[14vh] inset-x-0 shell">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <span className="h-10 w-px bg-sand/60" />
          <p className="text-[length:var(--text-lede)] leading-relaxed text-bone/85">{t.hero.geometry}</p>
        </div>
      </motion.div>
    </div>
  );
}

function RevealCaption({ t, progress }: { t: Dictionary; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.86, 0.93], [0, 1]);
  const y = useTransform(progress, [0.86, 1], [40, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 pb-[8vh]">
      <div className="shell">
        <p className="placeholder-tag mb-6 text-sand">{t.hero.revealLabel}</p>
        <p className="display max-w-4xl text-[length:var(--text-display)] text-bone">{t.hero.revealTitle}</p>
      </div>
    </motion.div>
  );
}
