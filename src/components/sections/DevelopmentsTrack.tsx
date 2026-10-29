"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const PIN = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

/**
 * Pins the (server-rendered) portfolio and translates it horizontally with scroll.
 * Layout is decided by CSS (`pin:` variant), so nothing remounts after hydration;
 * below the breakpoint or with reduced motion it is a plain vertical stack.
 */
export function DevelopmentsTrack({
  count,
  labels,
  children,
}: {
  count: number;
  labels: { prev: string; next: string };
  children: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [rtl, setRtl] = useState(false);
  const [index, setIndex] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
    const mq = window.matchMedia(PIN);
    const measure = () => {
      setRtl(document.documentElement.dir === "rtl");
      setShift(mq.matches && track.current ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    mq.addEventListener("change", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, rtl ? shift : -shift]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (shift) setIndex(Math.min(count - 1, Math.max(0, Math.round(p * (count + 0.5) - 0.75))));
  });

  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const target = top + travel * ((i + 1) / (count + 0.5));
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target });
  };

  return (
    <section
      id="developments"
      ref={section}
      aria-labelledby="developments-title"
      className="cv-auto [--cv-h:3200px] relative bg-mist py-[var(--spacing-section)] pin:h-[var(--pin-h)] pin:py-0"
      style={{ "--pin-h": `${(count + 1) * 85 + 100}vh` } as CSSProperties}
    >
      <div className="pin:sticky pin:top-0 pin:flex pin:h-[100svh] pin:flex-col pin:overflow-hidden pin:pb-[6vh] pin:pt-[calc(var(--nav-h)+3vh)]">
        <motion.div
          ref={track}
          style={{ x: shift ? x : 0 }}
          className="shell flex flex-col gap-24 pin:m-0 pin:min-h-0 pin:max-w-none pin:flex-1 pin:flex-row pin:gap-[6vw]"
        >
          {children}
          <div aria-hidden className="hidden w-[var(--spacing-gutter)] shrink-0 pin:block" />
        </motion.div>

        <div className="shell mt-[4vh] hidden items-center gap-6 pin:flex">
          <span className="font-sans text-xs tabular-nums tracking-widest text-olive-deep">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <div className="relative h-px flex-1 bg-charcoal/15">
            <motion.div className="absolute inset-0 bg-charcoal" style={{ scaleX: scrollYProgress, transformOrigin: "var(--line-origin)" }} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(Math.max(0, index - 1))}
              aria-label={labels.prev}
              className="flex size-11 items-center justify-center border border-charcoal/20 transition-colors hover:border-charcoal"
            >
              <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M7 1L3 5l4 4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(count - 1, index + 1))}
              aria-label={labels.next}
              className="flex size-11 items-center justify-center border border-charcoal/20 transition-colors hover:border-charcoal"
            >
              <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3 1l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
