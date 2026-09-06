"use client";

import React from "react";
import Link from "next/link";
import { useScrollLab } from "../context/ScrollContext";
import { ArrowUp, ArrowUpRight, Cpu, Layers, Check, ShieldCheck } from "lucide-react";

export function ScrollBenchmarkFooter() {
  const { scrollTo } = useScrollLab();

  return (
    <footer className="relative py-24 px-6 sm:px-12 bg-canvas-base border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono text-emerald-400 mb-2">
              06 // BENCHMARK COMPARATIVO & CONCLUSÃO
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              NATIVO VS. LENIS VIRTUAL ENGINE
            </h2>
          </div>

          <button
            onClick={() => scrollTo(0, { duration: 1.8 })}
            className="px-6 py-3 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-400 transition self-start md:self-auto rounded"
          >
            <ArrowUp className="w-4 h-4" />
            VOLTAR AO TOPO (INÉRCIA SUAVE)
          </button>
        </div>

        {/* Technical Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Native Browser Scroll */}
          <div className="p-8 rounded-2xl bg-canvas-well border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs text-zinc-400">
              <span>ROLAGEM NATIVA DO NAVEGADOR</span>
              <span className="text-zinc-500">DEFAULT</span>
            </div>
            <ul className="space-y-3 font-mono text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">✕</span>
                <span>Interpolação de roda em degraus abruptos (jumpy steps no mouse comum).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">✕</span>
                <span>Descasamento de frame rate entre GSAP/Three.js e renderização do browser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-600">✕</span>
                <span>Diferenças agressivas de aceleração entre Windows, macOS e Linux.</span>
              </li>
            </ul>
          </div>

          {/* Lenis Engine */}
          <div className="p-8 rounded-2xl bg-canvas-well border border-emerald-500/40 shadow-[0_0_30px_rgba(52,211,153,0.08)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
              <span className="text-emerald-400 font-bold">MOTOR LENIS + GSAP RAF TICKER</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">ATIVO NESTE LAB</span>
            </div>
            <ul className="space-y-3 font-mono text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Interpolação linear contínua (lerp) com inércia cinemática customizável.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Sincronização 1:1 com ScrollTrigger em ciclo de RAF de 60Hz a 144Hz.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Parallax e pinning perfeitos sem tremor ou lag de sincronia de viewport.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Quer testar como o catálogo oficial se comporta com o Lenis?
            </h4>
            <p className="text-sm text-zinc-400 font-mono">
              Criamos uma cópia espelho do Storefront oficial renderizada sob o motor Lenis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/lab/storefront"
              className="px-5 py-2.5 bg-emerald-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition rounded flex items-center gap-2"
            >
              <span>Abrir Storefront com Lenis</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition rounded"
            >
              Voltar à Loja Principal (Nativa)
            </Link>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>DESAPEGADO // SCROLL LAB PROTOCOL v1.3.26</div>
          <div className="flex items-center gap-4">
            <span>BRANCH: FEATURE/LENIS-SCROLL-LAB</span>
            <span>•</span>
            <span className="text-emerald-400">MAIN INTACTA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
