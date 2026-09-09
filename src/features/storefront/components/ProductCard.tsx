"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import clsx from "clsx";
import {
  ShieldCheck,
  Bag,
  Check,
  ArrowUpRight,
  Sparkle,
} from "@phosphor-icons/react";
import type { CatalogProduct } from "../data/products";
import { useCartStore } from "../stores/useCartStore";

interface ProductCardProps {
  product: CatalogProduct;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Motion values for Aceternity spotlight specular glare
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.08), transparent 80%)`;
  const borderSpotlight = useMotionTemplate`radial-gradient(250px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.4), transparent 70%)`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const primaryImage = product.images?.[0] || "/placeholder-product.webp";
  const hoverImage = product.images?.[1] || primaryImage;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-none p-[1px] transition-all duration-500 overflow-hidden"
    >
      {/* Specular glowing border on hover (Aceternity pattern) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: borderSpotlight }}
      />

      {/* Main Glassmorphic Container (Liquid Specular Glass: Monolith Onyx tokens) */}
      <article
        className={clsx(
          "relative flex flex-col justify-between h-full w-full overflow-hidden",
          "bg-[#0c0e14]/70 backdrop-blur-xl",
          "border border-white/[0.12] shadow-xl shadow-black/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16)]",
          "transition-all duration-300 ease-out",
          "group-hover:border-white/30 group-hover:bg-[#121622]/80 group-hover:shadow-2xl group-hover:shadow-black/70 group-hover:-translate-y-1"
        )}
      >
        {/* Dynamic Specular Glare / Spotlight Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 transition duration-300"
          style={{ background: spotlightBg }}
        />

        {/* 1. EDITORIAL IMAGE CONTAINER */}
        <Link
          href={`/produtos/${product.slug}`}
          className="relative aspect-[3/4] w-full bg-black/40 overflow-hidden block"
        >
          {/* Main Photo with smooth cross-fade on hover */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={`${product.brand} - ${product.name}`}
            loading={priority ? "eager" : "lazy"}
            className={clsx(
              "w-full h-full object-cover transition-transform duration-700 ease-out",
              "group-hover:scale-105",
              isHovered && product.images?.length > 1 ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Secondary Photo on Hover if available */}
          {product.images?.length > 1 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hoverImage}
              alt={`${product.name} alternate angle`}
              className={clsx(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
            />
          )}

          {/* Top Badges (Tag & Authenticity) */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between pointer-events-none z-20">
            {product.tag ? (
              <span className="bg-black/75 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-text-optic uppercase shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                {product.tag}
              </span>
            ) : (
              <span className="bg-black/75 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-text-platinum uppercase shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                {product.subcategory || product.category}
              </span>
            )}

            <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              <ShieldCheck weight="bold" className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">AUTÊNTICO</span>
            </div>
          </div>

          {/* Size & Condition Overlay Tag at bottom of photo */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 z-20 pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-text-optic shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              TAM: {product.size}
            </span>
            <span className="bg-black/80 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-text-platinum shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
              {product.condition}
            </span>
          </div>
        </Link>

        {/* 2. PRODUCT DATA BLOCK (Translucent Frosted Glass Substrate) */}
        <div className="bg-[#090b10]/75 backdrop-blur-xl p-3 sm:p-3.5 space-y-2 border-t border-white/[0.12] z-20 flex-1 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-text-slate uppercase truncate">
                {product.brand}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] text-text-slate uppercase shrink-0">
                {product.category}
              </span>
            </div>

            <Link
              href={`/produtos/${product.slug}`}
              className="block font-mono text-xs sm:text-[13px] font-medium text-text-optic hover:text-white transition-colors line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Price & Quick Add CTA */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-mono text-xs sm:text-sm font-bold text-text-optic">
                R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              {product.originalRetailPrice && product.originalRetailPrice > product.price && (
                <span className="font-mono text-[9px] text-text-slate line-through">
                  R$ {product.originalRetailPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/produtos/${product.slug}`}
                aria-label={`Ver detalhes de ${product.name}`}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-text-platinum hover:text-text-optic flex items-center justify-center transition-all cursor-pointer shadow-sm"
              >
                <ArrowUpRight weight="light" className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Adicionar ${product.name} à sacola`}
                className={clsx(
                  "h-8 px-2.5 sm:px-3 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border",
                  isAdded
                    ? "bg-emerald-400 text-canvas-base border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                    : "bg-text-optic text-canvas-base border-text-optic hover:bg-neutral-200 active:scale-[0.98] shadow-sm"
                )}
              >
                {isAdded ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">ADICIONADO</span>
                  </>
                ) : (
                  <>
                    <Bag weight="light" className="w-3.5 h-3.5" />
                    <span>COMPRAR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
