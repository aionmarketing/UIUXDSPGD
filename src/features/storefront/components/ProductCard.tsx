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
          "relative flex flex-col justify-between h-full w-full",
          "bg-glass-substrate backdrop-blur-[36px]",
          "border-t border-border-specular border-b-black/90 border-x border-border-subtle",
          "shadow-xl transition-all duration-300",
          "group-hover:border-border-specular/80"
        )}
      >
        {/* Dynamic Specular Glare / Spotlight Overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 transition duration-300"
          style={{ background: spotlightBg }}
        />

        {/* 1. COMPACT EDITORIAL IMAGE CONTAINER (Shrunk slightly for editorial rhythm) */}
        <Link
          href={`/produtos/${product.slug}`}
          className="relative aspect-[3/4] w-full bg-canvas-well overflow-hidden block"
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
              <span className="bg-canvas-well/90 backdrop-blur-md border border-border-subtle px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-text-optic uppercase">
                {product.tag}
              </span>
            ) : (
              <span className="bg-canvas-well/90 backdrop-blur-md border border-border-subtle px-1.5 py-0.5 text-[9px] font-mono text-text-platinum uppercase">
                {product.subcategory || product.category}
              </span>
            )}

            <div className="flex items-center gap-1 bg-canvas-well/90 backdrop-blur-md border border-border-subtle px-1.5 py-0.5 text-[9px] font-mono text-text-platinum">
              <ShieldCheck weight="light" className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">AUTÊNTICO</span>
            </div>
          </div>

          {/* Size & Condition Overlay Tag at bottom of photo */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 z-20 pointer-events-none">
            <span className="bg-canvas-base/90 backdrop-blur-md border border-border-subtle px-1.5 py-0.5 text-[9px] font-mono font-bold text-text-optic">
              TAM: {product.size}
            </span>
            <span className="bg-canvas-base/90 backdrop-blur-md border border-border-subtle px-1.5 py-0.5 text-[9px] font-mono text-text-platinum">
              {product.condition}
            </span>
          </div>
        </Link>

        {/* 2. PRODUCT DATA BLOCK (Solid bg-canvas-well block for WCAG AAA Contrast Mandate) */}
        <div className="bg-canvas-well p-3 sm:p-3.5 space-y-2 border-t border-border-subtle z-20 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-widest text-text-slate uppercase">
                {product.brand}
              </span>
              <span className="font-mono text-[9px] text-text-slate uppercase">
                {product.category}
              </span>
            </div>

            <Link
              href={`/produtos/${product.slug}`}
              className="block font-mono text-xs sm:text-sm font-semibold text-text-optic hover:text-text-platinum transition-colors line-clamp-1"
              title={product.name}
            >
              {product.name}
            </Link>
          </div>

          {/* Price & Quick Add CTA */}
          <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between gap-2">
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
                className="w-7 h-7 sm:w-8 sm:h-8 bg-canvas-base border border-border-subtle hover:border-text-optic text-text-platinum hover:text-text-optic flex items-center justify-center transition-colors"
              >
                <ArrowUpRight weight="light" className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Adicionar ${product.name} à sacola`}
                className={clsx(
                  "h-7 sm:h-8 px-2 sm:px-2.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border",
                  isAdded
                    ? "bg-emerald-400 text-canvas-base border-emerald-400"
                    : "bg-text-optic text-canvas-base border-text-optic hover:bg-neutral-200 active:scale-[0.98]"
                )}
              >
                {isAdded ? (
                  <>
                    <Check weight="bold" className="w-3 h-3" />
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
