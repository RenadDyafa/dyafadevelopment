import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import { CinemaStage } from "@/components/sections/CinemaStage";

/** "The First Material" — the brand film, played by the scroll straight out of About. */
export function BrandFilm({ t }: { t: Dictionary }) {
  return <CinemaStage f={t.film} />;
}
