import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/features/storefront";

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
    <div className="min-h-screen flex flex-col bg-canvas-base bg-blueprint-grid bg-ambient-specular text-text-optic selection:bg-text-optic selection:text-canvas-base relative">
      {/* 1. TOP NAVIGATION HEADER (Restored to top with Glassmorphism) */}
      <Header />

      {/* 2. MAIN CONTENT AREA (Full Width with Bottom Respiration) */}
      <main className="flex-1 min-w-0 pb-16">{children}</main>

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
