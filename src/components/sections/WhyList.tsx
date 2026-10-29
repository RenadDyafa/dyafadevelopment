"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { easeArch } from "@/components/motion/Reveal";

/** Large typographic index; each line opens to its reasoning on hover or focus. */
export function WhyList({ items }: { items: Dictionary["why"]["items"] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="border-t border-charcoal/20" onMouseLeave={() => setOpen(null)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li
            key={item.title}
            className="border-b border-charcoal/20"
            data-reveal=""
            style={{ "--d": `${i * 50}ms` } as CSSProperties}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(isOpen ? null : i)}
              className="grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-6 py-6 text-start md:grid-cols-[4rem_1fr_1fr] md:py-8"
            >
              <span className="font-sans text-xs tabular-nums tracking-widest text-olive-deep">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={`display text-[clamp(1.75rem,4.2vw,4rem)] transition-[color,transform] duration-500 ease-[var(--ease-arch)] ${isOpen ? "translate-x-[calc(var(--dir)*0.75rem)] text-charcoal" : "text-charcoal/60"}`}
              >
                {item.title}
              </span>
              <motion.span
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
                transition={{ duration: 0.45, ease: easeArch }}
                className="col-start-2 overflow-hidden text-olive-deep md:col-start-3 md:!h-auto md:self-center"
              >
                <span className="block max-w-sm pt-3 leading-relaxed md:pt-0">{item.body}</span>
              </motion.span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
