import { ImageResponse } from "next/og";
import { LOCKUP_PATHS, LOCKUP_VIEWBOX } from "@/lib/brand/paths";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Dyafa Real Estate Development & Investment";

// The official lockup is outlined vector type, so it renders identically for
// both locales without loading any font.
export default function OpengraphImage() {
  const [, , w, h] = LOCKUP_VIEWBOX.split(" ").map(Number);
  const width = 860;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg,#232224 0%,#2e2c2b 60%,#4a463f 100%)",
        }}
      >
        <svg width={width} height={(width * h) / w} viewBox={LOCKUP_VIEWBOX} fill="#C9CABC">
          {LOCKUP_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
