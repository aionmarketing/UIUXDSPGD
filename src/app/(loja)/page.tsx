import React from "react";
import {
  Hero,
  KineticMarquee,
  NovidadesGrid,
  BrandsGrid,
  StorefrontBackToTop,
} from "@/features/storefront";

export default function StorefrontHomePage() {
  return (
    <div className="w-full flex flex-col relative">
      {/* 1. Hero Section with 3D Gorilla Canvas & Lenis-driven Parallax */}
      <Hero />

      {/* 2. Kinetic Ticker / Brand Marquee */}
      <KineticMarquee />

      {/* 3. Novidades Product Grid */}
      <NovidadesGrid />

      {/* 4. Brands Showcase with Vector Brand Logos */}
      <BrandsGrid />

      {/* 5. Floating Back-to-Top with Circular Progress Indicator */}
      <StorefrontBackToTop />
    </div>
  );
}

