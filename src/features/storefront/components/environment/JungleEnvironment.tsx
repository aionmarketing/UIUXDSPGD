"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion, useIsMobile } from "@/lib/hooks";

/**
 * DESAPEGO // DIGITAL JUNGLE ARCHIVE
 * Layered Atmospheric Jungle Habitat Environment
 * 
 * - Layer 0 (Background): Subtle bioluminescent canopy spores & distant silhouettes
 * - Layer 1 (Midground): Organic tropical palm & monstera fronds at peripheral margins
 * - Layer 3 (Foreground): Depth-of-field blurred peripheral foliage (desktop only)
 * 
 * Strict Performance Guardrails:
 * - pointer-events: none across all layers
 * - Canvas particle pool capped (25 on desktop, 10 on mobile)
 * - Auto-pauses animation on tab blur or prefers-reduced-motion
 * - High z-index separation so commercial content is 100% unobstructed
 */

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export function JungleEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Atmospheric Spores / Dust Particles Canvas Simulation
  useEffect(() => {
    if (isReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = isMobile ? 10 : 25;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedY: -(Math.random() * 0.25 + 0.08),
        speedX: (Math.random() - 0.5) * 0.18,
        opacity: Math.random() * 0.4 + 0.1,
        fadeSpeed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    let isDocumentVisible = !document.hidden;
    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = () => {
      if (!isDocumentVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity <= 0.08 || p.opacity >= 0.45) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw soft glowing emerald/amber spore
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52, 211, 153, ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isReducedMotion, isMobile]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. LAYER 0: ATMOSPHERIC CHYLOROPHYLL SPORES (Canvas) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* 2. LAYER 0: DISTANT CANOPY SILHOUETTES (Deep Nocturnal Foliage) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-screen">
        {/* Top-Left Distant Canopy */}
        <svg
          viewBox="0 0 600 400"
          className="absolute -top-10 -left-10 w-[380px] sm:w-[540px] text-emerald-950 fill-current animate-botanical-breathe"
        >
          <path d="M0,0 Q120,40 240,10 Q340,-20 480,40 Q540,60 600,120 L600,0 Z" />
          <path d="M0,80 Q160,140 280,70 Q420,10 520,90 Q580,140 600,200 L600,0 Z" opacity="0.6" />
        </svg>

        {/* Top-Right Distant Canopy fronds */}
        <svg
          viewBox="0 0 600 400"
          className="absolute -top-14 -right-14 w-[380px] sm:w-[580px] text-emerald-950 fill-current animate-botanical-breathe"
          style={{ animationDelay: "4s" }}
        >
          <path d="M600,0 Q480,50 360,15 Q240,-15 100,50 Q40,80 0,140 L0,0 Z" />
          <path d="M600,70 Q460,150 320,80 Q180,20 80,110 Q20,160 0,220 L0,0 Z" opacity="0.6" />
        </svg>
      </div>

      {/* 3. LAYER 1: MIDGROUND TROPICAL FOLIAGE (Framing Peripheral Viewport) */}
      {/* Left Margin Hanging Palm & Vine Cluster */}
      <div className="absolute top-[18%] -left-12 sm:-left-8 pointer-events-none z-10 opacity-[0.22] animate-botanical-sway">
        <svg
          width="240"
          height="520"
          viewBox="0 0 240 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          {/* Main Hanging Stem */}
          <path
            d="M20,0 C35,120 15,240 45,360 C65,440 90,490 110,520"
            stroke="#0d2818"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Tropical Palm Fronds radiating outward */}
          <path
            d="M22,60 C70,50 140,80 180,120 C140,110 80,95 24,75 Z"
            fill="#081c10"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <path
            d="M26,130 C90,115 170,145 220,200 C165,185 100,165 28,145 Z"
            fill="#0a2214"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <path
            d="M28,210 C85,200 160,230 205,290 C155,270 95,250 32,225 Z"
            fill="#06190e"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <path
            d="M36,290 C90,285 150,320 180,380 C135,355 85,335 40,305 Z"
            fill="#092012"
          />
          <path
            d="M48,380 C95,385 140,420 165,470 C125,450 85,430 52,395 Z"
            fill="#06180c"
          />
        </svg>
      </div>

      {/* Right Margin Monstera & Hanging Vine */}
      <div className="absolute top-[42%] -right-10 sm:-right-6 pointer-events-none z-10 opacity-[0.20] animate-botanical-sway-reverse">
        <svg
          width="260"
          height="480"
          viewBox="0 0 260 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          {/* Main Stem */}
          <path
            d="M240,0 C220,140 245,260 215,380 C195,440 170,470 150,480"
            stroke="#0d2818"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Monstera Cut Leaf Silhouette */}
          <path
            d="M236,80 C175,70 95,110 50,170 C95,155 160,135 232,95 Z"
            fill="#092213"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <path
            d="M232,170 C160,165 80,210 35,280 C90,255 160,230 228,185 Z"
            fill="#071b0f"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
          <path
            d="M224,260 C165,265 95,315 60,390 C105,360 165,330 220,275 Z"
            fill="#0a2415"
          />
          <path
            d="M210,350 C165,360 115,405 85,460 C125,435 165,410 205,365 Z"
            fill="#05170d"
          />
        </svg>
      </div>

      {/* 4. LAYER 2: FOREGROUND BOKEH LEAVES (Peripheral Camera Focus - Hidden on Mobile) */}
      {!isMobile && (
        <>
          {/* Bottom-Left Out-of-Focus Foreground Leaf */}
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 pointer-events-none z-30 opacity-[0.18]"
            style={{ filter: "blur(16px)" }}
          >
            <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
              <path
                d="M0,300 C80,240 180,180 280,120 C220,180 140,240 0,300 Z"
                fill="#0a2a16"
              />
              <path
                d="M30,300 C110,210 210,140 300,60 C230,140 150,220 30,300 Z"
                fill="#061e10"
              />
            </svg>
          </div>

          {/* Bottom-Right Out-of-Focus Foreground Frond */}
          <div
            className="absolute -bottom-16 -right-16 w-80 h-80 pointer-events-none z-30 opacity-[0.16]"
            style={{ filter: "blur(18px)" }}
          >
            <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
              <path
                d="M300,300 C220,230 120,170 20,110 C80,170 160,230 300,300 Z"
                fill="#082413"
              />
              <path
                d="M270,300 C190,200 90,130 0,50 C70,130 150,210 270,300 Z"
                fill="#051a0d"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
