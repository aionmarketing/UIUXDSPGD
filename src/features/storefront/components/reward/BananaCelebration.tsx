"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkle, Check } from "@phosphor-icons/react";
import { useRewardStore } from "../../stores/useRewardStore";
import { useReducedMotion } from "@/lib/hooks";

/**
 * DESAPEGO // BANANA REWARD CELEBRATION (Phase 9)
 * 
 * Physics-driven banana shower:
 * - Gravity acceleration, angular rotation, aerodynamic drift
 * - Controlled particle pool (capped at 35 physical entities)
 * - Data-driven: receives bananaCount dynamically
 * - "O GORILA ESTÁ RECOMPENSANDO VOCÊ"
 */

interface BananaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
  driftPhase: number;
  driftFreq: number;
}

export function BananaCelebration() {
  const isCelebrating = useRewardStore((state) => state.isCelebrating);
  const celebrationCount = useRewardStore((state) => state.celebrationCount);
  const finishCelebration = useRewardStore((state) => state.finishCelebration);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayedCount, setDisplayedCount] = useState(0);
  const isReducedMotion = useReducedMotion();
  const activeCount = isReducedMotion ? celebrationCount : displayedCount;

  // Close on Escape key
  useEffect(() => {
    if (!isCelebrating) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finishCelebration();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCelebrating, finishCelebration]);

  // Counter animation
  useEffect(() => {
    if (!isCelebrating) return;

    if (isReducedMotion) {
      const autoTimer = setTimeout(() => {
        finishCelebration();
      }, 4800);
      return () => clearTimeout(autoTimer);
    }

    const duration = 1800; // ms
    const startTime = performance.now();
    let frameId: number;

    const animateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedCount(Math.round(eased * celebrationCount));

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      }
    };

    frameId = requestAnimationFrame(animateCount);

    // Auto-dismiss after 4.8 seconds
    const autoTimer = setTimeout(() => {
      finishCelebration();
    }, 4800);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(autoTimer);
    };
  }, [isCelebrating, celebrationCount, finishCelebration, isReducedMotion]);

  // Physical Falling Bananas Canvas Loop
  useEffect(() => {
    if (!isCelebrating) return;

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

    // Pool size capped at 36 objects
    const poolSize = Math.min(36, Math.max(16, Math.floor(celebrationCount * 1.5)));
    const bananas: BananaParticle[] = [];

    for (let i = 0; i < poolSize; i++) {
      bananas.push({
        x: Math.random() * width,
        y: -50 - Math.random() * (height * 0.8), // staggered launch above screen
        vx: (Math.random() - 0.5) * 1.8,
        vy: Math.random() * 2 + 3, // initial speed
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        scale: Math.random() * 0.5 + 0.75,
        driftPhase: Math.random() * Math.PI * 2,
        driftFreq: Math.random() * 0.04 + 0.02,
      });
    }

    const gravity = 0.16; // px / frame^2

    // Helper to draw a sleek stylized curved banana
    const drawBanana = (x: number, y: number, rot: number, scale: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(scale, scale);

      // Banana crescent curve
      ctx.beginPath();
      ctx.moveTo(-18, -12);
      ctx.bezierCurveTo(-5, -20, 15, -16, 26, 4);
      ctx.bezierCurveTo(24, 7, 20, 9, 16, 8);
      ctx.bezierCurveTo(8, -6, -6, -8, -16, -2);
      ctx.closePath();

      // Golden Specular Gradient
      const grad = ctx.createLinearGradient(-18, -15, 26, 8);
      grad.addColorStop(0, "#fbbf24");
      grad.addColorStop(0.6, "#f59e0b");
      grad.addColorStop(1, "#d97706");
      ctx.fillStyle = grad;
      ctx.fill();

      // Specular spine highlight
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Stem tips
      ctx.fillStyle = "#78350f";
      ctx.fillRect(-20, -14, 3, 4);
      ctx.fillRect(25, 4, 3, 3);

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bananas.length; i++) {
        const b = bananas[i];
        b.vy += gravity;
        b.y += b.vy;
        b.driftPhase += b.driftFreq;
        b.x += b.vx + Math.sin(b.driftPhase) * 1.2;
        b.rot += b.vRot;

        drawBanana(b.x, b.y, b.rot, b.scale);

        // Recycle banana if it fell through bottom
        if (b.y > height + 60) {
          b.y = -60 - Math.random() * 120;
          b.x = Math.random() * width;
          b.vy = Math.random() * 2 + 2.5;
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isCelebrating, celebrationCount]);

  if (!isCelebrating) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="banana-reward-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      {/* 1. Falling Bananas Canvas (Full Viewport) - disabled if prefers-reduced-motion */}
      {!isReducedMotion ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
      ) : null}

      {/* 2. Central Liquid Glass Gorilla Reward Card */}
      <div className="relative z-20 w-full max-w-lg bg-[#0c0e14]/90 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-black/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] animate-in zoom-in-95 duration-250">
        {/* Specular Top Bar Accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Mascot & Badge */}
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            🍌
          </div>

          <div className="inline-flex items-center gap-2 bg-canvas-base border border-white/15 px-3 py-1 text-xs font-mono tracking-widest text-amber-400 uppercase">
            <Sparkle weight="light" className="w-3.5 h-3.5" />
            <span>PROTOCOLO DE RECOMPENSA // GORILA LAB</span>
          </div>

          <h2 id="banana-reward-title" className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-tight text-text-optic">
            O Gorila Está Recompensando Você
          </h2>

          <p className="text-xs sm:text-sm font-mono text-text-platinum max-w-sm mx-auto leading-relaxed">
            Sua aquisição gerou dividendos biológicos no acervo. Bananas creditadas instantaneamente em seu cofre.
          </p>
        </div>

        {/* Dynamic Big Counter Display */}
        <div className="bg-canvas-well border border-border-subtle p-5 font-mono space-y-1">
          <span className="text-[10px] text-text-slate uppercase tracking-widest block">
            RECOMPENSA ACUMULADA NESTE DROP
          </span>
          <div className="text-4xl sm:text-5xl font-black text-amber-400 flex items-center justify-center gap-2 tabular-nums">
            <span>+{activeCount}</span>
            <span className="text-2xl">🍌</span>
          </div>
          <span className="text-[11px] text-text-slate block">
            R$ 50 gastos = 1 banana • Cupom 10% = 10 bananas bônus
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={finishCelebration}
            className="w-full h-12 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors cursor-pointer shadow-xl focus-visible:ring-2 focus-visible:ring-amber-400 focus:outline-none"
          >
            <span>COLETAR E PROSSEGUIR</span>
            <Check weight="bold" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
