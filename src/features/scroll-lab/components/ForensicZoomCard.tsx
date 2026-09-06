"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, CheckCircle2, Crosshair, Terminal } from "lucide-react";

export function ForensicZoomCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.92, 1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [8, 0, -6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  };

  return (
    <section
      id="forensic-zoom"
      ref={containerRef}
      className="relative py-28 px-6 sm:px-12 bg-canvas-base border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
            <Crosshair className="w-3.5 h-3.5 animate-spin" />
            <span>04 // LENTE FORENSE COM INERÇÃO ÓPTICA</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            MICROSCÓPIO DE FIBRA & <br />
            AUDITORIA ESPECTRAL
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-400 font-mono leading-relaxed">
          Passe o cursor sobre a área de tecido para inspecionar a trama têxtil ampliada em tempo
          real. O container reage suavemente à curvatura do scroll.
        </p>
      </div>

      {/* Main 3D Card Container */}
      <motion.div
        style={{ scale, rotateX, perspective: 1200 }}
        className="max-w-5xl mx-auto bg-canvas-well border border-white/15 rounded-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] will-change-transform"
      >
        {/* Card Header Bar */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">FEIXE ELETRÔNICO // 50X AMPLIAÇÃO</span>
            <span className="text-zinc-500">ISO-17025 CERT</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>TRAMA: SARJA 3x1 QUEBRADA</span>
            <span>GSM: 485 g/m²</span>
          </div>
        </div>

        {/* Interactive Lens Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Canvas Inspection Area */}
          <div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-7 relative h-96 sm:h-[480px] bg-black overflow-hidden cursor-crosshair group"
          >
            {/* Background Texture Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80&w=1200"
              alt="Microscopic Weave Texture"
              className="w-full h-full object-cover grayscale contrast-150"
            />

            {/* Magnifier Reticle Follower */}
            {isHovered && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,0.5)] overflow-hidden backdrop-brightness-150 backdrop-contrast-200"
                style={{
                  left: `${lensPos.x}%`,
                  top: `${lensPos.y}%`,
                }}
              >
                {/* Simulated inner high zoom texture */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=90&w=1600"
                  alt="Zoom"
                  className="w-[300%] h-[300%] max-w-none absolute grayscale contrast-200"
                  style={{
                    left: `${-lensPos.x * 2}%`,
                    top: `${-lensPos.y * 2}%`,
                  }}
                />

                {/* Reticle Crosshair overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-emerald-400/50" />
                  <div className="h-full w-[1px] bg-emerald-400/50 absolute" />
                  <div className="w-4 h-4 rounded-full border border-emerald-400/80" />
                </div>

                <div className="absolute bottom-2 left-2 text-[8px] font-mono bg-black/80 px-1 py-0.5 text-emerald-300 rounded">
                  POS: {Math.round(lensPos.x)}:{Math.round(lensPos.y)}
                </div>
              </div>
            )}

            {/* Overlay Instructions if not hovered */}
            {!isHovered && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <div className="px-4 py-2 bg-black/80 border border-white/20 rounded-full font-mono text-xs text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>PASSE O MOUSE PARA ATIVAR O RETÍCULO FORENSE</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Forensic Telemetry Panel */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-canvas-well border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-zinc-400">LAUDO DIGITAL</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 100% AUTÊNTICO
                </span>
              </div>

              {/* Spectral Meters */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">INTEGRIDADE DO FIO DE ALGODÃO</span>
                    <span className="text-white font-bold">99.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[99.4%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">RESISTÊNCIA A TRAÇÃO MIL-SPEC</span>
                    <span className="text-white font-bold">98.1%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[98.1%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">ESPECTRO DE TINGIMENTO ÍNDIGO</span>
                    <span className="text-white font-bold">97.6%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 w-[97.6%]" />
                  </div>
                </div>
              </div>

              {/* Diagnostic Terminal Output */}
              <div className="p-3 bg-black/60 border border-white/10 rounded font-mono text-[11px] text-zinc-400 space-y-1">
                <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DIAGNÓSTICO_FORENSE_TERMINAL</span>
                </div>
                <div>&gt; NENHUM POLIÉSTER SINTÉTICO INDESEJADO</div>
                <div>&gt; PONTOS DE COSTURA: 14 PONTOS / POLEGADA</div>
                <div>&gt; HARDWARE DE LATÃO ZÍPER TALON MATCH CONFIRMADO</div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">HASH: 0x8a92...fc11</span>
              <span className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded cursor-pointer transition">
                BAIXAR LAUDO PDF
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
