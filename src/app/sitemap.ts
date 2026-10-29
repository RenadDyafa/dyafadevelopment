import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/lib/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` } },
  }));
}
