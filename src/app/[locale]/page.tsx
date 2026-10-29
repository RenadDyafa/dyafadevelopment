import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/sections/Loader";
import { HeroSequence } from "@/components/sections/HeroSequence";
import { About } from "@/components/sections/About";
import { BrandFilm } from "@/components/sections/BrandFilm";
import { Expertise } from "@/components/sections/Expertise";
import { Developments } from "@/components/sections/Developments";
import { Approach } from "@/components/sections/Approach";
import { Investment } from "@/components/sections/Investment";
import { WhyDyafa } from "@/components/sections/WhyDyafa";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Contact } from "@/components/sections/Contact";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  return (
    <>
      <Loader label={t.brand.full} />
      <Nav t={t} locale={locale as Locale} />
      <main id="main">
        <HeroSequence t={t} />
        <About t={t} />
        <BrandFilm t={t} />
        <Expertise t={t} />
        <Developments t={t} />
        <Approach t={t} />
        <Investment t={t} />
        <WhyDyafa t={t} />
        <Ecosystem t={t} />
        <Contact t={t} locale={locale as Locale} />
      </main>
      <Footer t={t} />
    </>
  );
}
