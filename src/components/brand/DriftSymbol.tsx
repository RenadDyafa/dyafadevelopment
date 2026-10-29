import { Parallax } from "@/components/motion/Parallax";
import { Symbol } from "@/components/brand/Symbol";

/**
 * Oversized ghost ring that turns and drifts as its section scrolls past —
 * the background motif first used behind Contact. Position, size and tint
 * come from `className`; the parent section should be `isolate` and clip overflow.
 */
export function DriftSymbol({
  className,
  rotate = [-30, 30],
  y = ["-8%", "8%"],
}: {
  className: string;
  rotate?: [number, number];
  y?: [string, string];
}) {
  return (
    <Parallax className={`pointer-events-none absolute -z-10 ${className}`} innerClassName="size-full" rotate={rotate} y={y}>
      <Symbol className="size-full" />
    </Parallax>
  );
}
