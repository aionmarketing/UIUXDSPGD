"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { TAXONOMY_BRANDS } from "@/features/seller-pwa/taxonomy";

interface FeaturedBrand {
  name: string;
  logo: string;
  isPng?: boolean;
  isInverted?: boolean;
  tagline: string;
}

const FEATURED_BRANDS: FeaturedBrand[] = [
  {
    name: "Supreme",
    logo: "/brand-logos/supreme.svg",
    isInverted: false,
    tagline: "New York Skate & Streetwear",
  },
  {
    name: "Stüssy",
    logo: "/brand-logos/stussy.svg",
    isInverted: true,
    tagline: "California Surf & Tribe",
  },
  {
    name: "Arc'teryx",
    logo: "/brand-logos/arcteryx.svg",
    isInverted: true,
    tagline: "Technical Alpine Archive",
  },
  {
    name: "Bape",
    logo: "/brand-logos/bape.svg",
    isInverted: true,
    tagline: "A Bathing Ape Tokyo",
  },
  {
    name: "Palace",
    logo: "/brand-logos/palace.png",
    isPng: true,
    isInverted: false,
    tagline: "London Skateboards",
  },
  {
    name: "Nike ACG",
    logo: "/brand-logos/nike-acg.svg",
    isInverted: true,
    tagline: "All Conditions Gear",
  },
  {
    name: "Oakley",
    logo: "/brand-logos/oakley.svg",
    isInverted: true,
    tagline: "Y2K Eyewear & Outerwear",
  },
  {
    name: "The North Face",
    logo: "/brand-logos/the-north-face.svg",
    isInverted: false,
    tagline: "Expedition & Summit Series",
  },
];

export function BrandsGrid() {
  const otherBrands = TAXONOMY_BRANDS.filter(
    (b) => !FEATURED_BRANDS.some((fb) => fb.name.toLowerCase() === b.toLowerCase())
  );

  return (
    <section id="marcas" className="w-full bg-canvas-base py-16 px-4 sm:px-6 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
              <Sparkles className="w-3 h-3 text-text-optic" />
              <span>MARCAS EM DESTAQUE // SELEÇÃO CURADA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-mono tracking-tight text-text-optic">
              Marcas de Arquivo &amp; Streetwear
            </h2>
            <p className="text-xs sm:text-sm text-text-platinum font-mono max-w-2xl">
              Explore nosso acervo curado pelas marcas mais influentes da cultura urbana, design funcional e passarela global.
            </p>
          </div>
        </div>

        {/* Featured Brands Grid with Authentic Logos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURED_BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/produtos?brand=${encodeURIComponent(brand.name)}`}
              className="group relative bg-canvas-well border border-border-subtle p-6 flex flex-col justify-between min-h-[170px] sm:min-h-[190px] overflow-hidden hover:border-text-optic transition-all duration-300"
            >
              {/* Top Meta info */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-mono tracking-widest text-text-slate uppercase group-hover:text-text-platinum transition-colors">
                  ACERVO AUTÊNTICO
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-slate group-hover:text-text-optic group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              {/* Logo Area */}
              <div className="my-auto py-3 flex items-center justify-center">
                <div className="relative w-full h-14 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={brand.logo}
                    alt={`${brand.name} Logo`}
                    className={`max-h-12 max-w-[140px] object-contain transition-all duration-300 group-hover:scale-110 ${
                      brand.isInverted
                        ? "invert brightness-150 contrast-125"
                        : "drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    }`}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Bottom Label & Tagline */}
              <div className="pt-2 border-t border-border-subtle/80 flex flex-col gap-0.5 z-10">
                <span className="font-mono font-bold text-sm text-text-optic uppercase tracking-wider">
                  {brand.name}
                </span>
                <span className="text-[11px] font-mono text-text-slate truncate">
                  {brand.tagline}
                </span>
              </div>

              {/* Subtle ambient hover sheen */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* All Other Brands Archive Pills */}
        <div className="bg-canvas-well border border-border-subtle p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-text-optic">
              Outras Casas de Moda &amp; Estilistas do Acervo
            </span>
            <span className="font-mono text-[10px] text-text-slate uppercase">
              {otherBrands.length} MARCAS ADICIONAIS
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {otherBrands.map((brand) => (
              <Link
                key={brand}
                href={`/produtos?brand=${encodeURIComponent(brand)}`}
                className="px-3 py-2 bg-canvas-base border border-border-subtle hover:border-text-optic hover:text-text-optic text-text-platinum font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>{brand}</span>
                <ArrowUpRight className="w-3 h-3 text-text-slate" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
