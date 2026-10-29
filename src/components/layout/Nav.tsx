"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { otherLocale } from "@/lib/i18n/config";
import { Lockup } from "@/components/brand/Lockup";
import { useScrollTo } from "@/components/motion/SmoothScroll";
import { easeArch } from "@/components/motion/Reveal";
import { introDelay } from "@/components/sections/Loader";

type Tone = "clear" | "veiled" | "solid";

export function Nav({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [tone, setTone] = useState<Tone>("clear");
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const links = [
    ["#home", t.nav.home],
    ["#about", t.nav.about],
    ["#expertise", t.nav.expertise],
    ["#developments", t.nav.developments],
    ["#investment", t.nav.investment],
    ["#approach", t.nav.approach],
    ["#contact", t.nav.contact],
  ] as const;

  // Cache the hero's height so scrolling never forces a layout read.
  const heroEnd = useRef(0);
  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const ro = new ResizeObserver(([entry]) => {
      heroEnd.current = entry.contentRect.height - 80;
    });
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setTone(y < 40 ? "clear" : y < (heroEnd.current || window.innerHeight) ? "veiled" : "solid");
    if (!open) setHidden(y > lastY.current && y > 400);
    lastY.current = y;
  });

  // Mobile menu: stop scrolling, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && menuRef.current) {
        const items = [...menuRef.current.querySelectorAll<HTMLElement>("a,button")];
        const [a, z] = [items[0], items[items.length - 1]];
        if (e.shiftKey && document.activeElement === a) (e.preventDefault(), z.focus());
        else if (!e.shiftKey && document.activeElement === z) (e.preventDefault(), a.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      toggleRef.current?.focus();
    };
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    // Wait a frame so Lenis is running again before scrolling.
    requestAnimationFrame(() => scrollTo(href));
  };

  const other = otherLocale(locale);
  const setLocaleCookie = () => {
    document.cookie = `NEXT_LOCALE=${other}; path=/; max-age=31536000; samesite=lax`;
  };

  const solid = tone === "solid" && !open;
  const bar =
    tone === "clear" || open
      ? "bg-transparent text-bone"
      : tone === "veiled"
        ? "bg-charcoal/55 text-bone backdrop-blur-md"
        : "bg-bone/90 text-charcoal backdrop-blur-md shadow-[0_1px_0_rgba(35,34,36,0.08)]";

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeArch, delay: lastY.current === 0 ? introDelay(0.6) : 0 }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${bar}`}
      >
        <nav aria-label="Primary" className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a
            href="#home"
            aria-label={t.a11y.home}
            onClick={(e) => (e.preventDefault(), go("#home"))}
            className="shrink-0"
          >
            <Lockup title={t.brand.full} className={`h-9 w-auto md:h-10 ${solid ? "text-charcoal" : "text-sand"}`} />
          </a>

          <ul className="hidden items-center gap-7 xl:flex">
            {links.slice(1).map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => (e.preventDefault(), go(href))}
                  className="group relative -mx-2 px-2 py-2 text-[0.82rem] tracking-wide opacity-80 transition-opacity hover:opacity-100"
                >
                  {label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-[var(--line-origin)] scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-arch)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`/${other}`}
              hrefLang={other}
              lang={other}
              onClick={setLocaleCookie}
              aria-label={t.a11y.switchLanguage}
              className={`h-10 px-4 text-sm leading-10 transition-colors ${other === "ar" ? "font-[family-name:var(--font-arabic)]" : "font-sans"} border border-current/25 hover:border-current`}
            >
              {t.nav.language}
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.menuClose : t.a11y.menuOpen}
              className="relative flex size-10 flex-col items-center justify-center gap-[7px] xl:hidden"
            >
              <motion.span animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }} className="block h-px w-6 bg-current" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.a11y.menuOpen}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-charcoal px-[var(--spacing-gutter)] pb-10 pt-[calc(var(--nav-h)+2rem)] text-bone xl:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {links.map(([href, label], i) => (
                <li key={href} className="overflow-hidden">
                  <motion.a
                    href={href}
                    onClick={(e) => (e.preventDefault(), go(href))}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.05, ease: easeArch }}
                    className="display flex items-baseline gap-4 py-1 text-[clamp(2.2rem,9vw,4rem)]"
                  >
                    <span className="font-sans text-xs tracking-widest text-sand/60">{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="eyebrow text-sand/70">
              {t.brand.full}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
