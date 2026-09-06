"use client";

import React from "react";
import { Sparkle } from "@phosphor-icons/react";

const MARQUEE_ITEMS = [
  "SUPREME",
  "STÜSSY",
  "ARC'TERYX",
  "BAPE",
  "PALACE",
  "NIKE ACG",
  "OAKLEY",
  "THE NORTH FACE",
  "RICK OWENS",
  "MAISON MARGIELA",
  "CHROME HEARTS",
  "CURADORIA 100% AUTÊNTICA",
  "PEÇAS RARAS DE ARQUIVO",
  "SÃO PAULO • BRASIL",
];

export function KineticMarquee() {
  return (
    <div className="w-full bg-canvas-well border-y border-border-subtle py-3 overflow-hidden select-none">
      <div className="animate-marquee items-center gap-8 font-mono text-xs text-text-platinum uppercase tracking-widest whitespace-nowrap">
        {MARQUEE_ITEMS.map((item, idx) => (
          <div key={`set1-${idx}`} className="flex items-center gap-6">
            <span className="font-bold text-text-optic hover:text-emerald-400 transition-colors">
              {item}
            </span>
            <Sparkle weight="light" className="w-3.5 h-3.5 text-text-slate shrink-0" />
          </div>
        ))}
        {MARQUEE_ITEMS.map((item, idx) => (
          <div key={`set2-${idx}`} className="flex items-center gap-6">
            <span className="font-bold text-text-optic hover:text-emerald-400 transition-colors">
              {item}
            </span>
            <Sparkle weight="light" className="w-3.5 h-3.5 text-text-slate shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
