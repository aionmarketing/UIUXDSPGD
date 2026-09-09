"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkle,
  ShieldCheck,
  Check,
  Bag,
  MagnifyingGlass,
  ArrowUpRight,
  Flame,
} from "@phosphor-icons/react";
import { CATALOG_PRODUCTS } from "@/features/storefront/data/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GlassStyle = "obsidian" | "refraction" | "minimalist";

interface StyleDefinition {
  id: GlassStyle;
  name: string;
  subtitle: string;
  tag: string;
  specs: {
    background: string;
    blur: string;
    border: string;
    innerGlow: string;
    shadow: string;
  };
  cardClass: string;
  headerClass: string;
  badgeClass: string;
  buttonClass: string;
}

const STYLES: Record<GlassStyle, StyleDefinition> = {
  obsidian: {
    id: "obsidian",
    name: "1. Dark Obsidian Frosted",
    subtitle: "Vidro fumê escuro profundo com bordas finas de prata e bisel de luz interior",
    tag: "LUXO DE ARQUIVO",
    specs: {
      background: "rgba(12, 14, 18, 0.75)",
      blur: "backdrop-blur-xl (20px)",
      border: "1px sólido rgba(255,255,255,0.12)",
      innerGlow: "Inset 0 1px 0 rgba(255,255,255,0.18)",
      shadow: "shadow-2xl shadow-black/60",
    },
    cardClass:
      "bg-[#0c0e12]/75 backdrop-blur-xl border border-white/[0.13] shadow-2xl shadow-black/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)] transition-all duration-300 hover:border-white/30 hover:bg-[#0c0e12]/85",
    headerClass:
      "bg-[#090a0d]/80 backdrop-blur-2xl border-b border-white/[0.12] shadow-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]",
    badgeClass:
      "bg-black/70 backdrop-blur-md border border-white/15 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
    buttonClass:
      "bg-white text-black font-bold hover:bg-neutral-200 border border-white transition-all shadow-[0_2px_12px_rgba(255,255,255,0.15)]",
  },
  refraction: {
    id: "refraction",
    name: "2. High-Refraction Prismatic",
    subtitle: "Vidro esfumaçado ultra-difuso com reflexos cromáticos e bordas com halo especular",
    tag: "VANGUARDA BOUTIQUE",
    specs: {
      background: "rgba(18, 22, 34, 0.58)",
      blur: "backdrop-blur-2xl (32px)",
      border: "1px gradiente rgba(255,255,255,0.22)",
      innerGlow: "Inset 0 1px 0 rgba(255,255,255,0.28), Inset 0 0 20px rgba(255,255,255,0.03)",
      shadow: "shadow-2xl shadow-black/80",
    },
    cardClass:
      "bg-[#121622]/58 backdrop-blur-2xl border border-white/[0.22] shadow-2xl shadow-black/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),inset_0_0_24px_0_rgba(255,255,255,0.03)] transition-all duration-300 hover:border-white/45 hover:bg-[#161c2c]/70 hover:shadow-[0_0_30px_rgba(140,150,220,0.15)]",
    headerClass:
      "bg-[#0e111a]/70 backdrop-blur-3xl border-b border-white/[0.2] shadow-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
    badgeClass:
      "bg-[#161c2c]/80 backdrop-blur-xl border border-white/25 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)]",
    buttonClass:
      "bg-white text-black font-bold hover:bg-neutral-100 border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)]",
  },
  minimalist: {
    id: "minimalist",
    name: "3. Minimalist Floating Chrome",
    subtitle: "Cards em preto fosco de contraste cirúrgico; vidro reservado para barras e modais",
    tag: "ALTO CONTRASTE MODULAR",
    specs: {
      background: "Cards em #090a0d fosco / Barras em rgba(10,10,14,0.65)",
      blur: "backdrop-blur-lg (12px) apenas no chrome",
      border: "1px sólido rgba(255,255,255,0.08)",
      innerGlow: "Sem brilho interno nos cards",
      shadow: "shadow-xl",
    },
    cardClass:
      "bg-[#090a0d] border border-white/[0.10] shadow-xl transition-all duration-200 hover:border-white/25 hover:bg-[#0d0e13]",
    headerClass:
      "bg-[#0a0b0e]/70 backdrop-blur-xl border-b border-white/[0.12] shadow-lg",
    badgeClass:
      "bg-black/90 border border-white/15 text-white",
    buttonClass:
      "bg-white text-black font-bold hover:bg-neutral-200 border border-white transition-all",
  },
};

