import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { DrawLine, Reveal, RevealText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { DriftSymbol } from "@/components/brand/DriftSymbol";

export function Investment({ t }: { t: Dictionary }) {
  const v = t.investment;

  return (
    <section id="investment" aria-labelledby="investment-title" className="cv-auto [--cv-h:1600px] relative isolate overflow-x-clip bg-bone py-[var(--spacing-section)]">
      <DriftSymbol className="-end-[18vw] bottom-[4%] size-[min(90vw,52rem)] text-olive/[0.06]" />
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            <p className="eyebrow mb-6 text-olive">
              <span className="me-3 tabular-nums">05</span>
              {v.eyebrow}
            </p>
            <RevealText
              id="investment-title"
              as="h2"
              lines={v.title.split(/(?<=\.)\s/)}
              className="display text-[length:var(--text-headline)] text-charcoal"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-[length:var(--text-lede)] leading-relaxed text-olive">{v.lede}</p>
            </Reveal>
            <Parallax
              className="relative mt-12 hidden aspect-[4/3] overflow-hidden lg:block"
              innerClassName="absolute inset-[-10%_0]"
              y={["-10%", "10%"]}
            >
              <Image src="/images/glass-symbol.jpg" alt="" fill sizes="40vw" className="object-cover" />
            </Parallax>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol>
            {v.themes.map((theme, i) => (
              <li key={theme.title} className="py-10 first:pt-0">
                <DrawLine className="mb-10 text-charcoal" />
                <Reveal>
                  <div className="grid grid-cols-[3.5rem_1fr] gap-x-6 gap-y-4">
                    <span className="pt-2 font-sans text-xs tabular-nums tracking-widest text-olive">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display text-[clamp(1.6rem,2.6vw,2.4rem)] text-charcoal">{theme.title}</h3>
                    <p className="col-start-2 max-w-lg leading-relaxed text-olive">{theme.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mt-10 border-s-2 border-taupe/50 ps-5 text-sm leading-relaxed text-olive">{v.disclaimer}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
