import { Fragment, type CSSProperties } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Symbol } from "@/components/brand/Symbol";
import { RevealText } from "@/components/motion/Reveal";
import { DriftSymbol } from "@/components/brand/DriftSymbol";

const delay = (s: number) => ({ "--d": `${Math.round(s * 1000)}ms` }) as CSSProperties;

/** The development company at the centre, the wider group around it. */
export function Ecosystem({ t }: { t: Dictionary }) {
  const e = t.ecosystem;
  const n = e.companies.length;

  return (
    <section aria-labelledby="ecosystem-title" className="cv-auto [--cv-h:1450px] relative isolate overflow-hidden bg-ink py-[var(--spacing-section)] text-bone">
      <DriftSymbol className="-start-[20vw] top-[8%] size-[min(85vw,48rem)] text-sand/[0.06]" rotate={[30, -30]} />
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-6 text-sand">
              <span className="me-3 tabular-nums">07</span>
              {e.eyebrow}
            </p>
            <RevealText id="ecosystem-title" as="h2" lines={[e.title]} className="display max-w-4xl text-[length:var(--text-headline)]" />
          </div>
          <p className="placeholder-tag text-sand">{e.note}</p>
        </div>

        {/* The equation */}
        <p className="mt-14 flex flex-wrap items-baseline gap-x-5 gap-y-3 text-[clamp(1.2rem,2.2vw,2rem)]">
          {e.pillars.map((p, i) => (
            <Fragment key={p}>
              {i > 0 && (
                <span aria-hidden className="text-sand/50">
                  +
                </span>
              )}
              <span className="inline-block" data-reveal="" style={delay(i * 0.12)}>
                {p}
              </span>
            </Fragment>
          ))}
        </p>

        {/* Orbit diagram (md+) */}
        <div className="relative mx-auto mt-20 hidden aspect-square w-full max-w-[44rem] md:block">
          <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 size-full text-bone/15" fill="none" stroke="currentColor" strokeWidth="0.15">
            <circle cx="50" cy="50" r="38" pathLength={1} data-reveal="draw" />
            <circle cx="50" cy="50" r="24" strokeDasharray="0.6 1.2" />
            {e.companies.map((_, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2;
              return <line key={i} x1={50 + Math.cos(a) * 14} y1={50 + Math.sin(a) * 14} x2={50 + Math.cos(a) * 38} y2={50 + Math.sin(a) * 38} />;
            })}
          </svg>

          <div className="absolute inset-[36%] flex flex-col items-center justify-center text-center">
            <Symbol className="mb-3 size-[45%] text-sand" assemble />
            <p className="text-xs leading-snug text-sand">{e.self}</p>
          </div>

          {e.companies.map((c, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <div
                key={c.name}
                className="absolute w-44 -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ left: `${50 + Math.cos(a) * 38}%`, top: `${50 + Math.sin(a) * 38}%` }}
              >
                <div data-reveal="" style={delay(0.6 + i * 0.12)}>
                  <span aria-hidden className="mx-auto mb-3 block size-2.5 rotate-45 bg-sand" />
                  <p className="font-medium">{c.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-bone/60">{c.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* List (mobile) */}
        <ul className="mt-14 divide-y divide-bone/10 border-y border-bone/10 md:hidden">
          {e.companies.map((c) => (
            <li key={c.name} className="flex flex-col gap-1 py-5">
              <span className="font-medium">{c.name}</span>
              <span className="text-sm text-bone/60">{c.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
