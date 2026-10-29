"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, PerformanceMonitor } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { SYMBOL_PATHS, SYMBOL_VIEWBOX } from "@/lib/brand/paths";
import { CAMERA_FOV, RING_CENTER, RING_DIAMETER, cameraAt, smoothstep } from "@/lib/hero/camera";
import type { Quality } from "@/lib/hero/webgl";

/* ------------------------------------------------------------------ */
/* Palette (brand tokens, tuned for golden-hour lighting)              */
/* ------------------------------------------------------------------ */
const ZENITH = new THREE.Color("#1b1a1c");
const MIDSKY = new THREE.Color("#5b564c");
const HORIZON = new THREE.Color("#c2b092");
const FOG = "#c2b092";
const SUN_DIR = new THREE.Vector3(-1, 0.3, 0.28).normalize();

/* ------------------------------------------------------------------ */
/* Procedural limestone: no texture download, generated once.          */
/* ------------------------------------------------------------------ */
let stoneCanvas: HTMLCanvasElement | null = null;
function stoneImage() {
  if (stoneCanvas) return stoneCanvas;
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#d9d0bf";
  ctx.fillRect(0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rand() - 0.5) * 10;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n * 0.9;
  }
  ctx.putImageData(img, 0, 0);
  // Coursed stone: horizontal beds with staggered vertical joints.
  const course = size / 6;
  ctx.strokeStyle = "rgba(80,72,60,0.1)";
  ctx.lineWidth = 1;
  for (let r = 0; r <= 6; r++) {
    const y = r * course;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  stoneCanvas = c;
  return c;
}

function useStone(repeatX: number, repeatY: number) {
  return useMemo(() => {
    const t = new THREE.CanvasTexture(stoneImage());
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [repeatX, repeatY]);
}

/* ------------------------------------------------------------------ */
/* Sky dome                                                            */
/* ------------------------------------------------------------------ */
function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          zenith: { value: ZENITH },
          mid: { value: MIDSKY },
          horizon: { value: HORIZON },
          sunDir: { value: SUN_DIR },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 zenith; uniform vec3 mid; uniform vec3 horizon; uniform vec3 sunDir;
          varying vec3 vDir;
          void main() {
            float h = vDir.y;
            vec3 col = mix(horizon, mid, smoothstep(-0.02, 0.16, h));
            col = mix(col, zenith, smoothstep(0.14, 0.62, h));
            float sun = max(dot(normalize(vDir), sunDir), 0.0);
            col += vec3(1.0, 0.78, 0.52) * (pow(sun, 18.0) * 0.55 + pow(sun, 420.0) * 1.4);
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  );
  return (
    <mesh material={material} renderOrder={-1}>
      <sphereGeometry args={[420, 32, 16]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Architecture                                                        */
/* ------------------------------------------------------------------ */
function Wall({
  position,
  size,
  rotationY = 0,
  high,
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotationY?: number;
  high: boolean;
}) {
  const map = useStone(size[2] / 6, size[1] / 6);
  return (
    <mesh position={position} rotation-y={rotationY} castShadow={high} receiveShadow={high}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={map} bumpMap={map} bumpScale={0.04} roughness={0.88} color="#f1e9da" />
    </mesh>
  );
}

function Building({ high }: { high: boolean }) {
  const stone = useStone(4, 2);
  const fins = useRef<THREE.InstancedMesh>(null);
  const finCount = high ? 18 : 10;

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const span = 15;
    for (let i = 0; i < finCount; i++) {
      m.makeTranslation(-16 + (i / (finCount - 1)) * span, 8.2, -27.6);
      fins.current!.setMatrixAt(i, m);
    }
    fins.current!.instanceMatrix.needsUpdate = true;
  }, [finCount]);

  const glow = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#241f1a", emissive: "#f0b26c", emissiveIntensity: 1.1, roughness: 0.6 }),
    [],
  );
  const shade = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2a2826", roughness: 0.8 }), []);
  const mat = <meshStandardMaterial map={stone} roughness={0.9} color="#ded5c4" />;

  return (
    <group>
      {/* podium */}
      <mesh position={[-2, 1.6, -32]} receiveShadow={high} castShadow={high}>
        <boxGeometry args={[46, 3.2, 16]} />
        {mat}
      </mesh>
      {/* primary mass with fins */}
      <mesh position={[-8.5, 8.2, -34]} castShadow={high} receiveShadow={high}>
        <boxGeometry args={[17, 10, 12]} />
        {mat}
      </mesh>
      <instancedMesh ref={fins} args={[undefined, undefined, finCount]} castShadow={high}>
        <boxGeometry args={[0.34, 9.6, 1]} />
        <meshStandardMaterial color="#cfc6b4" roughness={0.85} />
      </instancedMesh>
      {/* cantilevered upper volume */}
      <mesh position={[7, 12.6, -31.5]} castShadow={high} receiveShadow={high}>
        <boxGeometry args={[24, 5.6, 12]} />
        {mat}
      </mesh>
      {/* deep horizontal slot with interior light */}
      <mesh position={[7, 12.4, -25.45]} material={glow}>
        <boxGeometry args={[20, 1.3, 0.1]} />
      </mesh>
      {/* recessed ground-floor glazing */}
      <mesh position={[8, 6.2, -30]} material={shade}>
        <boxGeometry args={[16, 6.4, 8]} />
      </mesh>
      <mesh position={[8, 5.6, -25.9]} material={glow}>
        <boxGeometry args={[12, 3.4, 0.08]} />
      </mesh>
      {/* tower slab */}
      <mesh position={[20, 10, -38]} castShadow={high}>
        <boxGeometry args={[6, 20, 10]} />
        {mat}
      </mesh>
    </group>
  );
}

