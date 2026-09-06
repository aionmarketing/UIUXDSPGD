"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  GORILLA_3D_MODEL,
} from "./gorillaModel";
import {
  quaternionFromEulerDegrees,
  rotateWithQuaternion,
  projectWithPerspective,
  smoothBezierPath,
  multiLoopPath,
  getAmbientOffset,
  clamp,
  FOCAL_LENGTH,
  type Point2,
  type Point3,
} from "./avatarEngine";
import {
  Eye,
  Crosshair,
  Sliders,
  Sparkles,
  Layers,
  RotateCcw,
} from "lucide-react";

export interface GorillaAvatarProps {
  className?: string;
  size?: number | string;
  defaultTracking?: boolean;
  showControls?: boolean;
}

export type EyeGlowMode = "none" | "optic-white" | "cyber-amber" | "neon-cyan";
export type TrackingMode = "follow" | "ambient" | "drag";

export function GorillaAvatar({
  className = "",
  size = "100%",
  defaultTracking = true,
  showControls = true,
}: GorillaAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Path Element References for 60fps Direct DOM Attribute Updates
  const browPathRef = useRef<SVGPathElement>(null);
  const muzzlePathRef = useRef<SVGPathElement>(null);
  const jawPathRef = useRef<SVGPathElement>(null);
  const leftEyeRef = useRef<SVGCircleElement>(null);
  const rightEyeRef = useRef<SVGCircleElement>(null);
  const wireGroupRef = useRef<SVGGElement>(null);

  // Real-time Telemetry state for UI
  const [telemetry, setTelemetry] = useState({
    yaw: 0,
    pitch: 0,
    roll: 0,
    fps: 60,
  });

  // User Interactive Settings
  const [trackingMode, setTrackingMode] = useState<TrackingMode>(
    defaultTracking ? "follow" : "ambient"
  );
  const [eyeGlow, setEyeGlow] = useState<EyeGlowMode>("optic-white");
  const [showWireframe, setShowWireframe] = useState(false);
  const [depthMultiplier, setDepthMultiplier] = useState(1.15);
  const [perspectiveFactor, setPerspectiveFactor] = useState(1.0);
  const [hudOpen, setHudOpen] = useState(false);
  const [isClickSnarl, setIsClickSnarl] = useState(false);

  // Physics / Motion Refs
  const targetAngles = useRef({ x: 0, y: 0, z: 0 });
  const currentAngles = useRef({ x: 0, y: 0, z: 0 });
  const recoilRef = useRef({ pitch: 0, jawOffset: 0, active: false });
  const dragStart = useRef<{ startX: number; startY: number; initYaw: number; initPitch: number } | null>(null);
  const animFrameId = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsTimerRef = useRef<number>(0);

  // Mouse / Pointer Event Handler
  const handlePointerMove = useCallback(
    (e: MouseEvent) => {
      if (trackingMode === "ambient") return;

      if (trackingMode === "drag" && dragStart.current) {
        const dx = e.clientX - dragStart.current.startX;
        const dy = e.clientY - dragStart.current.startY;
        targetAngles.current.y = dragStart.current.initYaw + dx * 0.35;
        targetAngles.current.x = clamp(dragStart.current.initPitch + dy * 0.35, -35, 35);
        targetAngles.current.z = -targetAngles.current.y * 0.12;
        return;
      }

      if (trackingMode === "follow") {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalized offset from container center (-1 to 1)
        const normX = (e.clientX - centerX) / (window.innerWidth * 0.45);
        const normY = (e.clientY - centerY) / (window.innerHeight * 0.45);

        // Maximum angular ranges (Degrees)
        const maxYaw = 32;
        const maxPitch = 24;

        targetAngles.current.y = clamp(normX * maxYaw, -maxYaw, maxYaw);
        targetAngles.current.x = clamp(normY * maxPitch, -maxPitch, maxPitch);
        // Head naturally banks slightly into the turn
        targetAngles.current.z = clamp(-targetAngles.current.y * 0.16, -8, 8);
      }
    },
    [trackingMode]
  );

  // Pointer Down for Drag Mode or Click Reaction
  const handlePointerDown = (e: React.PointerEvent) => {
    if (trackingMode === "drag") {
      dragStart.current = {
        startX: e.clientX,
        startY: e.clientY,
        initYaw: targetAngles.current.y,
        initPitch: targetAngles.current.x,
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      // Trigger Snarl / Click tension recoil
      recoilRef.current = { pitch: -10, jawOffset: 14, active: true };
      setIsClickSnarl(true);
      setTimeout(() => {
        setIsClickSnarl(false);
      }, 350);
    }
  };

  const handlePointerUp = () => {
    if (trackingMode === "drag") {
      dragStart.current = null;
    }
  };

  // Attach global mousemove listener so the gorilla tracks across the whole window
  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove]);

  // Main 60fps Projection & Animation Loop
  useEffect(() => {
    lastTimeRef.current = performance.now();
    fpsTimerRef.current = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Calculate FPS
      frameCountRef.current++;
      if (now - fpsTimerRef.current >= 600) {
        setTelemetry({
          yaw: Math.round(currentAngles.current.y * 10) / 10,
          pitch: Math.round(currentAngles.current.x * 10) / 10,
          roll: Math.round(currentAngles.current.z * 10) / 10,
          fps: Math.round((frameCountRef.current * 1000) / (now - fpsTimerRef.current)),
        });
        frameCountRef.current = 0;
        fpsTimerRef.current = now;
      }

      // 1. Spring physics lerp towards target
      const lerpSpeed = trackingMode === "ambient" ? 1.5 : 8.5;
      currentAngles.current.x += (targetAngles.current.x - currentAngles.current.x) * lerpSpeed * delta;
      currentAngles.current.y += (targetAngles.current.y - currentAngles.current.y) * lerpSpeed * delta;
      currentAngles.current.z += (targetAngles.current.z - currentAngles.current.z) * lerpSpeed * delta;

      // 2. Click Recoil decay
      if (recoilRef.current.active) {
        recoilRef.current.pitch *= Math.pow(0.05, delta);
        recoilRef.current.jawOffset *= Math.pow(0.04, delta);
        if (Math.abs(recoilRef.current.pitch) < 0.1 && Math.abs(recoilRef.current.jawOffset) < 0.2) {
          recoilRef.current.pitch = 0;
          recoilRef.current.jawOffset = 0;
          recoilRef.current.active = false;
        }
      }

      // 3. Ambient motion (from smontlouis/bible-strong-avatar-lab)
      const ambient = getAmbientOffset(now, trackingMode === "ambient" ? 1.8 : 0.85);

      const effectivePitch = currentAngles.current.x + ambient.headX + recoilRef.current.pitch;
      const effectiveYaw = currentAngles.current.y + ambient.headY;
      const effectiveRoll = currentAngles.current.z + ambient.headZ;

      // 4. Construct Rotation Quaternion
      const Q = quaternionFromEulerDegrees(effectivePitch, effectiveYaw, effectiveRoll);

      // 5. Transform and project 3D vertices to 2D
      const projectPoint = (p: Point3, extraZ = 0, extraY = 0): Point2 => {
        const x0 = p[0] - 512;
        const y0 = p[1] - 512 + extraY;
        const z0 = (p[2] + extraZ) * depthMultiplier;

        const rotated = rotateWithQuaternion(Q, [x0, y0, z0]);
        const projected = projectWithPerspective(rotated, perspectiveFactor, FOCAL_LENGTH);

        return [512 + projected[0], 512 + projected[1]];
      };

      // Project Brow Loop
      const projBrow = GORILLA_3D_MODEL.brow.map((p) => projectPoint(p, 0));
      const browD = smoothBezierPath(projBrow);
      if (browPathRef.current) browPathRef.current.setAttribute("d", browD);

      // Project Muzzle & Nostrils (Protruding forward by depthMultiplier)
      const projMuzzleLoops = GORILLA_3D_MODEL.muzzle.map((loop) =>
        loop.map((p) => projectPoint(p, 12))
      );
      const muzzleD = multiLoopPath(projMuzzleLoops);
      if (muzzlePathRef.current) muzzlePathRef.current.setAttribute("d", muzzleD);

      // Project Jaw (with optional click snarl jaw drop)
      const projJaw = GORILLA_3D_MODEL.jaw.map((p) =>
        projectPoint(p, -4, recoilRef.current.jawOffset)
      );
      const jawD = smoothBezierPath(projJaw);
      if (jawPathRef.current) jawPathRef.current.setAttribute("d", jawD);

      // Project Gaze / Predator Pupils inside the sockets
      const leftEye3D: Point3 = [
        GORILLA_3D_MODEL.eyes.leftSocket[0] + ambient.eyeX * 1.8,
        GORILLA_3D_MODEL.eyes.leftSocket[1] + ambient.eyeY * 1.4,
        GORILLA_3D_MODEL.eyes.leftSocket[2],
      ];
      const rightEye3D: Point3 = [
        GORILLA_3D_MODEL.eyes.rightSocket[0] + ambient.eyeX * 1.8,
        GORILLA_3D_MODEL.eyes.rightSocket[1] + ambient.eyeY * 1.4,
        GORILLA_3D_MODEL.eyes.rightSocket[2],
      ];

      const projLeftEye = projectPoint(leftEye3D, 2);
      const projRightEye = projectPoint(rightEye3D, 2);

      if (leftEyeRef.current) {
        leftEyeRef.current.setAttribute("cx", projLeftEye[0].toFixed(2));
        leftEyeRef.current.setAttribute("cy", projLeftEye[1].toFixed(2));
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.setAttribute("cx", projRightEye[0].toFixed(2));
        rightEyeRef.current.setAttribute("cy", projRightEye[1].toFixed(2));
      }

      // Dynamic Wireframe Guides
      if (wireGroupRef.current && showWireframe) {
        // Generate cross-connecting depth guides across key symmetry points
        let wireD = "";
        for (let i = 0; i < projBrow.length; i += 8) {
          const bp = projBrow[i];
          const mp = projMuzzleLoops[0][Math.min(i, projMuzzleLoops[0].length - 1)];
          wireD += `M ${bp[0].toFixed(1)} ${bp[1].toFixed(1)} L ${mp[0].toFixed(1)} ${mp[1].toFixed(1)} `;
        }
        wireGroupRef.current.innerHTML = `<path d="${wireD}" stroke="#3b82f6" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.6" fill="none" />`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [depthMultiplier, perspectiveFactor, showWireframe, trackingMode]);

  // Reset neutral orientation
  const handleReset = () => {
    targetAngles.current = { x: 0, y: 0, z: 0 };
  };

  // Color config based on eye glow mode
  const getEyeColor = () => {
    switch (eyeGlow) {
      case "optic-white":
        return { fill: "#ffffff", glow: "rgba(255, 255, 255, 0.9)" };
      case "cyber-amber":
        return { fill: "#f59e0b", glow: "rgba(245, 158, 11, 0.9)" };
      case "neon-cyan":
        return { fill: "#06b6d4", glow: "rgba(6, 182, 212, 0.9)" };
      default:
        return null;
    }
  };
  const eyeStyle = getEyeColor();

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden bg-canvas-base flex items-center justify-center group ${className}`}
      style={{ width: size, height: size }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      title="Click or drag to interact"
    >
      {/* Background Specular Ambience & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_48%,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0.95)_75%)]" />

      {/* Subtle Matrix / Lab Alignment Grid in background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* SVG Canvas for 3D Procedural Gorilla Face */}
      <svg
        ref={svgRef}
        viewBox="0 0 1024 1024"
        className="w-full h-full max-w-[560px] max-h-[560px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform duration-75"
        style={{
          filter: isClickSnarl ? "drop-shadow(0 0 16px rgba(255,255,255,0.4))" : undefined,
        }}
        aria-label="Interactive 3D Gorilla Avatar"
        role="img"
      >
        <defs>
          {/* Subtle Contoured Specular Linear Gradient */}
          <linearGradient id="gorillaSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f4f5f8" />
            <stop offset="100%" stopColor="#d5d9e2" />
          </linearGradient>

          {/* Eye Glow Radial Gradient Filter */}
          <filter id="eyeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Wireframe Structural Guides (Avatar Lab style) */}
        <g ref={wireGroupRef} />

        {/* 2. Brow & Forehead Crest */}
        <path
          ref={browPathRef}
          fill="url(#gorillaSpecular)"
          className="transition-opacity duration-200"
          style={{
            stroke: showWireframe ? "#60a5fa" : "none",
            strokeWidth: showWireframe ? 1 : 0,
          }}
        />

        {/* 3. Deep Eye Sockets Negative Cavities with Gaze Tracking Pupils */}
        {eyeStyle && (
          <g filter="url(#eyeGlowFilter)">
            {/* Left Eye Pupil */}
            <circle
              ref={leftEyeRef}
              r="4.5"
              fill={eyeStyle.fill}
              opacity="0.95"
            />
            {/* Right Eye Pupil */}
            <circle
              ref={rightEyeRef}
              r="4.5"
              fill={eyeStyle.fill}
              opacity="0.95"
            />
          </g>
        )}

        {/* 4. Muzzle & Nostrils (Forward Protruding Volume with punch-through nostrils) */}
        <path
          ref={muzzlePathRef}
          fill="url(#gorillaSpecular)"
          fillRule="evenodd"
          className="transition-opacity duration-200"
          style={{
            stroke: showWireframe ? "#60a5fa" : "none",
            strokeWidth: showWireframe ? 1 : 0,
          }}
        />

        {/* 5. Lower Jaw / Chin Oval */}
        <path
          ref={jawPathRef}
          fill="url(#gorillaSpecular)"
          className="transition-opacity duration-200"
          style={{
            stroke: showWireframe ? "#60a5fa" : "none",
            strokeWidth: showWireframe ? 1 : 0,
          }}
        />
      </svg>

      {/* Top Floating HUD: Realtime 3D Telemetry (Avatar-Lab) */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-20">
        <div className="bg-canvas-well/80 backdrop-blur-md border border-border-subtle px-2.5 py-1 flex items-center gap-2 text-[10px] font-mono text-text-slate">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>YAW: <strong className="text-text-optic">{telemetry.yaw}°</strong></span>
          <span className="text-border-subtle">|</span>
          <span>PITCH: <strong className="text-text-optic">{telemetry.pitch}°</strong></span>
          <span className="text-border-subtle">|</span>
          <span>{telemetry.fps} FPS</span>
        </div>
      </div>

      {/* Top Right Quick Controls Toggle */}
      {showControls && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            type="button"
            onClick={handleReset}
            title="Reset to Neutral Pose"
            className="p-1.5 bg-canvas-well/80 hover:bg-white/10 backdrop-blur border border-border-subtle text-text-slate hover:text-text-optic transition text-xs font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setHudOpen(!hudOpen)}
            title="Toggle Engine Settings"
            className={`p-1.5 backdrop-blur border text-xs font-mono transition ${
              hudOpen
                ? "bg-text-optic text-canvas-base border-text-optic"
                : "bg-canvas-well/80 hover:bg-white/10 border-border-subtle text-text-slate hover:text-text-optic"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Collapsible Avatar-Lab Engine Settings Drawer */}
      {showControls && hudOpen && (
        <div className="absolute top-12 right-3 z-30 w-64 bg-canvas-well/95 backdrop-blur-xl border border-border-specular p-3.5 shadow-2xl font-mono text-[11px] text-text-slate space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <span className="font-bold text-text-optic uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-text-platinum" />
              Avatar Lab Controls
            </span>
            <span className="text-[9px] text-text-slate/70">v1.0</span>
          </div>

          {/* Tracking Mode */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-text-slate flex items-center gap-1">
              <Crosshair className="w-3 h-3" />
              Tracking Mode
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(["follow", "ambient", "drag"] as TrackingMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTrackingMode(mode)}
                  className={`py-1 px-1.5 text-center text-[10px] uppercase tracking-wider border transition ${
                    trackingMode === mode
                      ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                      : "bg-canvas-base/50 text-text-slate border-border-subtle hover:text-text-optic"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Predator Eye Glow Mode */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-text-slate flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Eye Gaze Tracking
            </label>
            <div className="grid grid-cols-2 gap-1">
              {(
                [
                  ["optic-white", "Optic"],
                  ["cyber-amber", "Amber"],
                  ["neon-cyan", "Cyan"],
                  ["none", "None"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setEyeGlow(mode)}
                  className={`py-1 px-1.5 text-center text-[10px] uppercase border transition ${
                    eyeGlow === mode
                      ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                      : "bg-canvas-base/50 text-text-slate border-border-subtle hover:text-text-optic"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Wireframe Guides */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] uppercase text-text-slate flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Wireframe Topology
            </span>
            <button
              type="button"
              onClick={() => setShowWireframe(!showWireframe)}
              className={`px-2 py-0.5 text-[10px] uppercase border transition ${
                showWireframe
                  ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                  : "bg-canvas-base/50 text-text-slate border-border-subtle hover:text-text-optic"
              }`}
            >
              {showWireframe ? "ON" : "OFF"}
            </button>
          </div>

          {/* 3D Depth Multiplier Slider */}
          <div className="space-y-1 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between text-[10px]">
              <span>3D Parallax Depth</span>
              <span className="text-text-optic">{depthMultiplier.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={depthMultiplier}
              onChange={(e) => setDepthMultiplier(parseFloat(e.target.value))}
              className="w-full accent-text-optic h-1 bg-canvas-base rounded cursor-pointer"
            />
          </div>

          {/* 3D Perspective Factor Slider */}
          <div className="space-y-1 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between text-[10px]">
              <span>Perspective Factor</span>
              <span className="text-text-optic">{perspectiveFactor.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.8"
              step="0.05"
              value={perspectiveFactor}
              onChange={(e) => setPerspectiveFactor(parseFloat(e.target.value))}
              className="w-full accent-text-optic h-1 bg-canvas-base rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest uppercase text-text-slate/60">
          [ Cursor Following • 3D Procedural SVG • Avatar-Lab Engine ]
        </span>
      </div>
    </div>
  );
}
