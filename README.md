# Dyafa Real Estate Development & Investment — website

Bilingual (EN/AR, full RTL) cinematic site. Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis · Three.js / React Three Fiber / Drei.

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en or /ar
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` to have enquiries emailed. Without them, enquiries are validated and logged on the server only.

## Where things live

| Area | Path |
| --- | --- |
| All copy (EN / AR) | `src/lib/i18n/dictionaries/en.ts`, `ar.ts` |
| Official logo vectors (extracted from the 2026 identity PDF) | `src/lib/brand/paths.ts`, `public/brand/*.svg` |
| Design tokens | `src/app/globals.css` (`@theme`) |
| 3D hero scene | `src/components/three/ArchitectureScene.tsx` |
| Camera path shared by the scene and the image mask | `src/lib/hero/camera.ts` |
| Sections | `src/components/sections/*` |
| Contact API (validation, honeypot, timing check, rate limit) | `src/app/api/contact/route.ts`, `src/lib/contact/schema.ts` |

## Content still pending approval

Each item below is shown on the site as a visibly labelled placeholder or "pending" tag.

- **Projects.** No approved projects yet, so all three slots in Selected Developments are placeholders over brand concept imagery.
- **Project photography.** The photos come from the brand identity book. The book's stone-building render carries a third-party copyright mark ("Core-db.co 2024"), so it is not used.
- **Contact details.** No approved phone, email or address. The address and phone on the last page of the brand book belong to the design agency, not Dyafa.
- **Expertise areas, Our Approach narrative, ecosystem structure and Arabic company names.** All are marked "subject to confirmation".
- **Legal wording.** The PDPL consent text, privacy policy and terms are not yet written.
- **Production domain.** Needed for `NEXT_PUBLIC_SITE_URL`.
- **English typefaces.** The brand book uses licensed fonts (RB, Owners Wide). The site substitutes Archivo (wide) and IBM Plex Sans. Arabic uses the official IBM Plex Sans Arabic.
