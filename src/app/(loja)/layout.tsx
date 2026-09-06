import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontSidebar, Footer } from "@/features/storefront";

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
    <div className="min-h-screen flex flex-col bg-canvas-base text-text-optic selection:bg-text-optic selection:text-canvas-base">
      <StorefrontSidebar />
      <div className="flex-1 min-w-0 flex flex-col lg:pl-[72px]">
        <main className="flex-1 min-w-0">{children}</main>
        <Footer />
      </div>

      {/* Dev Dual-UI Route Switcher - Positioned bottom-right to prevent sidebar collision */}
      <aside className="fixed bottom-4 right-4 z-40 bg-canvas-well/95 border border-border-subtle p-1 hidden sm:flex items-center gap-1 text-[11px] font-mono shadow-2xl">
        <Link
          href="/"
          className="px-2.5 py-1 bg-text-optic text-canvas-base font-bold transition"
        >
          Storefront (desapegado.com)
        </Link>
        <Link
          href="/admin/produtos"
          className="px-2.5 py-1 text-text-slate hover:text-text-optic transition"
        >
          Seller PWA (/admin/produtos)
        </Link>
        <Link
          href="/preview"
          className="px-2.5 py-1 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition flex items-center gap-1 font-bold"
        >
          ✨ Glass Lab (/preview)
        </Link>
      </aside>
    </div>
  );
}
