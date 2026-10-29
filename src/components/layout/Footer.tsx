import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { Lockup } from "@/components/brand/Lockup";
import { Pattern } from "@/components/brand/Pattern";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { DriftSymbol } from "@/components/brand/DriftSymbol";

export function Footer({ t }: { t: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="cv-auto [--cv-h:320px] relative isolate overflow-hidden bg-ink text-bone/70">
      <DriftSymbol className="-end-[8vw] -top-[40%] size-[min(60vw,30rem)] text-sand/[0.06]" rotate={[-40, 0]} y={["0%", "0%"]} />
      <Pattern className="absolute inset-x-0 top-0 h-24 text-bone/[0.04]" size={160} />
      <div className="shell relative flex flex-col gap-12 pb-10 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-10">
          <Lockup title={t.brand.full} className="h-14 w-auto text-sand md:h-16" />
          <ScrollLink href="#home" className="eyebrow -my-3 inline-flex min-h-11 items-center text-[0.65rem] text-bone/60 transition-colors hover:text-bone">
            {t.footer.top} ↑
          </ScrollLink>
        </div>
        <div className="hairline text-bone" />
        <div className="flex flex-wrap justify-between gap-4 text-xs">
          <p>
            © {year} {t.brand.legal}. {t.footer.rights}
          </p>
          <p>{t.footer.part}</p>
        </div>
      </div>
    </footer>
  );
}
