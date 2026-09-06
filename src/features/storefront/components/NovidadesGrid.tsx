"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Check,
} from "lucide-react";
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
} from "../data/products";
import { useCartStore } from "../stores/useCartStore";

export function NovidadesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);

  const filteredProducts =
    selectedCategory === "ALL"
      ? CATALOG_PRODUCTS.slice(0, 8)
      : CATALOG_PRODUCTS.filter((item) => item.category === selectedCategory).slice(0, 8);

  const handleAddToCart = (product: CatalogProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section id="novidades" className="w-full bg-canvas-base py-16 px-4 sm:px-6 border-b border-border-subtle">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
              <Sparkles className="w-3 h-3 text-text-optic" />
              <span>DROP FORENSE // MARÇO 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-mono tracking-tight text-text-optic">
              Novidades no Acervo
            </h2>
            <p className="text-xs sm:text-sm text-text-platinum font-mono max-w-xl">
              Peças recém-chegadas e catalogadas. Autenticidade física e digital verificada.
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = addedItems[product.id];

            return (
              <article
                key={product.id}
                className="group relative bg-canvas-well border border-border-subtle flex flex-col justify-between overflow-hidden hover:border-border-specular transition-all duration-300"
              >
                {/* Image Container with Link to PDP */}
                <Link
                  href={`/produtos/${product.slug}`}
                  className="relative aspect-[4/5] w-full bg-canvas-base overflow-hidden block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.images[0]}
                    alt={`${product.brand} - ${product.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-canvas-well/90 backdrop-blur border border-border-subtle text-text-optic px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                      {product.condition}
                    </span>

                    {product.tag && (
                      <span className="bg-text-optic text-canvas-base px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider shadow">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Authenticity Watermark */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-canvas-well/80 backdrop-blur px-2 py-0.5 border border-border-subtle text-[9px] font-mono text-text-platinum">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>VERIFICADO</span>
                  </div>

                  {/* Size Indicator */}
                  <div className="absolute bottom-2.5 right-2.5 bg-canvas-well/80 backdrop-blur px-2 py-0.5 border border-border-subtle text-[9px] font-mono text-text-platinum font-bold">
                    TAM: {product.size}
                  </div>
                </Link>

                {/* Data Block: Solid bg-canvas-well for Guaranteed WCAG AAA Contrast */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between border-t border-border-subtle">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-extrabold uppercase text-text-optic tracking-wider">
                        {product.brand}
                      </span>
                      <span className="text-[11px] text-text-slate uppercase">
                        {product.subcategory}
                      </span>
                    </div>

                    <Link
                      href={`/produtos/${product.slug}`}
                      className="text-sm font-medium text-text-platinum hover:text-text-optic leading-snug line-clamp-2 block transition-colors"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-border-subtle flex items-baseline justify-between font-mono">
                    <div>
                      <span className="text-[10px] text-text-slate block uppercase">Valor Curadoria</span>
                      <span className="text-base font-bold text-text-optic">
                        R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                      Pronta Entrega
                    </span>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`w-full h-11 min-h-[44px] mt-2 font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition cursor-pointer border ${
                      isAdded
                        ? "bg-emerald-500 text-canvas-base border-emerald-500"
                        : "bg-canvas-base text-text-optic border-border-subtle hover:border-text-optic hover:bg-canvas-well active:scale-[0.98]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Adicionado</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-text-platinum" />
                        <span>Adicionar à Sacola</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner with Link to Full Catalog (/produtos) */}
        <div className="bg-canvas-well border border-border-subtle p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-text-optic">
              Busca por uma peça específica?
            </h4>
            <p className="text-xs text-text-slate font-mono">
              Consulte nosso catálogo completo com filtros detalhados por categoria, marca, condição e tamanho.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/produtos"
              className="h-11 px-5 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
