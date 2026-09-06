import React from "react";
import { Hero, NovidadesGrid, BrandsGrid } from "@/features/storefront";

export default function StorefrontHomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section with 3D Gorilla Canvas in Liquid Glass */}
      <Hero />

      {/* 2. Novidades Product Grid (Mock Clothing & Placeholder Images) */}
      <NovidadesGrid />

      {/* 3. Por Marca Grid (Wireframe Blueprint) */}
      <BrandsGrid />
    </div>
  );
}
