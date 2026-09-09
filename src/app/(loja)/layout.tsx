import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Header,
  Footer,
  JungleEnvironment,
  MonkeyAppearances,
  BananaCelebration,
} from "@/features/storefront";

export const metadata: Metadata = {
  title: "Desapegado // Acervo de Streetwear & Luxo",
  description:
    "Compre e venda peças raras de streetwear, arquivo de passarela e sneakers com garantia de originalidade.",
};

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-base bg-blueprint-grid bg-ambient-jungle text-text-optic selection:bg-text-optic selection:text-canvas-base relative">
      {/* Skip to main content link for keyboard and screen reader accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-text-optic focus:text-canvas-base focus:font-mono focus:text-xs focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        Pular para o conteúdo principal
      </a>

      {/* 0. ATMOSPHERIC JUNGLE HABITAT LAYERS (Background, Midground, Foreground) */}
      <JungleEnvironment />

      {/* 0.1 OCCASIONAL MONKEY / APE MICRO-APPEARANCES (Phase 5) */}
      <MonkeyAppearances />

      {/* 0.2 PHYSICAL BANANA CELEBRATION MODAL OVERLAY (Phase 9) */}
      <BananaCelebration />

      {/* 1. TOP NAVIGATION HEADER (Restored to top with Glassmorphism) */}
      <Header />

      {/* 2. MAIN CONTENT AREA (Full Width with Bottom Respiration) */}
      <main id="main-content" className="flex-1 min-w-0 pb-16">{children}</main>

      {/* 3. STOREFRONT FOOTER */}
      <Footer />

      {/* 4. DEV DUAL-UI ROUTE SWITCHER (Docked cleanly in bottom-right with glassmorphism) */}
      <aside className="fixed bottom-4 right-4 z-40 bg-[#0c0e14]/85 backdrop-blur-xl border border-white/20 p-1 hidden sm:flex items-center gap-1 text-[11px] font-mono shadow-2xl shadow-black/80">
        <Link
          href="/"
          className="px-2.5 py-1 bg-text-optic text-canvas-base font-bold transition hover:bg-neutral-200"
        >
          Storefront
        </Link>
        <Link
          href="/admin/produtos"
          className="px-2.5 py-1 text-text-slate hover:text-text-optic transition"
        >
          Seller PWA
        </Link>
        <Link
          href="/preview"
          className="px-2.5 py-1 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition flex items-center gap-1 font-bold"
        >
          ✨ Glass Lab
        </Link>
      </aside>
    </div>
  );
}
