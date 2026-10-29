import type { CSSProperties, ReactNode } from "react";

// Scroll-in reveals are plain markup + CSS (see `[data-reveal]` in globals.css).
// They render on the server and need no hydration; a single RevealObserver
// island adds `.is-in` when each element enters the viewport.

export const easeArch = [0.22, 1, 0.36, 1] as const;
export const easeCinema = [0.65, 0, 0.35, 1] as const;

const delayStyle = (delay: number, extra?: CSSProperties): CSSProperties =>
  ({ "--d": `${Math.round(delay * 1000)}ms`, ...extra }) as CSSProperties;

/** Lines that rise out of a mask — the base typographic reveal. */
export function RevealText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  id,
}: {
  id?: string;
  lines: string[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <Tag id={id} className={className} data-reveal="lines">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span className={`reveal-line block ${lineClassName ?? ""}`} style={delayStyle(delay + i * stagger)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Generic fade-and-rise for supporting content. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p";
}) {
  return (
    <Tag className={className} data-reveal="" style={delayStyle(delay)}>
      {children}
    </Tag>
  );
}

/** Image/frame mask that opens from an inset rectangle. */
export function RevealMask({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className} data-reveal="mask">
      {children}
    </div>
  );
}

/** A thin rule that draws across, direction-aware via logical origin. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  return <div aria-hidden className={`hairline ${className ?? ""}`} data-reveal="line" style={delayStyle(delay)} />;
}
