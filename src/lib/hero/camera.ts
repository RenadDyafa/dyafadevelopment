// Shared, framework-free camera path for the hero sequence. The WebGL scene and
// the DOM image mask both read it, so the photographic reveal lines up exactly
// with the ring aperture the camera flies through.

export type Vec3 = [number, number, number];

export const CAMERA_FOV = 38;
export const RING_CENTER: Vec3 = [0, 5.2, -6];
/** Radius of the ring's inner opening, in world units. */
export const RING_INNER_RADIUS = 2.75;
export const RING_DIAMETER = 8.4;

type Key = { t: number; pos: Vec3; look: Vec3 };

const KEYS: Key[] = [
  { t: 0.0, pos: [7.5, 6.4, 40], look: [0, 5.6, -6] },
  { t: 0.42, pos: [3.2, 5.4, 22], look: [0, 5.3, -6] },
  { t: 0.74, pos: [0, 5.2, 7.5], look: [0, 5.2, -6] },
  { t: 1.0, pos: [0, 5.2, -5.6], look: [0, 5.2, -40] },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function catmull(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

function sample(p: number, field: "pos" | "look"): Vec3 {
  const t = clamp01(p);
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
  const a = KEYS[Math.max(0, i - 1)][field];
  const b = KEYS[i][field];
  const c = KEYS[i + 1][field];
  const d = KEYS[Math.min(KEYS.length - 1, i + 2)][field];
  const local = (t - KEYS[i].t) / (KEYS[i + 1].t - KEYS[i].t);
  return [0, 1, 2].map((k) => catmull(a[k], b[k], c[k], d[k], local)) as Vec3;
}

export function cameraAt(p: number) {
  return { pos: sample(p, "pos"), look: sample(p, "look") };
}

/**
 * Projected radius of the ring opening as a fraction of viewport height.
 * Returns Infinity once the camera has passed through the ring.
 */
export function apertureRadiusVh(p: number) {
  const { pos } = cameraAt(p);
  const d = pos[2] - RING_CENTER[2];
  if (d <= 0.05) return Infinity;
  return (RING_INNER_RADIUS / (d * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180))) * 50;
}

export const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a));
  return x * x * (3 - 2 * x);
};
