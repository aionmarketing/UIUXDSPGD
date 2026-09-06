import React from "react";
import type { Metadata } from "next";
import { SmoothScrollProvider, ScrollTelemetryHUD } from "@/features/scroll-lab";

export const metadata: Metadata = {
  title: "Desapegado // Lenis Scroll Lab & Design Kinetics",
  description:
    "Ambiente de testes para animações de rolagem suave com Lenis, GSAP ScrollTrigger e design brutalista editorial.",
};

export default function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider initialSettings={{ duration: 1.3, wheelMultiplier: 1.0 }}>
      <div className="min-h-screen bg-canvas-base text-text-optic selection:bg-emerald-400 selection:text-black font-sans antialiased">
        {/* Real-time Telemetry & Inerctia HUD */}
        <ScrollTelemetryHUD />

        {/* Lab Content */}
        <main className="w-full overflow-x-hidden">{children}</main>
      </div>
    </SmoothScrollProvider>
  );
}
