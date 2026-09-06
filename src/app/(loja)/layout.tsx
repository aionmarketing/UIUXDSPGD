import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/features/storefront";

export const metadata: Metadata = {
  title: "Desapegado // Monolith Onyx Storefront",
  description:
    "Acervo curado de moda circular, arquivo de passarela e autenticação forense digital.",
};

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas-base text-text-optic selection:bg-text-optic selection:text-canvas-base">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />

      {/* Dev Dual-UI Route Switcher */}
      <aside className="fixed bottom-4 left-4 z-50 bg-canvas-well/95 border border-border-subtle p-1 flex items-center gap-1 text-[11px] font-mono shadow-2xl">
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
      </aside>
    </div>
  );
}
