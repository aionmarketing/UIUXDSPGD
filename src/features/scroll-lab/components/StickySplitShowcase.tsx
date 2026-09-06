"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, Cpu, ArrowDownRight, Layers, FileCheck } from "lucide-react";

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  category: string;
  description: string;
  specDetails: string[];
  image: string;
}

const STEPS: Step[] = [
  {
    id: "step-1",
    stepNumber: "01",
    category: "METALURGIA FORENSE",
    title: "HARDWARE DE LATÃO & CURSOR TALON 1999",
    description:
      "Auditoria por fluorescência de raios-X (XRF) no zíper principal. A liga metálica confirma teores precisos de 65% Cobre e 35% Zinco característicos dos ateliês de Paris nos anos 90, descartando réplicas modernas de zamac fundido.",
    specDetails: ["LIGA: Cu65/Zn35", "DUREZA: 130 HV", "ESTAMPO: TALON REVERSÍVEL"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "step-2",
    stepNumber: "02",
    category: "ANÁLISE DE TRAMA & DENSIDADE",
    title: "SARJA DE NYLON MIL-SPEC 485 GSM",
    description:
      "Trama balística entrelaçada em tear circular de alta tensão. Os testes de atrito e desgaste mecânico comprovam densidade de 485 gramas por metro quadrado com impermeabilização química original de poliuretano respirável.",
    specDetails: ["DENSIDADE: 485 g/m²", "TECELAGEM: TWILL 3X1", "RESISTÊNCIA: 1800N"],
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "step-3",
    stepNumber: "03",
    category: "CERTIFICAÇÃO CRIPTOGRÁFICA",
    title: "PASSARELA ORIGINAL & PASSPORT ON-CHAIN",
    description:
      "Conferência com as fitas de arquivo do desfile Autumn/Winter 1999 em Paris. A etiqueta interna de linho cru contém a numeração serial datilografada, agora encapsulada em Smart Contract ERC-721 com garantia vitalícia de recompra.",
    specDetails: ["PASSAPORTE: ERC-721", "CONTRATO: 0x4f...91e", "GARANTIA: VITALÍCIA"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900",
  },
];

export function StickySplitShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;

        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentStep = STEPS[activeStep] || STEPS[0];

  return (
    <section
      id="sticky-audit"
      className="relative py-28 px-6 sm:px-12 bg-canvas-well border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>05 // STICKY SPLIT AUDIT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CHECKPOINT FORENSE EM <br />
            ROLAGEM ANCORADA
          </h2>
        </div>

        {/* 2-Column Sticky Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (STICKY) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="bg-canvas-base border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Dynamic Image with Smooth Crossfade */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentStep.image}
                  alt={currentStep.title}
                  className="w-full h-full object-cover object-center grayscale contrast-125 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Floating Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-black/80 border border-white/20 text-xs font-mono font-bold text-white rounded">
                    ETAPA {currentStep.stepNumber} DE 03
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-300 font-bold rounded flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFICADO
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-xs text-zinc-300 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded">
                  <span>{currentStep.category}</span>
                  <span className="text-emerald-400">PASSO ATIVO</span>
                </div>
              </div>

              {/* Spec Pills */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {currentStep.specDetails.map((spec, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white/5 border border-white/10 rounded text-center text-zinc-300"
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (SCROLLING STEPS) */}
          <div className="lg:col-span-6 flex flex-col gap-24 py-8">
            {STEPS.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className={`p-8 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? "bg-canvas-base border-emerald-500/40 shadow-[0_10px_40px_rgba(52,211,153,0.1)] scale-100"
                      : "bg-canvas-base/40 border-white/5 opacity-50 scale-95"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-2xl font-mono font-black ${
                        isActive ? "text-emerald-400" : "text-zinc-600"
                      }`}
                    >
                      {step.stepNumber}.
                    </span>
                    <span className="text-xs font-mono tracking-widest uppercase text-zinc-500">
                      {step.category}
                    </span>
                  </div>

                  <h3
                    className={`text-2xl font-black uppercase tracking-tight mb-4 ${
                      isActive ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed font-light mb-6">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <FileCheck className="w-4 h-4" />
                    <span>CERTIFICAÇÃO REGISTRADA NO PROTOCOLO ONYX</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
