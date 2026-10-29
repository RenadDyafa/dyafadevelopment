import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { RevealText } from "@/components/motion/Reveal";
import { Pattern } from "@/components/brand/Pattern";
import { WhyList } from "@/components/sections/WhyList";
import { DriftSymbol } from "@/components/brand/DriftSymbol";

export function WhyDyafa({ t }: { t: Dictionary }) {
  const w = t.why;

  return (
    <section aria-labelledby="why-title" className="cv-auto [--cv-h:1550px] relative isolate overflow-hidden bg-sand text-charcoal">
      <DriftSymbol className="-start-[16vw] bottom-[-8%] size-[min(75vw,40rem)] text-olive/[0.1]" rotate={[-20, 40]} />
      <Pattern className="absolute -end-[10%] top-0 h-full w-1/2 text-olive/[0.08] [mask-image:linear-gradient(90deg,transparent,black)]" size={240} />
      <div className="shell relative py-[var(--spacing-section)]">
        <p className="eyebrow mb-6 text-olive-deep">
          <span className="me-3 tabular-nums">06</span>
          {w.eyebrow}
        </p>
        <RevealText id="why-title" as="h2" lines={[w.title]} className="display mb-16 text-[length:var(--text-display)]" />
        <WhyList items={w.items} />
      </div>
    </section>
  );
}
