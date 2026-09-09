"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkle, CaretDown } from "@phosphor-icons/react";
import { TAXONOMY_BRANDS } from "@/features/seller-pwa/taxonomy";

interface FeaturedBrand {
  name: string;
  logo: string;
  isPng?: boolean;
  isInverted?: boolean;
  tagline: string;
  provenance: string;
}

const FEATURED_BRANDS: FeaturedBrand[] = [
  {
    name: "Supreme",
    logo: "/brand-logos/supreme.svg",
    isInverted: false,
    tagline: "Downtown NYC Skate & Street Culture",
    provenance: "New York, 1994",
  },
  {
    name: "Stüssy",
    logo: "/brand-logos/stussy.svg",
    isInverted: true,
    tagline: "International Stüssy Tribe & Surf Roots",
    provenance: "Laguna Beach, 1980",
  },
  {
    name: "Arc'teryx",
    logo: "/brand-logos/arcteryx.svg",
    isInverted: true,
    tagline: "Gore-Tex Pro Alpine Architectural Archive",
    provenance: "Coast Mountains, 1989",
  },
  {
    name: "Bape",
    logo: "/brand-logos/bape.svg",
    isInverted: true,
    tagline: "A Bathing Ape Tokyo Urahara Heritage",
    provenance: "Harajuku, 1993",
  },
  {
    name: "Palace",
    logo: "/brand-logos/palace.png",
    isPng: true,
    isInverted: false,
    tagline: "PWBC Tri-Ferg London Raw Skate",
    provenance: "London, 2009",
  },
  {
    name: "Nike ACG",
    logo: "/brand-logos/nike-acg.svg",
    isInverted: true,
    tagline: "All Conditions Gear Technical Exploration",
    provenance: "Oregon, 1989",
  },
  {
    name: "Oakley",
    logo: "/brand-logos/oakley.svg",
    isInverted: true,
    tagline: "Mad Science Y2K Functional Software",
    provenance: "Foothill Ranch, 1975",
  },
  {
    name: "The North Face",
    logo: "/brand-logos/the-north-face.svg",
    isInverted: false,
    tagline: "Summit Series Expedition Archival Grails",
    provenance: "San Francisco, 1966",
  },
];

export function BrandsGrid() {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [activeHoverBrand, setActiveHoverBrand] = useState<string | null>(null);

  return (
    <section id="marcas" className="w-full bg-canvas-base py-12 px-4 sm:px-8 border-b border-border-subtle overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Compact Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
              <Sparkle weight="light" className="w-3.5 h-3.5 text-text-optic" />
              <span>POR MARCA // VITRINE 3D EM LOOP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-mono tracking-tight text-text-optic">
              Marcas de Arquivo &amp; Streetwear
            </h2>
            <p className="text-xs text-text-platinum font-mono max-w-xl">
              Emblemas icônicos em rotação 3D contínua. Toque para acessar as peças certificadas de cada casa de moda.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllBrands(!showAllBrands)}
            className="h-10 px-4 bg-canvas-well border border-border-subtle hover:border-text-optic text-text-optic font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <span>Todas as {TAXONOMY_BRANDS.length} Marcas</span>
            <CaretDown
              weight="light"
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                showAllBrands ? "rotate-180 text-text-optic" : "text-text-slate"
              }`}
            />
          </button>
        </div>

        {/* 3D Spinning Brand Emblems Showcase - Compact Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {FEATURED_BRANDS.map((brand, index) => {
            const isHovered = activeHoverBrand === brand.name;

            return (
              <Link
                key={brand.name}
                href={`/produtos?brand=${encodeURIComponent(brand.name)}`}
                onMouseEnter={() => setActiveHoverBrand(brand.name)}
                onMouseLeave={() => setActiveHoverBrand(null)}
                className="group relative bg-canvas-well border border-border-subtle p-3 sm:p-4 flex flex-col items-center justify-between min-h-[150px] sm:min-h-[170px] overflow-hidden hover:border-border-specular transition-all duration-300 shadow-md"
                style={{ perspective: 1000 }}
              >
                {/* Micro Provenance Tag */}
                <div className="w-full flex items-center justify-between text-[9px] font-mono text-text-slate uppercase z-10">
                  <span className="truncate">{brand.provenance.split(",")[0]}</span>
                  <ArrowUpRight
                    weight="light"
                    className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:text-text-optic group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>

                {/* 3D Spinning Logo Medallion */}
                <div className="my-auto py-2 flex items-center justify-center w-full" style={{ perspective: 800 }}>
                  <motion.div
                    className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={
                      isHovered
                        ? { rotateY: 0, scale: 1.15, z: 20 }
                        : { rotateY: [0, 360] }
                    }
                    transition={
                      isHovered
                        ? { duration: 0.3, ease: "easeOut" }
                        : {
                            repeat: Infinity,
                            ease: "linear",
                            duration: 12 + index * 1.5, // Natural staggered rotation speeds
                          }
                    }
                  >
                    {/* Front-Facing Specular Disc */}
                    <div
                      className="absolute inset-0 rounded-full bg-canvas-base/80 border border-border-subtle/80 flex items-center justify-center p-3 shadow-[0_0_20px_rgba(255,255,255,0.03)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.12)] group-hover:border-border-specular transition-all"
                      style={{ backfaceVisibility: "visible" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brand.logo}
                        alt={`${brand.name} 3D Spinning Logo`}
                        className={`max-h-8 max-w-[56px] sm:max-h-10 sm:max-w-[64px] object-contain transition-transform duration-300 ${
                          brand.isInverted
                            ? "invert brightness-150 contrast-125"
                            : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                        }`}
                        loading="lazy"
                      />
                    </div>

                    {/* Specular Glare Ring */}
                    <div
                      className="absolute -inset-0.5 rounded-full border border-white/10 opacity-60 pointer-events-none"
                      style={{ transform: "translateZ(2px)" }}
                    />
                  </motion.div>
                </div>

                {/* Brand Name Label */}
                <div className="w-full pt-1.5 border-t border-border-subtle/60 text-center z-10">
                  <span className="font-mono font-bold text-[11px] sm:text-xs text-text-optic uppercase tracking-wider block truncate group-hover:text-white transition-colors">
                    {brand.name}
                  </span>
                </div>

                {/* Ambient Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            );
          })}
        </div>

        {/* Expandable Taxonomy Drawer for All Other Brands */}
        {showAllBrands ? (
          <div className="bg-canvas-well border border-border-subtle p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-border-subtle pb-3 border-b">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-text-optic">
                Todas as Casas do Acervo ({TAXONOMY_BRANDS.length})
              </span>
              <span className="font-mono text-[10px] text-text-slate uppercase">
                Filtro Coeso por Grife
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {TAXONOMY_BRANDS.map((brand) => (
                <Link
                  key={brand}
                  href={`/produtos?brand=${encodeURIComponent(brand)}`}
                  className="px-3 py-2 bg-canvas-base border border-border-subtle hover:border-text-optic hover:text-text-optic text-text-platinum font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-between focus-visible:ring-1 focus-visible:ring-white focus:outline-none"
                >
                  <span className="truncate">{brand}</span>
                  <ArrowUpRight weight="light" className="w-3 h-3 text-text-slate shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
