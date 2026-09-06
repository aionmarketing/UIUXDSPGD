"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Eye, Sparkles, Hash } from "lucide-react";

interface ArchiveItem {
  id: string;
  designer: string;
  piece: string;
  season: string;
  price: string;
  image: string;
  tag: string;
  forensicGrade: string;
}

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "ARC-991",
    designer: "HELMUT LANG",
    piece: "Astronaut Ballistic Bomber",
    season: "AW 1999 // 'SEANCE DE TRAVAIL'",
    price: "R$ 14.800",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=900",
    tag: "NYLON TÁTICO MIL-SPEC",
    forensicGrade: "A+ (99.4%)",
  },
  {
    id: "ARC-992",
    designer: "RICK OWENS",
    piece: "Geobasket Architectural Boots",
    season: "FW 2014 // 'MOODY'",
    price: "R$ 8.900",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=900",
    tag: "COURO BOVINO ENVELHECIDO",
    forensicGrade: "A (97.8%)",
  },
  {
    id: "ARC-993",
    designer: "MAISON MARGIELA",
    piece: "Artisanal Deconstructed Trench",
    season: "SS 2004 // 'LINE 0'",
    price: "R$ 19.500",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=900",
    tag: "GABARDINE & COSTURA BRANCA",
    forensicGrade: "A+ (99.8%)",
  },
  {
    id: "ARC-994",
    designer: "RAF SIMONS",
    piece: "Virginia Creeper Varsity",
    season: "AW 2002 // 'VIRGINIA CREEPER'",
    price: "R$ 28.000",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&q=80&w=900",
    tag: "LÃ TRATADA COM ÁCIDO",
    forensicGrade: "S (99.9%)",
  },
  {
    id: "ARC-995",
    designer: "UNDERCOVER",
    piece: "Scab Reconstructed Riders",
    season: "SS 2003 // 'SCAB'",
    price: "R$ 16.400",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=900",
    tag: "PONTO CRUZ MANUAL",
    forensicGrade: "A+ (98.9%)",
  },
  {
    id: "ARC-996",
    designer: "YOHJI YAMAMOTO",
    piece: "Pour Homme Asymmetric Coat",
    season: "AW 2008 // 'NOIR'",
    price: "R$ 11.200",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    tag: "GABARDINE DE LÃ PURA",
    forensicGrade: "A (96.5%)",
  },
];

export function ParallaxShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Offset transforms for the 3 columns
  const col1Y = useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]);
  const col2Y = useTransform(scrollYProgress, [0, 1], ["-120px", "120px"]);
  const col3Y = useTransform(scrollYProgress, [0, 1], ["90px", "-110px"]);

  const col1 = [ARCHIVE_ITEMS[0], ARCHIVE_ITEMS[3]];
  const col2 = [ARCHIVE_ITEMS[1], ARCHIVE_ITEMS[4]];
  const col3 = [ARCHIVE_ITEMS[2], ARCHIVE_ITEMS[5]];

  return (
    <section
      id="parallax-archive"
      ref={containerRef}
      className="relative py-28 px-6 sm:px-12 bg-canvas-base border-b border-white/10 overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 // PARALLAX EDITORIAL DESFASADO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            ACERVO CURADO EM <br />
            PROFUNDIDADE MULTIPLANA
          </h2>
        </div>
        <p className="max-w-md text-sm text-zinc-400 font-mono leading-relaxed">
          Cada coluna reage a uma velocidade diferenciada sob o algoritmo do Lenis. Observe a
          ausência de vibração de serrilhado mesmo em altas taxas de amostragem.
        </p>
      </div>

      {/* 3-Column Parallax Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <motion.div style={{ y: col1Y }} className="flex flex-col gap-8">
          {col1.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Column 2 (Reversed / Dynamic drift) */}
        <motion.div style={{ y: col2Y }} className="flex flex-col gap-8">
          {col2.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Column 3 */}
        <motion.div style={{ y: col3Y }} className="flex flex-col gap-8">
          {col3.map((item) => (
            <ArchiveCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArchiveCard({ item }: { item: ArchiveItem }) {
  return (
    <div className="group relative bg-canvas-well/80 border border-white/10 rounded-lg overflow-hidden transition-all duration-500 hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Image with zoom effect */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.piece}
          className="w-full h-full object-cover object-center grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
          <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/15 text-zinc-300 rounded">
            {item.id}
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-bold rounded flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {item.forensicGrade}
          </span>
        </div>

        {/* Bottom Tag */}
        <div className="absolute bottom-3 left-3 right-3 text-[10px] font-mono text-zinc-400">
          {item.tag}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-2">
        <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
          {item.designer}
        </div>
        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition">
          {item.piece}
        </h3>
        <div className="text-xs text-zinc-500 font-mono">{item.season}</div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm font-mono font-bold text-white">{item.price}</span>
          <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white transition flex items-center gap-1">
            VER ANÁLISE FORENSE →
          </span>
        </div>
      </div>
    </div>
  );
}
