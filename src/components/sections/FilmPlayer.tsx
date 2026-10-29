"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

// Encoded with a keyframe every 0.2s and no audio, so seeking to any scroll position is instant.
const SOURCES = { large: "/video/first-material-1080.mp4", small: "/video/first-material-720.mp4" };
const TAPS = ["touchend", "pointerdown", "keydown"] as const;

/**
 * The film is driven by scroll: `progress` (0–1) is the position in the film,
 * so every visitor sees it from the first frame to the last as they move
 * through the section. The file is fetched whole once the section is near,
 * which keeps scrubbing smooth. `still` (reduced motion) shows the poster only.
 *
 * Safari (iOS above all) ignores `preload` and decodes no frames until the video
 * has played once, so it is unlocked with a muted play/pause as soon as it loads;
 * if that is refused (Low Power Mode), the first tap anywhere unlocks it instead.
 */
export function FilmPlayer({ f, progress, still = false }: { f: Dictionary["film"]; progress: MotionValue<number>; still?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const unlocked = useRef(false);

  const seek = () => {
    const v = ref.current;
    if (!v || v.readyState < 1 || !Number.isFinite(v.duration) || v.seeking) return;
    const t = target.current * (v.duration - 0.05);
    if (Math.abs(v.currentTime - t) > 1 / 60) v.currentTime = t;
  };

  const sync = () => {
    target.current = progress.get();
    seek();
  };

  useMotionValueEvent(progress, "change", (p) => {
    target.current = p;
    seek();
  });

  useEffect(() => {
    const v = ref.current;
    if (!v || still) return;
    // Set as attributes too: Safari reads these when deciding whether a silent inline play is allowed.
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    let url = "";
    let cancelled = false;

    const unlock = () => {
      if (unlocked.current || cancelled || !v.src) return;
      const played = v.play();
      if (!played) return;
      played
        .then(() => {
          v.pause();
          unlocked.current = true;
          TAPS.forEach((e) => window.removeEventListener(e, unlock));
          sync();
        })
        .catch(() => {
          // Refused without a gesture: wait for the visitor's first tap.
          TAPS.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
        });
    };

    const load = (src: string) => {
      if (cancelled) return;
      v.src = src;
      v.load();
      unlock();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const src = matchMedia("(min-width: 900px)").matches ? SOURCES.large : SOURCES.small;
        fetch(src)
          .then((r) => {
            if (!r.ok) throw new Error(String(r.status));
            return r.blob();
          })
          .then((b) => {
            if (cancelled) return;
            // Keep the type explicit: Safari will not play an untyped blob.
            url = URL.createObjectURL(b.type ? b : new Blob([b], { type: "video/mp4" }));
            load(url);
          })
          .catch(() => load(src));
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(v);
    return () => {
      cancelled = true;
      io.disconnect();
      TAPS.forEach((e) => window.removeEventListener(e, unlock));
      if (url) URL.revokeObjectURL(url);
    };
    // `sync` reads refs only; re-running on its identity would refetch the film.
  }, [still]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full bg-black object-cover"
      poster="/images/film-poster.jpg"
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      aria-label={f.label}
      onLoadedMetadata={sync}
      onLoadedData={sync}
      onCanPlay={sync}
      onSeeked={seek}
      // A stray play (Safari can resume on its own) must never run the film past the scroll.
      onPlay={(e) => unlocked.current && e.currentTarget.pause()}
    />
  );
}
