"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FadersHorizontal,
  X,
  MagnifyingGlass,
  ArrowsDownUp,
  ArrowClockwise,
  Sparkle,
  CaretDown,
} from "@phosphor-icons/react";
import {
  CATALOG_PRODUCTS,
  type CatalogProduct,
  ProductCard,
} from "@/features/storefront";
import {
  TAXONOMY_CATEGORIES,
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_BRANDS,
  CONDITIONS,
  type TaxonomyCategory,
} from "@/features/seller-pwa/taxonomy";

function PLPContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialSubcategory = searchParams.get("subcategory") || "ALL";
  const initialBrand = searchParams.get("brand") || "ALL";
  const initialCondition = searchParams.get("condition") || "ALL";
  const initialSearch = searchParams.get("q") || "";

  const [productsList, setProductsList] = useState<CatalogProduct[]>(CATALOG_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition);
  const [priceTier, setPriceTier] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params if they change
  useEffect(() => {
    if (searchParams.get("category")) setSelectedCategory(searchParams.get("category")!);
    if (searchParams.get("subcategory")) setSelectedSubcategory(searchParams.get("subcategory")!);
    if (searchParams.get("brand")) setSelectedBrand(searchParams.get("brand")!);
    if (searchParams.get("condition")) setSelectedCondition(searchParams.get("condition")!);
    if (searchParams.get("q")) setSearchQuery(searchParams.get("q")!);
  }, [searchParams]);

  // Fetch live products from Neon DB via /api/products
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch((err) => console.warn("Fallback para mock em PLP:", err));
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSelectedSubcategory("ALL");
    setSelectedBrand("ALL");
    setSelectedCondition("ALL");
    setPriceTier("ALL");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedCategory !== "ALL" ||
    selectedSubcategory !== "ALL" ||
    selectedBrand !== "ALL" ||
    selectedCondition !== "ALL" ||
    priceTier !== "ALL" ||
    searchQuery.trim().length > 0;

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      if (selectedCategory !== "ALL" && product.category !== selectedCategory) {
        return false;
      }
      if (selectedSubcategory !== "ALL" && product.subcategory !== selectedSubcategory) {
        return false;
      }
      if (selectedBrand !== "ALL" && product.brand !== selectedBrand) {
        return false;
      }
      if (selectedCondition !== "ALL" && product.condition !== selectedCondition) {
        return false;
      }
      if (priceTier !== "ALL") {
        if (priceTier === "under1500" && product.price >= 1500) return false;
        if (priceTier === "1500to3000" && (product.price < 1500 || product.price > 3000)) return false;
        if (priceTier === "3000to5000" && (product.price < 3000 || product.price > 5000)) return false;
        if (priceTier === "above5000" && product.price <= 5000) return false;
      }
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSub = product.subcategory.toLowerCase().includes(query);
        return matchesName || matchesBrand || matchesDesc || matchesSub;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // Default curated order
    });
  }, [productsList, selectedCategory, selectedSubcategory, selectedBrand, selectedCondition, priceTier, searchQuery, sortBy]);

  return (
    <div className="w-full min-h-screen text-text-optic py-8 sm:py-12 px-4 sm:px-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Header Hero Title */}
        <div className="space-y-3 pb-4 border-b border-white/[0.1]">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-text-platinum uppercase">
            <Sparkle weight="light" className="w-3.5 h-3.5 text-text-optic" />
            <span>CATÁLOGO // ACERVO DE MODA &amp; ARQUIVO</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase font-mono tracking-tight text-text-optic">
                {selectedCategory === "ALL" ? "Todas as Peças do Acervo" : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-text-platinum font-mono mt-1">
                {filteredProducts.length} peça{filteredProducts.length === 1 ? "" : "s"} autenticada{filteredProducts.length === 1 ? "" : "s"} em catálogo
              </p>
            </div>

            {/* Sort & Mobile Filter Trigger */}
            <div className="flex items-center gap-2">
              <div className="relative bg-[#0c0e14]/80 backdrop-blur-md border border-white/15 flex items-center px-3 h-10 shadow-sm">
                <ArrowsDownUp weight="light" className="w-3.5 h-3.5 text-text-slate mr-2 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-text-optic font-mono text-xs outline-none cursor-pointer pr-4"
                >
                  <option value="featured" className="bg-[#0c0e14] text-white">Destaques da Curadoria</option>
                  <option value="price-asc" className="bg-[#0c0e14] text-white">Menor Preço</option>
                  <option value="price-desc" className="bg-[#0c0e14] text-white">Maior Preço</option>
                  <option value="name" className="bg-[#0c0e14] text-white">Alfabética (A-Z)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-10 px-3.5 bg-[#0c0e14]/80 backdrop-blur-md border border-white/15 text-text-optic font-mono text-xs flex items-center gap-1.5 hover:border-white/30 transition cursor-pointer"
              >
                <FadersHorizontal weight="light" className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. REFACTORED HORIZONTAL FILTER BAR (Glass Substrate) */}
        <div className="w-full bg-[#0c0e14]/75 backdrop-blur-xl border border-white/[0.12] p-3 sm:p-4 space-y-3 shadow-2xl shadow-black/60 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14)]">
          {/* Top Row: Primary Category Tabs */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSelectedSubcategory("ALL");
                }}
                className={`px-3 py-1.5 uppercase tracking-wider transition cursor-pointer border ${
                  selectedCategory === "ALL"
                    ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                    : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic hover:border-border-specular"
                }`}
              >
                Todas ({productsList.length})
              </button>

              {TAXONOMY_CATEGORIES.map((cat) => {
                const count = productsList.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory("ALL");
                    }}
                    className={`px-3 py-1.5 uppercase tracking-wider transition cursor-pointer border ${
                      selectedCategory === cat
                        ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                        : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic hover:border-border-specular"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Quick Keyword Search in Bar */}
            <div className="relative flex items-center bg-canvas-base border border-border-subtle px-3 py-1 w-full sm:w-64">
              <MagnifyingGlass weight="light" className="w-3.5 h-3.5 text-text-slate mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por nome, tag..."
                className="w-full bg-transparent text-text-optic placeholder:text-text-slate font-mono text-xs outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-text-slate hover:text-text-optic"
                >
                  <X weight="light" className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Secondary Row: Contextual Subcategories */}
          {selectedCategory !== "ALL" && TAXONOMY_SUBCATEGORIES[selectedCategory as TaxonomyCategory] && (
            <div className="pt-2 border-t border-border-subtle/70 flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
              <span className="text-text-slate uppercase font-bold mr-1">Subcategorias:</span>
              <button
                type="button"
                onClick={() => setSelectedSubcategory("ALL")}
                className={`px-2 py-0.5 border transition cursor-pointer ${
                  selectedSubcategory === "ALL"
                    ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                    : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic"
                }`}
              >
                Todas em {selectedCategory}
              </button>
              {TAXONOMY_SUBCATEGORIES[selectedCategory as TaxonomyCategory].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-2 py-0.5 border transition cursor-pointer ${
                    selectedSubcategory === sub
                      ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                      : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Third Row: Dropdown Filters for Brand, Condition, Price */}
          <div className="pt-2 border-t border-border-subtle/70 hidden lg:flex items-center gap-3 font-mono text-xs flex-wrap">
            {/* Brand Dropdown */}
            <div className="relative bg-canvas-base border border-border-subtle px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-text-slate uppercase text-[10px] font-bold">Marca:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-canvas-base text-text-optic font-mono text-xs outline-none cursor-pointer"
              >
                <option value="ALL">Todas as Marcas ({TAXONOMY_BRANDS.length})</option>
                {TAXONOMY_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Dropdown */}
            <div className="relative bg-canvas-base border border-border-subtle px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-text-slate uppercase text-[10px] font-bold">Condição:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="bg-canvas-base text-text-optic font-mono text-xs outline-none cursor-pointer"
              >
                <option value="ALL">Todas as Condições</option>
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Tier Dropdown */}
            <div className="relative bg-canvas-base border border-border-subtle px-2.5 py-1.5 flex items-center gap-1.5">
              <span className="text-text-slate uppercase text-[10px] font-bold">Faixa de Preço:</span>
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value)}
                className="bg-canvas-base text-text-optic font-mono text-xs outline-none cursor-pointer"
              >
                <option value="ALL">Qualquer Valor</option>
                <option value="under1500">Até R$ 1.500</option>
                <option value="1500to3000">R$ 1.500 a R$ 3.000</option>
                <option value="3000to5000">R$ 3.000 a R$ 5.000</option>
                <option value="above5000">Acima de R$ 5.000</option>
              </select>
            </div>

            {/* Reset Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-text-platinum hover:text-text-optic underline flex items-center gap-1 ml-auto transition cursor-pointer text-xs"
              >
                <ArrowClockwise weight="light" className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border-subtle/50 font-mono text-xs">
              <span className="text-text-slate text-[11px]">Filtros ativos:</span>

              {selectedCategory !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className="bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-optic flex items-center gap-1 hover:border-red-400 transition"
                >
                  <span>{selectedCategory}</span>
                  <X weight="light" className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedSubcategory !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory("ALL")}
                  className="bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-optic flex items-center gap-1 hover:border-red-400 transition"
                >
                  <span>{selectedSubcategory}</span>
                  <X weight="light" className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedBrand !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedBrand("ALL")}
                  className="bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-optic flex items-center gap-1 hover:border-red-400 transition"
                >
                  <span>{selectedBrand}</span>
                  <X weight="light" className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedCondition !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedCondition("ALL")}
                  className="bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-optic flex items-center gap-1 hover:border-red-400 transition"
                >
                  <span>Condição: {selectedCondition}</span>
                  <X weight="light" className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {priceTier !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setPriceTier("ALL")}
                  className="bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-optic flex items-center gap-1 hover:border-red-400 transition"
                >
                  <span>Faixa de Preço</span>
                  <X weight="light" className="w-3 h-3 text-text-slate" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. FULL-WIDTH EDITORIAL PRODUCT GRID (Replaces 9-col layout) */}
        <main className="w-full">
          {filteredProducts.length === 0 ? (
            <div className="bg-canvas-well border border-border-subtle p-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-canvas-base border border-border-subtle flex items-center justify-center text-text-slate">
                <MagnifyingGlass weight="light" className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-mono font-bold uppercase text-text-optic">
                Nenhuma peça encontrada
              </h3>
              <p className="text-xs font-mono text-text-platinum max-w-md mx-auto">
                Não localizamos nenhum item catalogado com os critérios selecionados. Redefina os filtros para explorar o acervo completo.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-11 px-6 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer"
              >
                <ArrowClockwise weight="light" className="w-4 h-4" />
                <span>Resetar Filtros</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 10} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 4. Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-canvas-well border-l border-border-subtle p-6 space-y-6 overflow-y-auto font-mono text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <span className="font-bold text-sm uppercase text-text-optic">Filtros do Catálogo</span>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center border border-border-subtle text-text-optic"
              >
                <X weight="light" className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="space-y-2">
              <label className="text-text-slate font-bold uppercase text-[10px]">Categoria</label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("ALL");
                    setSelectedSubcategory("ALL");
                  }}
                  className={`w-full p-2 text-left border ${
                    selectedCategory === "ALL"
                      ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                      : "bg-canvas-base text-text-platinum border-border-subtle"
                  }`}
                >
                  Todas ({productsList.length})
                </button>
                {TAXONOMY_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(c);
                      setSelectedSubcategory("ALL");
                    }}
                    className={`w-full p-2 text-left border ${
                      selectedCategory === c
                        ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                        : "bg-canvas-base text-text-platinum border-border-subtle"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Brand */}
            <div className="space-y-2">
              <label className="text-text-slate font-bold uppercase text-[10px]">Marca</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2.5 bg-canvas-base border border-border-subtle text-text-optic"
              >
                <option value="ALL">Todas as Marcas</option>
                {TAXONOMY_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-border-subtle space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 bg-text-optic text-canvas-base font-bold uppercase tracking-wider"
              >
                Ver {filteredProducts.length} Peças
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full h-11 bg-canvas-base border border-border-subtle text-text-platinum hover:text-text-optic font-bold uppercase tracking-wider"
                >
                  Limpar Todos
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas-base p-12 font-mono text-xs text-text-slate">Carregando acervo...</div>}>
      <PLPContent />
    </Suspense>
  );
}
