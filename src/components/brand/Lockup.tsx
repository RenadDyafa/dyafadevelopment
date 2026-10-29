import { LOCKUP_PATHS, LOCKUP_VIEWBOX } from "@/lib/brand/paths";

/** Official bilingual lockup (Arabic wordmark, English descriptor, symbol). */
export function Lockup({ className, title }: { className?: string; title: string }) {
  return (
    <svg viewBox={LOCKUP_VIEWBOX} className={className} role="img" aria-label={title} fill="currentColor">
      {LOCKUP_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
