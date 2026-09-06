/**
 * Procedural 3D Projection and Ambient Motion Engine
 * Inspired by and based on algorithms from https://github.com/smontlouis/bible-strong-avatar-lab
 */

export type Point3 = readonly [number, number, number];
export type Point2 = readonly [number, number];
export type Quaternion = readonly [number, number, number, number];

export const FOCAL_LENGTH = 620;
export const EYE_MOTION_SEED = 17.29;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function degrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function normalizeQuaternion([w, x, y, z]: Quaternion): Quaternion {
  const length = Math.hypot(w, x, y, z) || 1;
  return [w / length, x / length, y / length, z / length];
}

export function multiplyQuaternions(
  [aw, ax, ay, az]: Quaternion,
  [bw, bx, by, bz]: Quaternion
): Quaternion {
  return normalizeQuaternion([
    aw * bw - ax * bx - ay * by - az * bz,
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
  ]);
}

export function quaternionFromAxisAngle(
  [x, y, z]: Point3,
  angle: number
): Quaternion {
  const halfAngle = angle / 2;
  const sine = Math.sin(halfAngle);
  return normalizeQuaternion([Math.cos(halfAngle), x * sine, y * sine, z * sine]);
}

/**
 * Creates a rotation quaternion from Euler angles in degrees (headX=pitch, headY=yaw, headZ=roll)
 */
export function quaternionFromEulerDegrees(
  headX: number,
  headY: number,
  headZ: number
): Quaternion {
  const rx = radians(headX);
  const ry = radians(headY);
  const rz = radians(headZ);

  const xRotation = quaternionFromAxisAngle([1, 0, 0], rx);
  const yRotation = quaternionFromAxisAngle([0, 1, 0], ry);
  const zRotation = quaternionFromAxisAngle([0, 0, 1], rz);

  // Order: Z * X * Y
  return multiplyQuaternions(multiplyQuaternions(zRotation, xRotation), yRotation);
}

/**
 * Rotates a 3D point using a quaternion
 */
export function rotateWithQuaternion(
  [w, x, y, z]: Quaternion,
  [px, py, pz]: Point3
): Point3 {
  const ix = 2 * (y * pz - z * py);
  const iy = 2 * (z * px - x * pz);
  const iz = 2 * (x * py - y * px);
  return [
    px + w * ix + (y * iz - z * iy),
    py + w * iy + (z * ix - x * iz),
    pz + w * iz + (x * iy - y * ix),
  ];
}

/**
 * Spherical linear interpolation between two quaternions
 */
export function slerpQuaternion(
  start: Quaternion,
  end: Quaternion,
  progress: number
): Quaternion {
  let target = end;
  let dot = start.reduce((total, val, idx) => total + val * target[idx], 0);
  if (dot < 0) {
    target = target.map((v) => -v) as unknown as Quaternion;
    dot = -dot;
  }
  if (dot > 0.9995) {
    return normalizeQuaternion(
      start.map((val, idx) => val + (target[idx] - val) * progress) as unknown as Quaternion
    );
  }
  const theta = Math.acos(clamp(dot, -1, 1));
  const sineTheta = Math.sin(theta);
  const startWeight = Math.sin((1 - progress) * theta) / sineTheta;
  const endWeight = Math.sin(progress * theta) / sineTheta;
  return normalizeQuaternion(
    start.map((val, idx) => val * startWeight + target[idx] * endWeight) as unknown as Quaternion
  );
}

/**
 * 3D Camera Perspective Projection (focalLength = 620 as in Avatar Lab)
 */
export function projectWithPerspective(
  [x, y, z]: Point3,
  perspective = 1.0,
  focalLength = FOCAL_LENGTH
): Point2 {
  const depth = focalLength - z * perspective;
  const scale = Math.abs(depth) < 0.001 ? focalLength / 0.001 : focalLength / depth;
  return [x * scale, y * scale];
}

/**
 * Converts polygon points to smooth SVG Catmull-Rom/Cubic Bezier curve
 */
export function smoothBezierPath(points: readonly Point2[], tension = 0.28): string {
  const n = points.length;
  if (n < 3) return "";

  const parts: string[] = [`M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`];

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;

    parts.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`
    );
  }

  parts.push("Z");
  return parts.join(" ");
}

/**
 * Combines multiple closed loops into an even-odd SVG path string
 */
export function multiLoopPath(loops: readonly (readonly Point2[])[], tension = 0.28): string {
  return loops.map((loop) => smoothBezierPath(loop, tension)).filter(Boolean).join(" ");
}

/* =========================================================================
   Ambient Motion Engine (from smontlouis/bible-strong-avatar-lab)
   ========================================================================= */

const smoothstep = (value: number) => value * value * (3 - 2 * value);

const hash = (value: number) => {
  const raw = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return (raw - Math.floor(raw)) * 2 - 1;
};

export const smoothNoise = (
  elapsedMs: number,
  axis: number,
  seed: number,
  interval: number
): number => {
  const progress = elapsedMs / interval;
  const step = Math.floor(progress);
  const blend = smoothstep(progress - step);
  const previous = hash(step * 3 + axis + seed);
  const next = hash((step + 1) * 3 + axis + seed);
  return previous + (next - previous) * blend;
};

export const saccade = (
  elapsedMs: number,
  axis: number,
  seed: number
): number => {
  const interval = 1200;
  const duration = 140;
  if (elapsedMs <= 0) return 0;
  const step = Math.floor(elapsedMs / interval);
  const progress = (elapsedMs - step * interval) / duration;
  const blend = smoothstep(Math.min(progress, 1));
  const previous = step === 0 ? 0 : hash((step - 1) * 2 + axis + seed);
  const next = hash(step * 2 + axis + seed);
  return previous + (next - previous) * blend;
};

/**
 * Computes organic ambient motion offsets (slow drift breathing + saccades)
 */
export function getAmbientOffset(
  elapsedMs: number,
  strength = 1.0
): { headX: number; headY: number; headZ: number; eyeX: number; eyeY: number } {
  // Slow respiratory drift
  const driftX = smoothNoise(elapsedMs, 0, 42.1, 3200) * 1.8 * strength;
  const driftY = smoothNoise(elapsedMs, 1, 42.1, 4100) * 2.4 * strength;
  const driftZ = smoothNoise(elapsedMs, 2, 42.1, 4800) * 0.9 * strength;

  // Eye micro-saccades
  const eyeX = saccade(elapsedMs, 0, EYE_MOTION_SEED) * 2.2 * strength;
  const eyeY = saccade(elapsedMs, 1, EYE_MOTION_SEED) * 1.4 * strength;

  return {
    headX: driftX,
    headY: driftY,
    headZ: driftZ,
    eyeX,
    eyeY,
  };
}
