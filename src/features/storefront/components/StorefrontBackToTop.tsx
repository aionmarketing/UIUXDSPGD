"use client";

import React from "react";
import { ArrowUp } from "@phosphor-icons/react";
import { useScrollLab } from "@/features/scroll-lab";

export function StorefrontBackToTop() {
  const { progress, scrollTo } = useScrollLab();

  // Only show once user has scrolled past 12% of the page
  const isVisible = progress > 0.12;

  const handleClick = () => {
    scrollTo(0, { duration: 1.2 });
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Voltar ao topo"
        className="relative w-12 h-12 rounded-full bg-canvas-well/95 border border-border-specular backdrop-blur-md flex items-center justify-center text-text-optic hover:bg-white hover:text-black transition-colors shadow-2xl group cursor-pointer"
      >
        {/* SVG Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 44 44"
        >
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-white/15"
            strokeWidth="2.5"
            fill="none"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-text-optic group-hover:stroke-black transition-colors"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <ArrowUp weight="light" className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
}

