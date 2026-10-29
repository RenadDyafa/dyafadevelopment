import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Sans, Reem_Kufi } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";
import { dirOf, isLocale, locales, siteUrl, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { RevealObserver } from "@/components/motion/RevealObserver";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
// Body text: not preloaded so it never competes with the hero wordmark (the LCP element).
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex", display: "swap", preload: false });
const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-reem-kufi",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#232224",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: `%s — ${t.meta.title}` },
    description: t.meta.description,
    applicationName: t.brand.full,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: t.brand.full,
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t.brand.full,
    alternateName: locale === "ar" ? "Dyafa Real Estate Development & Investment" : "ضيافة للتطوير والاستثمار العقاري",
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/symbol.svg`,
    description: t.meta.description,
  };

  return (
    <html
      lang={locale}
      dir={dirOf(locale as Locale)}
      className={`${archivo.variable} ${plex.variable} ${reemKufi.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables reveal hidden-states only when JS runs, before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed start-4 top-4 z-[200] -translate-y-24 bg-bone px-4 py-3 text-sm text-charcoal transition-transform focus:translate-y-0"
        >
          {t.a11y.skip}
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <RevealObserver />
      </body>
    </html>
  );
}
