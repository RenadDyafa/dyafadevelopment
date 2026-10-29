import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Symbol } from "@/components/brand/Symbol";
import { ContactForm } from "@/components/sections/ContactForm";

export function Contact({ t, locale }: { t: Dictionary; locale: Locale }) {
  const c = t.contact;

  return (
    <section id="contact" aria-labelledby="contact-title" className="cv-auto [--cv-h:1100px] relative isolate overflow-hidden bg-charcoal text-bone">
      <Parallax className="absolute inset-0 -z-10" innerClassName="absolute inset-0" scale={[1.18, 1]}>
        <Image src="/images/monolith-ring.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_30%] opacity-55" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(25,24,26,0.95)_0%,rgba(25,24,26,0.7)_55%,rgba(25,24,26,0.5)_100%)] rtl:bg-[linear-gradient(270deg,rgba(25,24,26,0.95)_0%,rgba(25,24,26,0.7)_55%,rgba(25,24,26,0.5)_100%)]" />
      <Parallax className="absolute -end-[12vw] top-[10%] -z-10 size-[min(70vw,42rem)] text-sand/10" innerClassName="size-full" rotate={[-30, 30]}>
        <Symbol className="size-full" />
      </Parallax>

      <div className="shell grid gap-16 py-[var(--spacing-section)] lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 text-sand">
            <span className="me-3 tabular-nums">08</span>
            {c.eyebrow}
          </p>
          <RevealText id="contact-title" as="h2" lines={c.title.split(/(?<=،)\s/)} className="display text-[length:var(--text-display)]" />
          <Reveal delay={0.2}>
            <p lang={locale === "ar" ? "en" : "ar"} dir={locale === "ar" ? "ltr" : "rtl"} className="mt-6 text-xl text-sand md:text-2xl">
              {c.titleAlt}
            </p>
            <p className="mt-10 max-w-md text-[length:var(--text-lede)] leading-relaxed text-bone/75">{c.lede}</p>
            <p className="placeholder-tag mt-10 text-sand">{c.detailsPending}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <ContactForm c={c} locale={locale} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
