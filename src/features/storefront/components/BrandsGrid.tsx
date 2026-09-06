"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Tag } from "lucide-react";
import { TAXONOMY_BRANDS } from "@/features/seller-pwa/taxonomy";

export function BrandsGrid() {
  return (
    <section id="marcas" className="w-full bg-canvas-base py-16 px-4 sm:px-6 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
              <Tag className="w-3 h-3 text-text-optic" />
              <span>TAXONOMIA // {TAXONOMY_BRANDS.length} CASAS DE MODA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-mono tracking-tight text-text-optic">
              Por Marca
            </h2>
            <p className="text-xs sm:text-sm text-text-platinum font-mono">
              Explore o catálogo filtrado pelas marcas mais relevantes de vanguarda e arquivo.
            </p>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {TAXONOMY_BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/produtos?brand=${encodeURIComponent(brand)}`}
              className="group p-4 bg-canvas-well border border-border-subtle hover:border-text-optic hover:bg-canvas-base flex flex-col justify-between min-h-[90px] transition-all"
            >
              <div className="flex items-center justify-between text-text-slate group-hover:text-text-optic transition-colors">
                <span className="text-[10px] font-mono">ACERVO</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-mono font-bold text-sm text-text-platinum group-hover:text-text-optic truncate transition-colors uppercase">
                {brand}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
