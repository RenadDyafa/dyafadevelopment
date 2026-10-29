"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Encoded with a keyframe every 0.2s and no audio, so seeking to any scroll position is instant.
const SOURCES = { large: "/video/first-material-1080.mp4", small: "/video/first-material-720.mp4" };

/**
 * The film is driven by scroll: `progress` (0–1) is the position in the film,
 * so every visitor sees it from the first frame to the last as they move
 * through the section. The file is fetched whole once the section is near,
 * which keeps scrubbing smooth. `still` (reduced motion) shows the poster only.
 */
export function FilmPlayer({ f, progress, still = false }: { f: Dictionary["film"]; progress: MotionValue<number>; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const target = useRef(0);

  const seek = () => {
    const v = ref.current;
    if (!v || !v.duration || v.seeking) return;
    const t = target.current * (v.duration - 0.05);
    if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t;
  };

  useMotionValueEvent(progress, "change", (p) => {
    target.current = p;
    seek();
  });

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    let url = "";
    let cancelled = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const src = matchMedia("(min-width: 900px)").matches ? SOURCES.large : SOURCES.small;
        fetch(src)
          .then((r) => r.blob())
          .then((b) => {
            if (cancelled) return;
            url = URL.createObjectURL(b);
            v.src = url;
          })
          .catch(() => {
            if (!cancelled) v.src = src;
          });
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(v);
    return () => {
      cancelled = true;
      io.disconnect();
      if (url) URL.revokeObjectURL(url);
    };
  }, [still]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full bg-black object-cover"
      poster="/images/film-poster.jpg"
      muted
      playsInline
      preload="auto"
      aria-label={f.label}
      onLoadedData={() => {
        target.current = progress.get();
        seek();
      }}
      onSeeked={seek}
    />
  );
}