function Ground({ high }: { high: boolean }) {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} receiveShadow={high}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#b3a78f" roughness={1} />
      </mesh>
      {/* stone plinth and reflecting pool between the walls */}
      <mesh position={[0, 0.12, -2]} receiveShadow={high}>
        <boxGeometry args={[11.4, 0.24, 30]} />
        <meshStandardMaterial color="#b7ad99" roughness={0.95} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.25, -1]}>
        <planeGeometry args={[8.6, 26]} />
        {high ? (
          <MeshReflectorMaterial
            resolution={512}
            blur={[260, 80]}
            mixBlur={1}
            mixStrength={1.4}
            mirror={0.6}
            roughness={0.8}
            depthScale={0}
            color="#3a3832"
            metalness={0.4}
          />
        ) : (
          <meshStandardMaterial color="#3d3b35" roughness={0.25} metalness={0.6} />
        )}
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Architectural lighting: lit pool edges, walls washed from below,     */
/* windows that spill onto the podium, and a light raised to the ring.  */
/* ------------------------------------------------------------------ */
const WARM = "#ffbf7a";

function Lights({ high }: { high: boolean }) {
  const line = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffd9a8", toneMapped: false }), []);
  const ringTarget = useMemo(() => new THREE.Object3D(), []);
  // Uplights along the inner foot of each wall; fewer on lighter devices.
  const along = high ? [8, -1, -10] : [3, -9];
  return (
    <group>
      {/* light lines along both edges of the reflecting pool and at the walls' feet */}
      {[-4.4, 4.4].map((x) => (
        <mesh key={x} position={[x, 0.27, -1]} material={line}>
          <boxGeometry args={[0.07, 0.03, 26]} />
        </mesh>
      ))}
      <mesh position={[-5.5, 0.08, -3]} rotation-y={0.05} material={line}>
        <boxGeometry args={[0.05, 0.05, 28]} />
      </mesh>
      <mesh position={[5.7, 0.08, -5]} rotation-y={-0.04} material={line}>
        <boxGeometry args={[0.05, 0.05, 22]} />
      </mesh>

      {along.map((z) => (
        <group key={z}>
          <pointLight position={[-5, 0.5, z]} color={WARM} intensity={40} distance={13} decay={2} />
          <pointLight position={[5.2, 0.5, z - 2]} color={WARM} intensity={40} distance={13} decay={2} />
        </group>
      ))}

      {/* interior glow spilling out of the building */}
      <pointLight position={[8, 5.6, -24]} color="#ffb066" intensity={90} distance={22} decay={2} />
      <pointLight position={[7, 12.4, -24.4]} color="#ffb066" intensity={50} distance={16} decay={2} />

      {/* the ring, lit from the pool */}
      <primitive object={ringTarget} position={RING_CENTER} />
      <spotLight
        position={[RING_CENTER[0], 0.6, RING_CENTER[2] + 7]}
        target={ringTarget}
        color="#ffd2a0"
        intensity={260}
        angle={0.55}
        penumbra={0.9}
        distance={30}
        decay={2}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* The ض ring — official symbol paths extruded into stone-metal units  */
/* ------------------------------------------------------------------ */
type Unit = { geometry: THREE.BufferGeometry; base: THREE.Vector3; dir: THREE.Vector2; sign: number };

function useRingUnits(): Unit[] {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SYMBOL_VIEWBOX}">${SYMBOL_PATHS.map(
      (d) => `<path d="${d}"/>`,
    ).join("")}</svg>`;
    const data = new SVGLoader().parse(svg);
    const s = RING_DIAMETER / 100;
    const depth = 7;
    return data.paths.map((path) => {
      const shapes = SVGLoader.createShapes(path);
      const g = new THREE.ExtrudeGeometry(shapes, {
        depth,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.35,
        bevelSegments: 1,
        curveSegments: 6,
      });
      g.translate(-50, -50, -depth / 2);
      g.scale(s, -s, s);
      g.computeBoundingBox();
      const c = new THREE.Vector3();
      g.boundingBox!.getCenter(c);
      g.translate(-c.x, -c.y, -c.z);
      g.computeVertexNormals();
      const angle = Math.atan2(c.y, c.x);
      const bucket = Math.round(((angle + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4));
      return {
        geometry: g,
        base: c,
        dir: new THREE.Vector2(Math.cos(angle), Math.sin(angle)),
        sign: bucket % 2 ? 1 : -1,
      };
    });
  }, []);
}

function Ring({ progress, high, still }: { progress: MotionValue<number>; high: boolean; still: boolean }) {
  const units = useRingUnits();
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#bdb8a5",
        roughness: 0.38,
        metalness: 0.35,
        emissive: "#2a2822",
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((state) => {
    const p = progress.get();
    // Geometry "opens" between the approach and the pass-through, then re-forms.
    const g = smoothstep(0.34, 0.5, p) * (1 - smoothstep(0.56, 0.7, p));
    if (group.current && !still) group.current.rotation.z = state.clock.elapsedTime * 0.035;
    units.forEach((u, i) => {
      const m = meshes.current[i];
      if (!m) return;
      m.position.set(u.base.x + u.dir.x * g * 0.9, u.base.y + u.dir.y * g * 0.9, u.base.z + u.sign * g * 2.2);
      m.rotation.set(0, u.sign * g * 0.55, u.sign * g * 0.45);
    });
  });

  return (
    <group ref={group} position={RING_CENTER}>
      {units.map((u, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          geometry={u.geometry}
          material={material}
          castShadow={high}
          position={u.base}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig: scroll progress drives the path, pointer adds parallax  */
/* ------------------------------------------------------------------ */
function CameraRig({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const look = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useFrame((state, dt) => {
    const p = progress.get();
    const { pos, look: l } = cameraAt(p);
    const ptr = pointer.current;
    const damp = 1 - Math.exp(-dt * 2.4);
    ptr.x += (ptr.tx - ptr.x) * damp;
    ptr.y += (ptr.ty - ptr.y) * damp;
    // Parallax fades out before the aperture reveal so the DOM mask stays aligned.
    const k = still ? 0 : 1 - smoothstep(0.5, 0.78, p);
    const t = state.clock.elapsedTime;
    camera.position.set(
      pos[0] + ptr.x * 1.5 * k + Math.sin(t * 0.13) * 0.35 * k,
      pos[1] - ptr.y * 0.7 * k + Math.sin(t * 0.21) * 0.12 * k,
      pos[2],
    );
    look.set(l[0] + ptr.x * 0.4 * k, l[1], l[2]);
    camera.lookAt(look);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */
export default function ArchitectureScene({
  progress,
  quality,
  active,
  still,
  onReady,
}: {
  progress: MotionValue<number>;
  quality: Quality;
  active: boolean;
  still: boolean;
  onReady?: () => void;
}) {
  const high = quality === "high";
  const [dpr, setDpr] = useState(high ? 1.5 : 1.15);
  const start = cameraAt(0).pos;

  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      shadows={high ? "soft" : false}
      gl={{ antialias: high, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: CAMERA_FOV, near: 0.1, far: 900, position: start }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.3;
        onReady?.();
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(high ? 1.5 : 1.15)} />
      <color attach="background" args={["#1b1a1c"]} />
      <fog attach="fog" args={[FOG, 60, 260]} />
      <Sky />

      <hemisphereLight args={["#f1e8d8", "#6b6152", 1.15]} />
      <directionalLight
        position={[SUN_DIR.x * 60, SUN_DIR.y * 60 + 14, SUN_DIR.z * 60]}
        intensity={4.4}
        color="#ffd09a"
        castShadow={high}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
        shadow-normalBias={0.05}
      />
      <directionalLight position={[14, 10, 40]} intensity={0.7} color="#dfe1e0" />

      <Ground high={high} />
      <Wall position={[-6.4, 7, -3]} size={[1.6, 14, 30]} rotationY={0.05} high={high} />
      <Wall position={[6.6, 5.8, -5]} size={[1.6, 11.6, 24]} rotationY={-0.04} high={high} />
      <Building high={high} />
      <Lights high={high} />
      <Ring progress={progress} high={high} still={still} />
      <CameraRig progress={progress} still={still} />
    </Canvas>
  );
}
