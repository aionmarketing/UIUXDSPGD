"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShieldCheck, Cpu } from "lucide-react";

interface LookbookSlide {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  forensicCode: string;
}

const LOOKBOOK_SLIDES: LookbookSlide[] = [
  {
    number: "01",
    title: "RUNWAY 1999 // SEANCE",
    subtitle: "HELMUT LANG ARCHIVAL ARCHITECTURE",
    description:
      "Construção em nylon balístico termosselado com alças internas tipo mochila para transporte tático de passarela.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000",
    badge: "100% BALÍSTICO",
    forensicCode: "HL-99-PARIS-042",
  },
  {
    number: "02",
    title: "VAMP TAILORING 2014",
    subtitle: "RICK OWENS MONOCHROME SHADOWS",
    description:
      "Ombreiras arquitetônicas anguladas a 45 graus, lã virgem da Lombardia e forro em seda crua cupro com tingimento vegetal.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1000",
    badge: "LÃ VIRGEM LOMBARDA",
    forensicCode: "RO-14-PALAIS-881",
  },
  {
    number: "03",
    title: "DECONSTRUCTION 2004",
    subtitle: "MAISON MARGIELA ARTISANAL LINE 0",
    description:
      "Reaproveitamento manual de jaquetas vintage militares com costuras brancas expostas nos quatro cantos e botões de chifre.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
    badge: "ARTISANAL UP-CYCLE",
    forensicCode: "MM-04-ART-019",
  },
  {
    number: "04",
    title: "VIRGINIA CREEPER 2002",
    subtitle: "RAF SIMONS AMERICAN SUBURBIA",
    description:
      "Tratamento de corrosão química ácida que degrada a lã controladamente, tornando cada exemplar uma assinatura irrepetível.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1000",
    badge: "ÁCIDO CONTROLADO",
    forensicCode: "RS-02-ANTWERP-502",
  },
  {
    number: "05",
    title: "VAULT SECURED 2026",
    subtitle: "DESAPEGADO FORENSIC PROTOCOL",
    description:
      "Micro-espectrometria Raman confirmando composição molecular das fibras e autenticação criptográfica on-chain.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000",
    badge: "ESPECTROMETRIA RAMAN",
    forensicCode: "DSPGD-RAMAN-VERIFIED",
  },
];

export function PinnedHorizontalLookbook() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    const progressBar = progressRef.current;

    if (!section || !track) return;

    const totalScrollWidth = track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
      const trigger = gsap.to(track, {
        x: () => -totalScrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${totalScrollWidth}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: self.progress });
            }
          },
        },
      });

      return () => {
        trigger.scrollTrigger?.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="pinned-lookbook"
      ref={sectionRef}
      className="relative w-full h-screen bg-canvas-well overflow-hidden border-b border-white/10 flex flex-col justify-between select-none"
    >
      {/* Top Pinned Bar */}
      <div className="relative z-20 px-6 sm:px-12 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
          <span className="text-white font-bold tracking-wider">03 // LOOKBOOK HORIZONTAL PINNED</span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-500 hidden sm:inline">GSAP SCROLLTRIGGER PINNING</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span>ROLE VERTICALMENTE PARA NAVEGAR</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>
      </div>

      {/* Main Horizontal Sliding Track */}
      <div className="relative z-10 my-auto flex items-center">
        <div
          ref={trackRef}
          className="flex items-center gap-8 px-6 sm:px-12 will-change-transform"
        >
          {LOOKBOOK_SLIDES.map((slide) => (
            <div
              key={slide.number}
              className="w-[85vw] sm:w-[540px] md:w-[620px] flex-shrink-0 bg-canvas-base/80 border border-white/15 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl flex flex-col"
            >
              {/* Image Banner with cinematic grading */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center grayscale contrast-125 hover:grayscale-0 hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas-base via-transparent to-black/60" />

                {/* Number & Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 bg-black/80 border border-white/20 rounded font-black text-white">
                    {slide.number}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {slide.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded">
                  REGISTRO: {slide.forensicCode}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 sm:p-8 flex flex-col gap-3">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  {slide.subtitle}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  {slide.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">
                  {slide.description}
                </p>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                    GRAVADO ON-CHAIN
                  </span>
                  <span className="text-emerald-400 font-bold hover:underline cursor-pointer">
                    DETALHES DO EXEMPLAR →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Scrubbing Progress Bar */}
      <div className="relative z-20 px-6 sm:px-12 pb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>01 // SEANCE</span>
          <span>ESTÁGIO DE PINNING ATIVO</span>
          <span>05 // DESAPEGADO VAULT</span>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 origin-left scale-x-0"
          />
        </div>
      </div>
    </div>
  );
}
