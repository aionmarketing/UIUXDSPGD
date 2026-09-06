"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Sparkles, Cpu, Layers } from "lucide-react";

export function KineticHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Multi-plane parallax translations
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const subY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[105vh] flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-canvas-base border-b border-white/10"
    >
      {/* Background Ambient Glow & Specular Watermark */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
      >
        <div className="absolute w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -top-20 -left-20" />
        <div className="absolute w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] top-1/2 -right-20" />

        <div className="text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none whitespace-nowrap uppercase font-mono">
          AUTHENTIC // 2026
        </div>
      </motion.div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-none shadow-[0_0_10px_#34d399]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-400">
            EXPERIMENT // SCROLL KINETICS
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            VIRTUALIZED LENIS ENGINE
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            GSAP HARDWARE RAF (120HZ)
          </span>
        </div>
      </div>

      {/* Main Kinetic Typography */}
      <motion.div
        style={{ y: titleY, scale, opacity }}
        className="relative z-10 my-auto py-12 max-w-6xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-xs font-mono text-emerald-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INÉRCIA BIOMECÂNICA DE FLUIDEZ CONTÍNUA</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-[0.9]">
          MONOLITH <br />
          <span className="bg-gradient-to-r from-zinc-200 via-white to-zinc-500 bg-clip-text text-transparent">
            ONYX LAB.
          </span>
        </h1>

        <motion.p
          style={{ y: subY }}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-zinc-400 max-w-2xl font-light leading-relaxed"
        >
          Experimentação de alta fidelidade visual com rolagem inercial, camadas de
          profundidade tridimensional e telemetria tátil em moda de arquivo circular.
        </motion.p>
      </motion.div>

      {/* Bottom Control & Scroll Indicator */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-6 border-t border-white/10 pt-6">
        <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
          <div>
            <span className="text-zinc-600 block text-[9px]">TAXONOMIA</span>
            <span>MODA CIRCULAR FORENSE</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div>
            <span className="text-zinc-600 block text-[9px]">SISTEMA</span>
            <span className="text-emerald-400">NEXT.JS 16 + LENIS</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span>ROLE PARA ACIONAR A INÉRCIA</span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ArrowDown className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
