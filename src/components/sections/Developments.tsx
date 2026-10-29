import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { RevealMask, RevealText } from "@/components/motion/Reveal";
import { DevelopmentsTrack } from "@/components/sections/DevelopmentsTrack";

/**
 * Editorial portfolio. Until projects are approved, every slot renders as a
 * clearly-labelled placeholder over brand concept imagery — nothing is invented.
 * All content is server-rendered; only the horizontal track is a client island.
 */
export function Developments({ t }: { t: Dictionary }) {
  const d = t.developments;

  return (
    <DevelopmentsTrack count={d.slots.length} labels={{ prev: t.a11y.prev, next: t.a11y.next }}>
      <div className="flex w-full shrink-0 flex-col justify-between gap-10 pin:w-[min(42rem,46vw)] pin:pe-[6vw]">
        <div>
          <p className="eyebrow mb-6 text-olive-deep">
            <span className="me-3 tabular-nums">03</span>
            {d.eyebrow}
          </p>
          <RevealText
            id="developments-title"
            as="h2"
            lines={d.title.split(/(?<=\s)(?=\S+\.$)/)}
            className="display text-[clamp(2.5rem,5vw,5.5rem)] text-charcoal"
          />
        </div>
        <p className="max-w-md leading-relaxed text-olive-deep">{d.intro}</p>
      </div>

      {d.slots.map((slot, i) => (
        <article
          key={i}
          aria-label={`${String(i + 1).padStart(2, "0")} — ${d.pending}`}
          className="grid w-full shrink-0 gap-6 md:grid-cols-5 md:gap-10 pin:h-full pin:w-[min(64rem,72vw)]"
        >
          <RevealMask className="relative aspect-[4/5] overflow-hidden bg-charcoal md:col-span-3 pin:aspect-auto pin:h-full">
            <Image src={slot.image} alt="" fill sizes="(min-width: 900px) 44vw, 100vw" className="object-cover opacity-80 grayscale-[35%]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(25,24,26,0.7),rgba(25,24,26,0)_50%)]" />
            <p className="placeholder-tag absolute start-5 top-5 bg-charcoal/50 text-bone backdrop-blur-sm">{d.conceptLabel}</p>
            <p aria-hidden className="display absolute bottom-4 start-5 text-[clamp(4rem,9vw,8rem)] leading-none text-bone/90 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </p>
          </RevealMask>

          <div className="flex flex-col justify-end gap-8 md:col-span-2 md:pb-2">
            <p className="placeholder-tag self-start text-olive-deep">{d.pending}</p>
            <h3 className="display text-[clamp(1.8rem,2.6vw,2.6rem)] text-charcoal">{d.placeholder.name}</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-charcoal/15 pt-6 text-sm">
              {(
                [
                  [d.fields.location, d.placeholder.location],
                  [d.fields.category, d.placeholder.category],
                  [d.fields.role, d.placeholder.role],
                  [d.fields.status, d.placeholder.status],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow mb-1 text-[0.62rem] text-olive-deep">{k}</dt>
                  <dd className="text-olive-deep">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="leading-relaxed text-olive-deep">{d.placeholder.overview}</p>
          </div>
        </article>
      ))}
    </DevelopmentsTrack>
  );
}
