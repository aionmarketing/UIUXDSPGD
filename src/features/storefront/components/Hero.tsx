"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkle,
  Crosshair,
  ArrowDown,
  ShieldCheck,
  Lightning,
} from "@phosphor-icons/react";
import { GorillaAvatar } from "./avatar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const contrastBlockRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const glassCardRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Reveal Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(tagRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.8,
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 35,
            duration: 1.1,
          },
          "-=0.5"
        )
        .from(
          contrastBlockRef.current,
          {
            opacity: 0,
            y: 25,
            duration: 0.9,
          },
          "-=0.7"
        )
        .from(
          actionsRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          canvasContainerRef.current,
          {
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=1.0"
        )
        .from(
          glassCardRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 1,
          },
          "-=0.8"
        )
        .from(
          statsBarRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.7"
        );

      // 2. ScrollTrigger Parallax & Dynamics
      if (containerRef.current) {
        gsap.to(canvasContainerRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });

        gsap.to(glassCardRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] w-full bg-transparent text-text-optic overflow-hidden flex flex-col justify-between border-b border-white/[0.1]"
    >
      {/* Background Substrate Radial Glow (Onyx Basalt Depth) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 70% 35%, rgba(255, 255, 255, 0.08) 0%, rgba(12, 13, 16, 0) 100%)",
        }}
      />

      {/* Main Hero Editorial Viewport */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* LEFT COLUMN: Architectural Editorial Typography & Contrast Mandate Block */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          {/* Badge & Edition */}
          <div
            ref={tagRef}
            className="inline-flex items-center gap-2.5 w-fit border border-white/15 bg-[#0c0e14]/80 backdrop-blur-md px-3 py-1.5 text-xs font-mono tracking-widest uppercase text-text-platinum shadow-sm"
          >
            <Sparkle weight="light" className="w-3.5 h-3.5 text-emerald-400" />
            <span>DESAPEGO // DIGITAL JUNGLE ARCHIVE • HABITAT GORILA</span>
          </div>

          {/* Core Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight leading-[1.05] text-text-optic font-mono"
          >
            MODA CIRCULAR <br />
            <span className="text-text-platinum font-light italic">STREETWEAR</span> &amp;{" "}
            <br />
            ARQUIVO VINTAGE.
          </h1>

          {/* CONTRAST MANDATE BLOCK (Glass Substrate) */}
          <div
            ref={contrastBlockRef}
            className="bg-[#0c0e14]/75 backdrop-blur-xl border border-white/[0.12] p-5 sm:p-6 space-y-3 shadow-2xl shadow-black/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.1] pb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-slate">
                GARANTIA FORENSE DE AUTENTICIDADE
              </span>
              <span className="text-[11px] font-mono text-text-platinum flex items-center gap-1.5">
                <ShieldCheck weight="light" className="w-3.5 h-3.5 text-emerald-400" />
                100% ORIGINAL &amp; CERTIFICADO
              </span>
            </div>
            <p className="text-sm sm:text-base text-text-optic leading-relaxed font-normal">
              Acervo curado de peças raras de arquivo, passarela e streetwear de luxo.
              Cada item é inspecionado minuciosamente por microscopia digital e certificado antes de ser disponibilizado para venda.
            </p>
          </div>

          {/* Action Call-to-Actions */}
          <div
            ref={actionsRef}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1"
          >
            <Link
              href="/produtos"
              className="h-14 px-8 min-h-[48px] bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-neutral-200 active:scale-[0.99] transition cursor-pointer shadow-lg"
            >
              <span>EXPLORAR ACERVO</span>
              <ArrowDown weight="light" className="w-4 h-4" />
            </Link>

            <Link
              href="/produtos?condition=DSWT"
              className="h-14 px-6 min-h-[48px] bg-[#0c0e14]/70 backdrop-blur-xl border border-white/20 text-text-optic font-mono font-semibold text-xs uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.99] transition shadow-lg cursor-pointer"
            >
              <Lightning weight="light" className="w-4 h-4 text-emerald-400" />
              <span>PEÇAS LACRADAS (DSWT)</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Gorilla Viewport Wrapped in Tropical Habitat Specular Glass */}
        <div className="lg:col-span-6 relative flex flex-col items-center justify-center w-full">
          {/* Telemetry Header Pill */}
          <div className="w-full max-w-[500px] lg:max-w-none flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-1.5 bg-[#0c0e14]/85 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-mono shadow-sm">
              <Sparkle weight="light" className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-text-optic tracking-wider uppercase">
                HABITAT DIGITAL // GORILA 3D
              </span>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-widest shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RASTREAMENTO ÓPTICO 60FPS
            </span>
          </div>

          {/* LIQUID GLASS CONTAINER WRAPPING THE 3D GORILLA CANVAS */}
          <div
            ref={canvasContainerRef}
            className="relative w-full aspect-square max-w-[520px] lg:max-w-none bg-[#090d0b]/80 backdrop-blur-2xl border border-emerald-500/20 shadow-2xl shadow-black/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] overflow-hidden p-2 sm:p-4"
          >
            {/* Deep Habitat Chlorophyll Rim Light behind Gorilla */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 50% 52%, rgba(16, 185, 129, 0.18) 0%, rgba(5, 15, 10, 0.4) 55%, transparent 75%)",
              }}
            />

            {/* Subtle Peripheral Silhouette Fronds framing the enclosure */}
            <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none opacity-20">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d="M100,0 C70,15 45,45 25,80 C40,55 70,30 100,0 Z"
                  fill="#10b981"
                />
                <path
                  d="M100,20 C75,35 55,60 40,95 C55,70 80,45 100,20 Z"
                  fill="#065f46"
                />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none opacity-15 rotate-180">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d="M100,0 C70,15 45,45 25,80 C40,55 70,30 100,0 Z"
                  fill="#10b981"
                />
              </svg>
            </div>

            {/* Ambient Corner Specular Crosshairs */}
            <div className="absolute top-3 left-3 text-[11px] font-mono text-emerald-400/60 pointer-events-none z-10 select-none">
              +
            </div>
            <div className="absolute top-3 right-3 text-[11px] font-mono text-emerald-400/60 pointer-events-none z-10 select-none">
              +
            </div>
            <div className="absolute bottom-3 left-3 text-[11px] font-mono text-emerald-400/60 pointer-events-none z-10 select-none">
              +
            </div>
            <div className="absolute bottom-3 right-3 text-[11px] font-mono text-emerald-400/60 pointer-events-none z-10 select-none">
              +
            </div>

            {/* Subtle Specular Top Highlight Streak */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* The sacred 3D Gorilla Canvas component - UNTOUCHED CENTERPIECE */}
            <div className="w-full h-full relative z-10">
              <GorillaAvatar />
            </div>
          </div>

          {/* STOREFRONT UI RULE: FLOATING SPECULAR LIQUID GLASS TELEMETRY CARD */}
          <div
            ref={glassCardRef}
            className="w-[94%] sm:w-[88%] -mt-10 sm:-mt-14 relative z-20 bg-[#0a0f0d]/90 backdrop-blur-2xl border border-white/[0.16] shadow-2xl shadow-black/85 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22)] p-4 sm:p-5 space-y-3"
          >
            {/* Specular Liquid Glass Header for Avatar */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.1]">
              <div className="flex items-center gap-2">
                <Sparkle weight="light" className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-text-optic">
                  TELEMETRIA FORENSE // HABITAT GORILA 3D
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                SENSOR ATIVO
              </span>
            </div>

            {/* Solid bg-canvas-well block for WCAG AAA Contrast */}
            <div className="bg-black/50 border border-white/[0.08] p-3.5 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-tight text-text-optic font-mono">
                    Gorila 3D • Malha Vetorial
                  </h2>
                  <p className="text-[11px] font-mono text-text-platinum">
                    Renderização em Tempo Real // Acompanhamento Angular
                  </p>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-text-optic text-canvas-base uppercase">
                  60 FPS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle text-[10px] font-mono">
                <div>
                  <span className="text-text-slate block">INTERAÇÃO</span>
                  <span className="text-text-optic font-semibold uppercase">
                    Mouse &amp; Toque
                  </span>
                </div>
                <div>
                  <span className="text-text-slate block">ESTILO</span>
                  <span className="text-text-optic font-semibold">Wireframe Onyx</span>
                </div>
                <div>
                  <span className="text-text-slate block">PERFORMANCE</span>
                  <span className="text-text-optic font-semibold">Hardware Accel</span>
                </div>
              </div>
            </div>

            {/* Bottom Glass Card Micro-Action */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
              <span className="flex items-center gap-1.5">
                <Crosshair weight="light" className="w-3.5 h-3.5 text-text-platinum" />
                <span>Mova o cursor ou arraste para interagir</span>
              </span>
              <span className="text-text-platinum text-[10px]">
                DESAPEGADO LAB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ticker / Stats Bar */}
      <div
        ref={statsBarRef}
        className="relative z-20 w-full border-t border-border-subtle bg-canvas-well py-3 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-6 text-text-slate">
            <span className="flex items-center gap-2 text-text-platinum">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              CATÁLOGO ATIVO
            </span>
            <span className="hidden sm:inline">ACERVO EM SÃO PAULO</span>
            <span className="hidden md:inline">AUTENTICIDADE: 100% GARANTIDA</span>
          </div>

          <div className="text-text-slate text-[11px] uppercase tracking-wider">
            DESAPEGADO.COM // BRASIL
          </div>
        </div>
      </div>
    </section>
  );
}
