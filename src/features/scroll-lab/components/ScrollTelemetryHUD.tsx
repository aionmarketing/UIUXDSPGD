"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScrollLab } from "../context/ScrollContext";
import { Activity, Gauge, Sliders, ArrowUpRight } from "lucide-react";

export function ScrollTelemetryHUD() {
  const { progress, velocity, direction, isScrolling, settings, setSettings, scrollTo } = useScrollLab();
  const [isExpanded, setIsExpanded] = useState(false);

  // Presets
  const applyPreset = (preset: "crisp" | "silk" | "drift") => {
    if (preset === "crisp") {
      setSettings((prev) => ({ ...prev, duration: 0.9, wheelMultiplier: 1.1 }));
    } else if (preset === "silk") {
      setSettings((prev) => ({ ...prev, duration: 1.4, wheelMultiplier: 1.0 }));
    } else if (preset === "drift") {
      setSettings((prev) => ({ ...prev, duration: 2.2, wheelMultiplier: 0.9 }));
    }
  };

  const percent = Math.round(progress * 100);

  return (
    <>
      {/* 1. Global Top Progress Bar with glowing gradient */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-[9999] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>

      {/* 2. Floating Minimal Telemetry Badge (Top Right) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2 font-mono text-[11px]">
        <div className="bg-canvas-well/90 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-3 shadow-2xl text-text-optic">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                isScrolling ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" : "bg-zinc-600"
              }`}
            />
            <span className="text-text-slate tracking-wider">LENIS 1.3</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold">{Math.abs(velocity).toFixed(1)}</span>
            <span className="text-zinc-500 text-[9px]">px/s</span>
          </div>

          <div className="h-3 w-[1px] bg-white/10" />

          <div className="flex items-center gap-1">
            <span className="text-zinc-400">{percent}%</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded-full transition text-zinc-400 hover:text-white"
            title="Abrir Controles e Telemetria de Scroll"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3. Expandable Control Drawer */}
        {isExpanded && (
          <div className="w-80 bg-canvas-well/95 backdrop-blur-xl border border-white/15 p-4 rounded-xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 text-text-optic">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-widest text-text-optic">
                  Scroll Lab HUD
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                GSAP Ticker Sync
              </span>
            </div>

            {/* Readouts Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-black/40 border border-white/5 p-2 rounded">
                <span className="text-zinc-500 block mb-0.5">DIREÇÃO</span>
                <span className="font-bold text-emerald-300">
                  {direction > 0 ? "▼ DESCENDO" : direction < 0 ? "▲ SUBINDO" : "— REPOUSO"}
                </span>
              </div>
              <div className="bg-black/40 border border-white/5 p-2 rounded">
                <span className="text-zinc-500 block mb-0.5">DURAÇÃO</span>
                <span className="font-bold text-cyan-300">{settings.duration.toFixed(1)}s</span>
              </div>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                Perfis de Inércia (Amortecimento)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => applyPreset("crisp")}
                  className={`py-1 px-2 rounded border text-center transition ${
                    settings.duration === 0.9
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                      : "border-white/10 hover:border-white/30 text-zinc-400"
                  }`}
                >
                  Crisp (0.9s)
                </button>
                <button
                  onClick={() => applyPreset("silk")}
                  className={`py-1 px-2 rounded border text-center transition ${
                    settings.duration === 1.4
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                      : "border-white/10 hover:border-white/30 text-zinc-400"
                  }`}
                >
                  Silk (1.4s)
                </button>
                <button
                  onClick={() => applyPreset("drift")}
                  className={`py-1 px-2 rounded border text-center transition ${
                    settings.duration === 2.2
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                      : "border-white/10 hover:border-white/30 text-zinc-400"
                  }`}
                >
                  Drift (2.2s)
                </button>
              </div>
            </div>

            {/* Anchor Jump Buttons */}
            <div>
              <span className="text-[10px] uppercase text-zinc-400 font-bold block mb-1.5">
                Salto Suave para Seções
              </span>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <button
                  onClick={() => scrollTo("#hero")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-left transition text-zinc-300"
                >
                  01. Hero Editorial
                </button>
                <button
                  onClick={() => scrollTo("#parallax-archive")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-left transition text-zinc-300"
                >
                  02. Parallax Archive
                </button>
                <button
                  onClick={() => scrollTo("#pinned-lookbook")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-left transition text-zinc-300"
                >
                  03. Pinned Runway
                </button>
                <button
                  onClick={() => scrollTo("#forensic-zoom")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-left transition text-zinc-300"
                >
                  04. Forensic Lens
                </button>
                <button
                  onClick={() => scrollTo("#sticky-audit")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-left transition text-zinc-300 col-span-2"
                >
                  05. Split Audit Checkpoint
                </button>
              </div>
            </div>

            {/* Comparison Links */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
              <Link
                href="/lab/storefront"
                className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300 transition"
              >
                <span>Testar Storefront com Lenis</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="flex items-center justify-between px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-zinc-400 hover:text-white transition"
              >
                <span>Voltar à Home Oficial (Nativo)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
