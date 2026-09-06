"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "@phosphor-icons/react";
import { TAXONOMY_CATEGORIES, TAXONOMY_SUBCATEGORIES } from "@/features/seller-pwa/taxonomy";

export function Footer() {
  return (
    <footer className="w-full bg-canvas-well border-t border-border-subtle font-mono text-xs text-text-slate">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-text-optic rotate-45" />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-text-optic">
              DESAPEGADO
            </span>
          </div>
          <p className="text-[11px] text-text-platinum leading-relaxed font-sans">
            Plataforma curada de streetwear, passarela e arquivo vintage. Autenticação forense digital com garantia vitalícia de originalidade.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400">
            <ShieldCheck weight="light" className="w-4 h-4" />
            <span>100% DE PEÇAS AUTÊNTICAS</span>
          </div>
        </div>

        {/* Categories Link Columns */}
        {TAXONOMY_CATEGORIES.map((cat) => (
          <div key={cat} className="space-y-3">
            <h4 className="text-text-optic font-bold uppercase tracking-wider text-xs border-b border-border-subtle pb-1">
              {cat}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {TAXONOMY_SUBCATEGORIES[cat].slice(0, 6).map((sub) => (
                <li key={sub}>
                  <Link
                    href={`/produtos?category=${encodeURIComponent(cat)}&subcategory=${encodeURIComponent(sub)}`}
                    className="hover:text-text-optic transition-colors block truncate"
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Lower Copyright & Legal Bar */}
      <div className="border-t border-border-subtle py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center gap-4 text-text-slate">
            <span>© 2026 DESAPEGADO.COM</span>
            <span>SÃO PAULO • BRASIL</span>
          </div>

          <div className="flex items-center gap-6 text-text-platinum">
            <Link href="/addclothes" className="hover:text-text-optic flex items-center gap-1 font-bold">
              <span>Painel de Curadoria // PWA</span>
              <ArrowUpRight weight="light" className="w-3 h-3" />
            </Link>
            <Link href="#" className="hover:text-text-optic">
              Termos de Uso &amp; Autenticidade
            </Link>
            <Link href="#" className="hover:text-text-optic">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
