import React from "react";
import Link from "next/link";
import { Header, Hero, NovidadesGrid, BrandsGrid, Footer } from "@/features/storefront";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function StorefrontLenisMirrorPage() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-canvas-base text-text-optic">
      {/* Informative Test Banner */}
      <div className="w-full bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-emerald-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">STOREFRONT COM ROLAGEM LENIS ATIVA (TESTE ISOLADO)</span>
          <span className="hidden md:inline text-emerald-500/70">•</span>
          <span className="hidden md:inline text-zinc-400">
            Compare a inércia da roda do mouse com o storefront padrão
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/lab/scroll"
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition flex items-center gap-1 text-[11px]"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar ao Scroll Lab
          </Link>
          <Link
            href="/"
            className="px-2.5 py-1 bg-emerald-400 text-black font-bold rounded transition text-[11px]"
          >
            Ver Storefront Nativo (Sem Lenis)
          </Link>
        </div>
      </div>

      <Header />

      <main className="flex-1">
        {/* 1. Hero Section with 3D Gorilla Canvas in Liquid Glass */}
        <Hero />

        {/* 2. Novidades Product Grid */}
        <NovidadesGrid />

        {/* 3. Por Marca Grid */}
        <BrandsGrid />
      </main>

      <Footer />
    </div>
  );
}
