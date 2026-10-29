import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Reveal, RevealMask, RevealText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { DriftSymbol } from "@/components/brand/DriftSymbol";

export function About({ t }: { t: Dictionary }) {
  const a = t.about;
  const altIsArabic = /\p{Script=Arabic}/u.test(a.titleAlt);

  return (
    <section id="about" aria-labelledby="about-title" className="cv-auto [--cv-h:2700px] relative isolate overflow-x-clip bg-bone pt-[var(--spacing-section)]">
      <DriftSymbol className="-start-[14vw] -top-[6%] size-[min(80vw,46rem)] text-olive/[0.07]" rotate={[24, -24]} />
      <div className="shell grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-3">
          <p className="eyebrow text-olive">
            <span className="me-3 inline-block tabular-nums">01</span>
            {a.eyebrow}
          </p>
        </div>
        <div className="lg:col-span-9">
          <RevealText
            id="about-title"
            as="h2"
            lines={a.title.split(/(?<=\.|،)\s/)}
            className="display text-[length:var(--text-display)] text-charcoal"
          />
          <Reveal delay={0.25}>
            <p lang={altIsArabic ? "ar" : "en"} dir={altIsArabic ? "rtl" : "ltr"} className="mt-8 text-xl text-olive md:text-2xl">
              {a.titleAlt}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed image with an architectural mask that opens on entry */}
      <RevealMask className="relative mt-[clamp(4rem,9vw,8rem)] h-[78vh] min-h-[420px] overflow-hidden">
        <Parallax className="absolute inset-0" innerClassName="absolute inset-[-12%_0]" y={["-12%", "12%"]}>
          <Image src="/images/angled-planes.jpg" alt={a.imageAlt} fill sizes="100vw" className="object-cover" />
        </Parallax>
      </RevealMask>

      <div className="shell grid gap-y-16 py-[var(--spacing-section)] lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5 lg:col-start-4">
          <Reveal>
            <p className="text-[length:var(--text-lede)] leading-relaxed text-charcoal">{a.lede}</p>
          </Reveal>
          {a.body.map((para, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <p className="mt-6 leading-relaxed text-olive">{para}</p>
            </Reveal>
          ))}
        </div>
      </div>

    </section>
  );
}
