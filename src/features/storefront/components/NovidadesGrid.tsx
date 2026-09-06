"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkle, ArrowUpRight } from "@phosphor-icons/react";
import { CATALOG_PRODUCTS, type CatalogProduct } from "../data/products";
import { ProductCard } from "./ProductCard";

export function NovidadesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [productsList, setProductsList] = useState<CatalogProduct[]>(CATALOG_PRODUCTS);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.warn("Fallback para catálogo local:", err));
  }, []);

  const filteredProducts =
    selectedCategory === "ALL"
      ? productsList.slice(0, 8)
      : productsList.filter((item) => item.category === selectedCategory).slice(0, 8);

  return (
    <section id="novidades" className="w-full bg-canvas-base py-16 px-4 sm:px-8 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
              <Sparkle weight="light" className="w-3.5 h-3.5 text-text-optic" />
              <span>CURADORIA // RECÉM-CHEGADOS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-mono tracking-tight text-text-optic">
              Novidades no Acervo
            </h2>
            <p className="text-xs sm:text-sm text-text-platinum font-mono max-w-xl">
              Seleção de grails, peças raras e edições limitadas com laudo de autenticidade forense digital e envio imediato.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
            {["ALL", "Roupas", "Sneakers", "Acessórios"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 min-h-[40px] uppercase tracking-wider transition cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                    : "bg-canvas-well text-text-slate border-border-subtle hover:text-text-optic hover:border-border-specular"
                }`}
              >
                {cat === "ALL" ? "Todas as Peças" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Editorial Shrunk 4-Column Grid with Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom CTA to Full Catalog */}
        <div className="pt-6 flex justify-center">
          <Link
            href="/produtos"
            className="h-12 px-8 bg-canvas-well border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2.5 hover:bg-white/[0.04] transition-all group shadow-lg"
          >
            <span>Explorar Todo o Catálogo ({productsList.length} Peças)</span>
            <ArrowUpRight weight="light" className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