export default function GlassmorphismPreviewPage() {
  const [activeStyle, setActiveStyle] = useState<GlassStyle>("obsidian");
  const [grainActive, setGrainActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = STYLES[activeStyle];

  // GSAP Entrance & Scroll-Triggered Stagger Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Header & Controls entrance
      gsap.from(".anim-header", {
        opacity: 0,
        y: -15,
        duration: 0.8,
        ease: "power3.out",
      });

      // 2. Staggered card entrance when style changes
      gsap.fromTo(
        ".anim-card",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
        }
      );

      // 3. ScrollTrigger reveal for lower showcase sections
      gsap.from(".anim-forensic", {
        scrollTrigger: {
          trigger: ".anim-forensic",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".anim-checkout", {
        scrollTrigger: {
          trigger: ".anim-checkout",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.7,
        delay: 0.1,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activeStyle]);

  const sampleProducts = CATALOG_PRODUCTS.slice(0, 5);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0c0d10] text-text-optic font-mono antialiased pb-24 overflow-x-hidden selection:bg-white selection:text-black"
    >
      {/* 1. EDITORIAL FILM GRAIN NOISE OVERLAY */}
      {grainActive && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-30 opacity-[0.04] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      )}

      {/* Background Ambience Halo for visual refraction inspection */}
      <div
        aria-hidden="true"
        className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none z-0"
      />
      <div
        aria-hidden="true"
        className="fixed bottom-32 right-10 w-[500px] h-[300px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none z-0"
      />

      {/* 2. STICKY TOP CONTROLLER BAR */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${current.headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 anim-header">
          {/* Title & Scope badge */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-widest text-text-optic">
                LAB DE GLASSMORPHISM
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-white/10 text-white border border-white/20 uppercase tracking-wider">
              {current.tag}
            </span>
          </div>

          {/* Interactive Style Selector Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/15 rounded-sm backdrop-blur-xl">
            {(["obsidian", "refraction", "minimalist"] as GlassStyle[]).map((styleId) => {
              const isActive = activeStyle === styleId;
              return (
                <button
                  key={styleId}
                  type="button"
                  onClick={() => setActiveStyle(styleId)}
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {styleId === "obsidian" && "1. Obsidian"}
                  {styleId === "refraction" && "2. Prismatic"}
                  {styleId === "minimalist" && "3. Minimal"}
                </button>
              );
            })}
          </div>

          {/* Grain Noise Toggle & Storefront Link */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGrainActive(!grainActive)}
              className={`px-2.5 py-1 text-[10px] border flex items-center gap-1.5 transition cursor-pointer ${
                grainActive
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-white/5 text-neutral-400 border-white/10 hover:border-white/20"
              }`}
              title="Alternar textura analógica de grão no fundo"
            >
              <Sparkle className="w-3 h-3" />
              <span>GRÃO: {grainActive ? "ATIVO" : "DESLIGADO"}</span>
            </button>

            <Link
              href="/"
              className="px-2.5 py-1 text-[10px] bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center gap-1"
            >
              <span>LOJA AO VIVO</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* 3. MAIN PREVIEW CONTAINER */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12">
        {/* Style Summary Spec Sheet */}
        <section className={`p-6 sm:p-8 space-y-4 border ${current.cardClass}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="text-[10px] text-text-slate tracking-widest uppercase">
                ESTILO SELECIONADO // DISPUTA VISUAL
              </div>
              <h1 className="text-xl sm:text-2xl font-bold uppercase text-text-optic">
                {current.name}
              </h1>
              <p className="text-xs text-text-platinum max-w-2xl">
                {current.subtitle}
              </p>
            </div>
            <div className="text-right flex md:flex-col items-center md:items-end justify-between gap-2">
              <span className="text-[10px] text-text-slate uppercase">REFRAÇÃO DO CANVAS</span>
              <span className="text-xs text-emerald-400 font-bold uppercase">
                {grainActive ? "Com Textura de Filme Analógico" : "Fundo Digital Neutro"}
              </span>
            </div>
          </div>

          {/* Technical Spec Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-[10px] pt-1">
            <div className="p-2.5 bg-black/40 border border-white/10 space-y-0.5">
              <span className="text-text-slate block uppercase">Fundo / Opacidade</span>
              <span className="text-white font-bold truncate block">{current.specs.background}</span>
            </div>
            <div className="p-2.5 bg-black/40 border border-white/10 space-y-0.5">
              <span className="text-text-slate block uppercase">Backdrop Blur</span>
              <span className="text-white font-bold truncate block">{current.specs.blur}</span>
            </div>
            <div className="p-2.5 bg-black/40 border border-white/10 space-y-0.5">
              <span className="text-text-slate block uppercase">Tratamento de Borda</span>
              <span className="text-white font-bold truncate block">{current.specs.border}</span>
            </div>
            <div className="p-2.5 bg-black/40 border border-white/10 space-y-0.5">
              <span className="text-text-slate block uppercase">Bisel / Luz Interna</span>
              <span className="text-white font-bold truncate block">{current.specs.innerGlow}</span>
            </div>
            <div className="p-2.5 bg-black/40 border border-white/10 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-text-slate block uppercase">Sombra Externa</span>
              <span className="text-white font-bold truncate block">{current.specs.shadow}</span>
            </div>
          </div>
        </section>

        {/* 4. COMPONENT SHOWCASE: FILTER TOOLBAR IN GLASS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-text-slate">
            <span className="uppercase tracking-widest font-bold">
              [AMOSTRA 1] BARRA DE FILTROS & BUSCA EM VIDRO
            </span>
            <span className="text-[10px] uppercase">GSAP HOVER REFINADO</span>
          </div>

          <div className={`p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 ${current.cardClass}`}>
            <div className="relative w-full md:w-80">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-slate" />
              <input
                type="text"
                readOnly
                value="BALENCIAGA // SUPREME"
                className="w-full h-9 pl-9 pr-3 bg-black/50 border border-white/15 text-xs text-text-optic placeholder-text-slate focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {["TODOS", "GRAIL", "ARQUIVO", "VANGUARDA", "SNEAKERS"].map((cat, i) => (
                <button
                  key={cat}
                  type="button"
                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    i === 0
                      ? current.buttonClass
                      : "bg-white/5 border border-white/10 text-neutral-300 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 5. COMPONENT SHOWCASE: 5-COLUMN COMPACT PRODUCT GRID */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-text-slate">
            <span className="uppercase tracking-widest font-bold">
              [AMOSTRA 2] GRID COMPACTO DE 5 COLUNAS EM GLASSMORPHISM
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase">
              REVEAL VIA GSAP SCROLLTRIGGER
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                className={`anim-card flex flex-col group overflow-hidden ${current.cardClass}`}
              >
                {/* Product Photo Container */}
                <div className="relative aspect-[3/4] w-full bg-black/40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between pointer-events-none z-20">
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase ${current.badgeClass}`}>
                      {product.tag || product.category}
                    </span>
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 text-[8px] ${current.badgeClass}`}>
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      <span className="hidden sm:inline">AUTÊNTICO</span>
                    </div>
                  </div>

                  {/* Bottom Size & Condition Tag */}
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 z-20 pointer-events-none">
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold ${current.badgeClass}`}>
                      {product.size}
                    </span>
                    <span className={`px-1.5 py-0.5 text-[8px] ${current.badgeClass}`}>
                      {product.condition}
                    </span>
                  </div>
                </div>

                {/* Data Well (Glass Surface) */}
                <div className="p-2.5 sm:p-3 space-y-1.5 flex-1 flex flex-col justify-between border-t border-white/10">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[9px] text-text-slate uppercase">
                      <span className="font-bold truncate text-white/90">{product.brand}</span>
                      <span className="text-[8px] shrink-0">{product.category}</span>
                    </div>
                    <div className="text-xs font-medium text-white line-clamp-1">
                      {product.name}
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-1.5">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-[13px] font-bold text-white">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="w-7 h-7 bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        className={`h-7 px-2 text-[9px] uppercase tracking-wider flex items-center gap-1 ${current.buttonClass}`}
                      >
                        <Bag className="w-3 h-3" />
                        <span>COMPRAR</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. COMPONENT SHOWCASE: FORENSIC CERTIFICATE & ORDER WELL */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Forensic Authenticity Card */}
          <div className={`anim-forensic lg:col-span-7 p-6 sm:p-8 space-y-5 ${current.cardClass}`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-widest text-white">
                  LAUDO PERICIAL // SELO DESAPEGADO
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                CERTIFICADO ATIVO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-text-slate block text-[9px] uppercase">Protocolo</span>
                <span className="text-white font-bold">DSP-2026-9041</span>
              </div>
              <div>
                <span className="text-text-slate block text-[9px] uppercase">Especialista</span>
                <span className="text-white font-bold">Curadoria Técnica SP</span>
              </div>
              <div>
                <span className="text-text-slate block text-[9px] uppercase">Inspeção</span>
                <span className="text-white font-bold">Física / Espectral</span>
              </div>
              <div>
                <span className="text-text-slate block text-[9px] uppercase">Nota Global</span>
                <span className="text-emerald-400 font-bold">9.9 / 10.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10 text-neutral-300">
              <div className="p-2.5 bg-black/40 border border-white/10 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Costura e pesponto milimétricos validados</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/10 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Microimpressão holográfica legítima</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/10 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Densidade têxtil 450 GSM autêntica</span>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/10 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Serial tag correspondente à manufatura</span>
              </div>
            </div>
          </div>

          {/* Checkout & Summary Card */}
          <div className={`anim-checkout lg:col-span-5 p-6 sm:p-8 space-y-6 ${current.cardClass}`}>
            <div className="border-b border-white/10 pb-4">
              <div className="text-[10px] text-text-slate uppercase">AQUISIÇÃO IMEDIATA</div>
              <h3 className="text-lg font-bold text-white uppercase">Resumo da Aquisição</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Subtotal (1 item)</span>
                <span className="text-white">R$ 2.490,00</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Frete com Seguro Blindado</span>
                <span className="text-emerald-400 font-bold">GRÁTIS</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Garantia de Autenticidade Vitalícia</span>
                <span className="text-emerald-400 font-bold">INCLUSA</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Estimado</span>
                <span className="text-base text-white">R$ 2.490,00</span>
              </div>
            </div>

            <button
              type="button"
              className={`w-full h-11 text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${current.buttonClass}`}
            >
              <Bag className="w-4 h-4" />
              <span>FINALIZAR AQUISIÇÃO</span>
            </button>
          </div>
        </section>

        {/* 7. VOTING & SELECTION FOOTER BANNER */}
        <section className={`p-6 sm:p-8 border text-center space-y-3 ${current.cardClass}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 text-xs text-white">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-bold uppercase">Decisão de Design</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold uppercase text-white">
            Qual dos 3 estilos você quer aplicado no site principal?
          </h2>
          <p className="text-xs text-text-platinum max-w-xl mx-auto">
            Alterne entre os botões no topo para inspecionar no computador ou no celular. Assim que escolher, aplicaremos os tokens no CSS global e propagaremos para a Home, Catálogo, PDP e Carrinho.
          </p>
        </section>
      </main>
    </div>
  );
}
