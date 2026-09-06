import React from "react";
import {
  KineticHero,
  ParallaxShowcase,
  PinnedHorizontalLookbook,
  ForensicZoomCard,
  StickySplitShowcase,
  ScrollBenchmarkFooter,
} from "@/features/scroll-lab";

export default function ScrollLabPage() {
  return (
    <div className="w-full flex flex-col">
      {/* 01. Kinetic Hero with Masked Typography and Depth */}
      <KineticHero />

      {/* 02. Parallax Archive Showcase (3 Asymmetric Columns) */}
      <ParallaxShowcase />

      {/* 03. Pinned Runway Lookbook (GSAP ScrollTrigger Horizontal Pinning) */}
      <PinnedHorizontalLookbook />

      {/* 04. Forensic Zoom & Textile Inspection Lens */}
      <ForensicZoomCard />

      {/* 05. Sticky Split Audit Checkpoints */}
      <StickySplitShowcase />

      {/* 06. Comparative Technical Benchmark Footer */}
      <ScrollBenchmarkFooter />
    </div>
  );
}
