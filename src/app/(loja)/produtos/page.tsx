"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Search,
  Check,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  useCartStore,
} from "@/features/storefront";
import {
  TAXONOMY_CATEGORIES,
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_BRANDS,
  CONDITIONS,
  TaxonomyCategory,
} from "@/features/seller-pwa/taxonomy";

function PLPContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ALL";
  const initialSubcategory = searchParams.get("subcategory") || "ALL";
  const initialBrand = searchParams.get("brand") || "ALL";
  const initialCondition = searchParams.get("condition") || "ALL";
  const initialSearch = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialSubcategory);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [selectedCondition, setSelectedCondition] = useState<string>(initialCondition);
  const [priceTier, setPriceTier] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cart store integration
  const addItem = useCartStore((state) => state.addItem);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: CatalogProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

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
    return CATALOG_PRODUCTS.filter((product) => {
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
        const query = searchQuery.toLowerCase();
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchName = product.name.toLowerCase().includes(query);
        const matchSub = product.subcategory.toLowerCase().includes(query);
        if (!matchBrand && !matchName && !matchSub) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    selectedCondition,
    priceTier,
    searchQuery,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-canvas-base text-text-optic py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* 1. Header & Breadcrumb Bar */}
        <div className="border-b border-border-subtle pb-6 space-y-4">
          <nav className="flex items-center gap-2 font-mono text-xs text-text-slate">
            <Link href="/" className="hover:text-text-optic transition-colors">
              Início
            </Link>
            <span>/</span>
            <span className="text-text-platinum font-bold">Catálogo</span>
            {selectedCategory !== "ALL" && (
              <>
                <span>/</span>
                <span className="text-text-optic uppercase">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-2.5 py-1 text-xs font-mono tracking-widest text-text-platinum uppercase">
                <Sparkles className="w-3.5 h-3.5 text-text-optic" />
                <span>CATÁLOGO // ACERVO AUTENTICADO</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-tight text-text-optic">
                {selectedCategory === "ALL" ? "Todas as Peças" : selectedCategory}
              </h1>
              <p className="text-xs sm:text-sm text-text-platinum font-mono max-w-2xl">
                Navegue pela nossa seleção curada de streetwear, peças de passarela e sneakers raros com garantia incondicional de autenticidade.
              </p>
            </div>

            {/* Top Controls: Search and Sort */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64 bg-canvas-well border border-border-subtle flex items-center px-3 h-11 focus-within:border-border-specular transition-colors">
                <Search className="w-4 h-4 text-text-slate mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar no acervo..."
                  className="bg-transparent text-xs font-mono text-text-optic placeholder-text-slate outline-none w-full"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-text-slate hover:text-text-optic"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="relative bg-canvas-well border border-border-subtle flex items-center px-3 h-11">
                <ArrowUpDown className="w-3.5 h-3.5 text-text-slate mr-2 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "name")}
                  className="bg-canvas-well text-text-optic font-mono text-xs outline-none cursor-pointer pr-4"
                >
                  <option value="featured">Destaques da Curadoria</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Alfabética (A-Z)</option>
                </select>
              </div>

              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden h-11 px-4 bg-canvas-well border border-border-subtle text-text-optic font-mono flex items-center gap-2 hover:border-border-specular transition cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros ({filteredProducts.length})</span>
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-2 font-mono text-xs">
              <span className="text-text-slate">Filtros Ativos:</span>

              {selectedCategory !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className="bg-canvas-well border border-border-subtle px-2.5 py-1 text-text-optic flex items-center gap-1.5 hover:border-red-500/50 transition cursor-pointer"
                >
                  <span>Cat: {selectedCategory}</span>
                  <X className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedSubcategory !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory("ALL")}
                  className="bg-canvas-well border border-border-subtle px-2.5 py-1 text-text-optic flex items-center gap-1.5 hover:border-red-500/50 transition cursor-pointer"
                >
                  <span>Sub: {selectedSubcategory}</span>
                  <X className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedBrand !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedBrand("ALL")}
                  className="bg-canvas-well border border-border-subtle px-2.5 py-1 text-text-optic flex items-center gap-1.5 hover:border-red-500/50 transition cursor-pointer"
                >
                  <span>Marca: {selectedBrand}</span>
                  <X className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {selectedCondition !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setSelectedCondition("ALL")}
                  className="bg-canvas-well border border-border-subtle px-2.5 py-1 text-text-optic flex items-center gap-1.5 hover:border-red-500/50 transition cursor-pointer"
                >
                  <span>Condição: {selectedCondition}</span>
                  <X className="w-3 h-3 text-text-slate" />
                </button>
              )}

              {priceTier !== "ALL" && (
                <button
                  type="button"
                  onClick={() => setPriceTier("ALL")}
                  className="bg-canvas-well border border-border-subtle px-2.5 py-1 text-text-optic flex items-center gap-1.5 hover:border-red-500/50 transition cursor-pointer"
                >
                  <span>Faixa de Preço</span>
                  <X className="w-3 h-3 text-text-slate" />
                </button>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-text-platinum hover:text-text-optic underline flex items-center gap-1 ml-2 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpar Todos</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Main Two-Column Layout (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* DESKTOP SIDEBAR FILTERS (Solid bg-canvas-well block for WCAG AAA) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-canvas-well border border-border-subtle p-5 space-y-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-optic flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-text-platinum" />
                  FILTROS // ACERVO
                </span>
                <span className="font-mono text-[11px] text-text-slate">
                  {filteredProducts.length} itens
                </span>
              </div>

              {/* Category Filter */}
              <div className="space-y-2.5 font-mono text-xs">
                <label className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                  Categoria
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("ALL");
                      setSelectedSubcategory("ALL");
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between transition cursor-pointer border ${
                      selectedCategory === "ALL"
                        ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                        : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic"
                    }`}
                  >
                    <span>Todas as Categorias</span>
                    <span>{CATALOG_PRODUCTS.length}</span>
                  </button>

                  {TAXONOMY_CATEGORIES.map((cat) => {
                    const count = CATALOG_PRODUCTS.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedSubcategory("ALL");
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between transition cursor-pointer border ${
                          selectedCategory === cat
                            ? "bg-text-optic text-canvas-base font-bold border-text-optic"
                            : "bg-canvas-base text-text-platinum border-border-subtle hover:text-text-optic"
                        }`}
                      >
                        <span>{cat}</span>
                        <span>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subcategory Filter (Contextual) */}
              {selectedCategory !== "ALL" && (
                <div className="space-y-2.5 font-mono text-xs border-t border-border-subtle pt-4">
                  <label className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                    Subcategoria ({selectedCategory})
                  </label>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setSelectedSubcategory("ALL")}
                      className={`w-full px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                        selectedSubcategory === "ALL"
                          ? "text-text-optic font-bold underline"
                          : "text-text-slate hover:text-text-platinum"
                      }`}
                    >
                      • Todas em {selectedCategory}
                    </button>

                    {TAXONOMY_SUBCATEGORIES[selectedCategory as TaxonomyCategory]?.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`w-full px-2.5 py-1.5 text-left text-xs transition cursor-pointer flex items-center justify-between ${
                          selectedSubcategory === sub
                            ? "text-text-optic font-bold bg-canvas-base border border-border-subtle"
                            : "text-text-slate hover:text-text-platinum"
                        }`}
                      >
                        <span>{sub}</span>
                        {selectedSubcategory === sub && <Check className="w-3 h-3 text-text-optic" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brand Filter */}
              <div className="space-y-2.5 font-mono text-xs border-t border-border-subtle pt-4">
                <label className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                  Marca // Grife
                </label>
                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedBrand("ALL")}
                    className={`w-full px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                      selectedBrand === "ALL"
                        ? "text-text-optic font-bold underline"
                        : "text-text-slate hover:text-text-platinum"
                    }`}
                  >
                    • Todas as Casas
                  </button>
                  {TAXONOMY_BRANDS.slice(0, 14).map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full px-2.5 py-1.5 text-left text-xs transition cursor-pointer flex items-center justify-between ${
                        selectedBrand === brand
                          ? "text-text-optic font-bold bg-canvas-base border border-border-subtle"
                          : "text-text-slate hover:text-text-platinum"
                      }`}
                    >
                      <span>{brand}</span>
                      {selectedBrand === brand && <Check className="w-3 h-3 text-text-optic" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2.5 font-mono text-xs border-t border-border-subtle pt-4">
                <label className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                  Condição da Peça
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCondition("ALL")}
                    className={`w-full px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                      selectedCondition === "ALL"
                        ? "text-text-optic font-bold underline"
                        : "text-text-slate hover:text-text-platinum"
                    }`}
                  >
                    • Todas as Condições
                  </button>
                  {CONDITIONS.map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setSelectedCondition(cond.value)}
                      className={`w-full p-2 text-left border transition cursor-pointer ${
                        selectedCondition === cond.value
                          ? "bg-canvas-base border-text-optic text-text-optic font-bold"
                          : "bg-canvas-well border-border-subtle text-text-slate hover:text-text-platinum"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{cond.value}</span>
                        {selectedCondition === cond.value && <Check className="w-3 h-3" />}
                      </div>
                      <span className="text-[10px] text-text-slate block truncate">
                        {cond.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Filter */}
              <div className="space-y-2.5 font-mono text-xs border-t border-border-subtle pt-4">
                <label className="text-[11px] text-text-slate uppercase tracking-wider block font-bold">
                  Faixa de Valor (BRL)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: "ALL", label: "Todos" },
                    { id: "under1500", label: "Até R$1.5k" },
                    { id: "1500to3000", label: "1.5k - 3k" },
                    { id: "3000to5000", label: "3k - 5k" },
                    { id: "above5000", label: "+ de 5k" },
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPriceTier(tier.id)}
                      className={`p-2 text-center text-[11px] border transition cursor-pointer ${
                        priceTier === tier.id
                          ? "bg-text-optic text-canvas-base border-text-optic font-bold"
                          : "bg-canvas-base text-text-slate border-border-subtle hover:text-text-optic"
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full h-10 bg-canvas-base border border-border-subtle text-text-platinum hover:text-text-optic hover:border-text-optic font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Filtros</span>
                </button>
              )}
            </div>
          </aside>

          {/* PRODUCTS GRID (9 cols desktop, solid bg-canvas-well cards for contrast) */}
          <main className="lg:col-span-9 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-canvas-well border border-border-subtle p-12 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-canvas-base border border-border-subtle flex items-center justify-center text-text-slate">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-mono font-bold uppercase text-text-optic">
                  Nenhuma peça encontrada
                </h3>
                <p className="text-xs font-mono text-text-platinum max-w-md mx-auto">
                  Não encontramos nenhum item catalogado com os critérios selecionados. Tente relaxar os filtros de marca, categoria ou preço.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-11 px-6 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resetar Filtros</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isAdded = addedItems[product.id];

                  return (
                    <article
                      key={product.id}
                      className="group relative bg-canvas-well border border-border-subtle flex flex-col justify-between overflow-hidden hover:border-border-specular transition-all duration-300"
                    >
                      {/* Clickable Image to PDP */}
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

                        {/* Badges */}
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
                          <span>ORIGINAL</span>
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
                            <span className="text-[10px] text-text-slate block uppercase">Preço</span>
                            <span className="text-base font-bold text-text-optic">
                              R$ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                            Pronta Entrega
                          </span>
                        </div>

                        {/* Action Buttons: Add to Cart or View Details */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={`/produtos/${product.slug}`}
                            className="h-10 border border-border-subtle bg-canvas-base text-text-platinum hover:text-text-optic hover:border-text-optic font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center transition"
                          >
                            Detalhes
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`h-10 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                              isAdded
                                ? "bg-emerald-500 text-canvas-base border-emerald-500"
                                : "bg-text-optic text-canvas-base border-text-optic hover:bg-neutral-200"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Adicionado</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Comprar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex justify-end">
          <div className="w-full max-w-md h-full bg-canvas-well border-l border-border-subtle p-6 overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-text-optic" />
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-text-optic">
                  Filtros do Catálogo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-text-slate hover:text-text-optic"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category Select */}
            <div className="space-y-2 font-mono text-xs">
              <label className="text-text-slate uppercase font-bold">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                {["ALL", ...TAXONOMY_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedSubcategory("ALL");
                    }}
                    className={`p-2.5 text-center border font-bold uppercase transition ${
                      selectedCategory === cat
                        ? "bg-text-optic text-canvas-base border-text-optic"
                        : "bg-canvas-base text-text-slate border-border-subtle"
                    }`}
                  >
                    {cat === "ALL" ? "Todas" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Condition Select */}
            <div className="space-y-2 font-mono text-xs">
              <label className="text-text-slate uppercase font-bold">Condição</label>
              <div className="grid grid-cols-2 gap-2">
                {["ALL", "DSWT", "PRISTINE", "GENTLY_USED", "VINTAGE"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedCondition(c)}
                    className={`p-2.5 text-center border font-bold uppercase transition ${
                      selectedCondition === c
                        ? "bg-text-optic text-canvas-base border-text-optic"
                        : "bg-canvas-base text-text-slate border-border-subtle"
                    }`}
                  >
                    {c === "ALL" ? "Todas" : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Close / Apply CTA */}
            <div className="pt-4 border-t border-border-subtle space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-12 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-widest"
              >
                Ver {filteredProducts.length} Peças
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full h-10 text-text-slate font-mono text-xs hover:text-text-optic"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PLPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas-base py-12 px-6 font-mono text-xs text-text-slate">Carregando catálogo...</div>}>
      <PLPContent />
    </Suspense>
  );
}
