"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CaretDown,
  Bag,
  MagnifyingGlass,
  List,
  X,
  ShieldCheck,
  ArrowUpRight,
  User,
  Globe,
  Sparkle,
} from "@phosphor-icons/react";
import {
  TAXONOMY_SUBCATEGORIES,
  TAXONOMY_BRANDS,
} from "@/features/seller-pwa/taxonomy";
import { useCartStore } from "../stores/useCartStore";

const emptySubscribe = () => () => {};

export function Header() {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [showCurrencyTooltip, setShowCurrencyTooltip] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const itemCount = useCartStore((state) => state.getItemCount());

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    } else {
      router.push("/produtos");
    }
  };

  // Close dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas-base/95 backdrop-blur-xl border-b border-border-subtle">
      {/* 1. TOP CENTRALIZED SEARCH & CURRENCY BAR (Directly above the lowered navbar) */}
      <div className="w-full bg-canvas-well/80 border-b border-border-subtle/80 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Subtle Left Tag */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-text-slate tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
            <span>ACERVO DIGITAL // PEÇAS CERTIFICADAS</span>
          </div>

          {/* Centralized Search Bar (Directly Above Nav Bar) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl mx-auto relative flex items-center"
          >
            <div className="relative w-full flex items-center bg-canvas-base border border-border-subtle hover:border-border-specular focus-within:border-text-optic transition-colors px-3 py-1.5 shadow-inner">
              <MagnifyingGlass
                weight="light"
                className="w-3.5 h-3.5 text-text-platinum mr-2.5 shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="BUSCAR ACERVO (SUPREME, GORE-TEX, LANVIN, FLEECE...)"
                aria-label="Buscar produtos no acervo"
                className="w-full bg-transparent text-text-optic placeholder:text-text-slate font-mono text-[11px] tracking-wider uppercase outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-text-slate hover:text-text-optic text-[10px] font-mono px-1"
                >
                  LIMPAR
                </button>
              )}
              <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-canvas-well border border-border-subtle text-[9px] font-mono text-text-slate px-1.5 py-0.5 ml-2">
                ENTER
              </kbd>
            </div>
          </form>

          {/* Currency & Language Switcher Placeholder (BRL/PTBR & USD/EN) */}
          <div className="relative flex items-center gap-1 font-mono text-[11px] shrink-0">
            <div
              className="flex items-center bg-canvas-base border border-border-subtle p-0.5"
              onMouseEnter={() => setShowCurrencyTooltip(true)}
              onMouseLeave={() => setShowCurrencyTooltip(false)}
            >
              <button
                type="button"
                onClick={() => setCurrency("BRL")}
                className={`px-2 py-0.5 tracking-wider transition-all cursor-pointer ${
                  currency === "BRL"
                    ? "bg-text-optic text-canvas-base font-bold shadow-sm"
                    : "text-text-slate hover:text-text-platinum"
                }`}
                title="Moeda: Real Brasileiro (PT-BR)"
              >
                BRL (R$)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrency("USD");
                  setShowCurrencyTooltip(true);
                  setTimeout(() => setShowCurrencyTooltip(false), 3000);
                }}
                className={`px-2 py-0.5 tracking-wider transition-all cursor-pointer ${
                  currency === "USD"
                    ? "bg-text-optic text-canvas-base font-bold shadow-sm"
                    : "text-text-slate hover:text-text-platinum"
                }`}
                title="Moeda: US Dollar (EN) - Taxa de Câmbio em Breve"
              >
                USD ($)
              </button>
            </div>

            {/* Currency Tooltip */}
            {showCurrencyTooltip && (
              <div className="absolute right-0 top-full mt-2 w-56 p-2 bg-canvas-well border border-border-subtle shadow-2xl z-50 text-[10px] text-text-platinum space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center gap-1 text-text-optic font-bold">
                  <Globe weight="light" className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CÂMBIO GLOBAL // API</span>
                </div>
                <p className="text-text-slate text-[9px] leading-tight">
                  Base cambial em tempo real integrada para paridade BRL / USD para envios internacionais.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN NAV BAR (Lowered slightly with generous breathing room and spread-out links) */}
      <div className="relative w-full bg-glass-substrate backdrop-blur-[36px] border-b border-border-subtle shadow-2xl px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Monolith */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-text-optic rotate-45 group-hover:rotate-90 transition-transform duration-300 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              <div className="flex flex-col">
                <span className="font-mono text-lg sm:text-xl font-black tracking-[0.25em] text-text-optic leading-none uppercase">
                  DESAPEGADO
                </span>
                <span className="text-[9px] font-mono tracking-[0.3em] text-text-slate uppercase mt-1">
                  ARCHIVE // STREETWEAR &amp; LUXURY
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - SPREAD OUT with generous spacing and luxury tracking */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12 font-mono text-xs tracking-[0.2em]">
            {/* NOVIDADES LINK */}
            <Link
              href="/produtos"
              className="py-1 text-text-platinum hover:text-text-optic transition-colors uppercase font-medium relative group"
            >
              <span>Novidades</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-text-optic group-hover:w-full transition-all duration-300" />
            </Link>

            {/* ROUPAS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Roupas")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Roupas" ? null : "Roupas")}
                className={`py-1 flex items-center gap-1.5 uppercase transition-colors cursor-pointer relative group ${
                  activeDropdown === "Roupas"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Roupas</span>
                <CaretDown
                  weight="light"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Roupas" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-text-optic group-hover:w-full transition-all duration-300" />
              </button>

              {/* Liquid Glass Specular Dropdown Container for Roupas */}
              {activeDropdown === "Roupas" && (
                <div
                  className="absolute left-0 top-full pt-3 w-[440px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Roupas")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        CATEGORIAS // ROUPAS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        {TAXONOMY_SUBCATEGORIES.Roupas.length} CATEGORIAS
                      </span>
                    </div>

                    {/* Solid bg-canvas-well block for WCAG AAA Contrast */}
                    <div className="bg-canvas-well border border-border-subtle p-3.5">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Roupas.map((item) => (
                          <Link
                            key={item}
                            href={`/produtos?category=Roupas&subcategory=${encodeURIComponent(item)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span>{item}</span>
                            <ArrowUpRight weight="light" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Arquivo Streetwear &amp; Passarela</span>
                      <Link
                        href="/produtos?category=Roupas"
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Explorar Todas</span>
                        <ArrowUpRight weight="light" className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SNEAKERS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Sneakers")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "Sneakers" ? null : "Sneakers")
                }
                className={`py-1 flex items-center gap-1.5 uppercase transition-colors cursor-pointer relative group ${
                  activeDropdown === "Sneakers"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Sneakers</span>
                <CaretDown
                  weight="light"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Sneakers" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-text-optic group-hover:w-full transition-all duration-300" />
              </button>

              {/* Liquid Glass Dropdown Container for Sneakers */}
              {activeDropdown === "Sneakers" && (
                <div
                  className="absolute left-0 top-full pt-3 w-[420px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Sneakers")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        SNEAKERS // SELEÇÃO DE GRAILS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        SELEÇÃO DE LUXO &amp; GRAILS
                      </span>
                    </div>

                    <div className="bg-canvas-well border border-border-subtle p-3.5 space-y-2">
                      <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Sneakers.map((brandItem) => (
                          <Link
                            key={brandItem}
                            href={`/produtos?category=Sneakers&brand=${encodeURIComponent(brandItem)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2.5 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span className="font-bold text-text-optic">{brandItem}</span>
                            <span className="text-[10px] text-text-slate flex items-center gap-1 group-hover:text-text-optic">
                              <span>Acervo Autenticado</span>
                              <ArrowUpRight weight="light" className="w-3.5 h-3.5" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Nike, Adidas, Balenciaga, Lanvin, LV</span>
                      <Link
                        href="/produtos?category=Sneakers"
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Explorar Sneakers</span>
                        <ArrowUpRight weight="light" className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACESSÓRIOS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Acessórios")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "Acessórios" ? null : "Acessórios")
                }
                className={`py-1 flex items-center gap-1.5 uppercase transition-colors cursor-pointer relative group ${
                  activeDropdown === "Acessórios"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Acessórios</span>
                <CaretDown
                  weight="light"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Acessórios"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-text-optic group-hover:w-full transition-all duration-300" />
              </button>

              {/* Liquid Glass Dropdown Container for Acessórios */}
              {activeDropdown === "Acessórios" && (
                <div
                  className="absolute left-0 top-full pt-3 w-[440px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Acessórios")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        CATEGORIAS // ACESSÓRIOS
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        {TAXONOMY_SUBCATEGORIES.Acessórios.length} SUBCATEGORIAS
                      </span>
                    </div>

                    <div className="bg-canvas-well border border-border-subtle p-3.5">
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {TAXONOMY_SUBCATEGORIES.Acessórios.map((item) => (
                          <Link
                            key={item}
                            href={`/produtos?category=${encodeURIComponent("Acessórios")}&subcategory=${encodeURIComponent(item)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-2 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span>{item}</span>
                            <ArrowUpRight weight="light" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Bonés, Gorros, Balaclavas e Acessórios</span>
                      <Link
                        href={`/produtos?category=${encodeURIComponent("Acessórios")}`}
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Ver Acessórios</span>
                        <ArrowUpRight weight="light" className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MARCAS DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("Marcas")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "Marcas" ? null : "Marcas")}
                className={`py-1 flex items-center gap-1.5 uppercase transition-colors cursor-pointer relative group ${
                  activeDropdown === "Marcas"
                    ? "text-text-optic font-bold"
                    : "text-text-platinum hover:text-text-optic"
                }`}
              >
                <span>Marcas</span>
                <CaretDown
                  weight="light"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "Marcas" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-text-optic group-hover:w-full transition-all duration-300" />
              </button>

              {/* Liquid Glass Dropdown Container for Marcas */}
              {activeDropdown === "Marcas" && (
                <div
                  className="absolute -left-20 top-full pt-3 w-[560px] animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={() => handleMouseEnter("Marcas")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b-black/90 border-x border-border-subtle shadow-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-optic uppercase">
                        MARCAS // ACERVO DE LUXO &amp; STREETWEAR
                      </span>
                      <span className="text-[10px] font-mono text-text-slate">
                        {TAXONOMY_BRANDS.length} MARCAS
                      </span>
                    </div>

                    <div className="bg-canvas-well border border-border-subtle p-3.5">
                      <div className="grid grid-cols-3 gap-2 text-xs font-mono max-h-64 overflow-y-auto pr-1">
                        {TAXONOMY_BRANDS.map((item) => (
                          <Link
                            key={item}
                            href={`/produtos?brand=${encodeURIComponent(item)}`}
                            onClick={() => setActiveDropdown(null)}
                            className="p-1.5 hover:bg-canvas-base border border-transparent hover:border-border-subtle text-text-platinum hover:text-text-optic flex items-center justify-between group transition-all"
                          >
                            <span className="truncate">{item}</span>
                            <ArrowUpRight weight="light" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-text-optic" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-text-slate">
                      <span>Curadoria de Peças Raras &amp; Certificadas</span>
                      <Link
                        href="/#marcas"
                        onClick={() => setActiveDropdown(null)}
                        className="text-text-optic hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Ver Vitrine 3D</span>
                        <ArrowUpRight weight="light" className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right: Actions (Authenticity, User, Shopping Bag - 'Vender Peça' link removed) */}
          <div className="flex items-center gap-3">
            {/* Authenticity Badge */}
            <div className="hidden xl:flex items-center gap-1.5 bg-canvas-well border border-border-subtle px-3 py-2 text-xs font-mono text-text-platinum">
              <ShieldCheck weight="light" className="w-4 h-4 text-text-optic" />
              <span className="text-[11px] tracking-wider uppercase font-medium">100% ORIGINAL</span>
            </div>

            {/* User Auth Link */}
            <Link
              href="/entrar"
              aria-label="Conta do Usuário"
              className="h-10 px-3 bg-canvas-well border border-border-subtle text-text-platinum hover:text-text-optic hover:border-border-specular flex items-center gap-2 text-xs font-mono transition-colors"
            >
              <User weight="light" className="w-4 h-4 text-text-platinum" />
              <span className="hidden md:inline">Entrar</span>
            </Link>

            {/* Shopping Bag Button (Links to /carrinho with live count) */}
            <Link
              href="/carrinho"
              aria-label="Sacola de Compras"
              className="h-10 px-3.5 bg-canvas-well border border-border-subtle text-text-optic flex items-center gap-2 text-xs font-mono hover:border-border-specular transition-colors cursor-pointer"
            >
              <Bag weight="light" className="w-4 h-4 text-text-optic" />
              <span className="font-bold">{mounted ? itemCount : 0}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu de navegação"
              className="lg:hidden h-10 w-10 bg-canvas-well border border-border-subtle flex items-center justify-center text-text-optic cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X weight="light" className="w-5 h-5" />
              ) : (
                <List weight="light" className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer (Full Taxonomy Accordion & Cohesive Links) */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-canvas-base border-b border-border-subtle p-5 space-y-5 animate-in fade-in slide-in-from-top-4 duration-200 font-mono text-xs max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <span className="text-text-platinum uppercase tracking-widest font-bold text-xs">
              CATEGORIAS DO ACERVO
            </span>
            <span className="text-[10px] text-text-slate">DESAPEGADO // BRASIL</span>
          </div>

          <div className="space-y-3">
            {/* Novidades Direct */}
            <Link
              href="/produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full p-3.5 bg-canvas-well border border-border-subtle flex items-center justify-between font-bold text-text-optic uppercase tracking-wider block"
            >
              <span>Novidades Recentes</span>
              <ArrowUpRight weight="light" className="w-4 h-4 text-text-platinum" />
            </Link>

            {/* Mobile Roupas Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Roupas" ? null : "Roupas")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Roupas ({TAXONOMY_SUBCATEGORIES.Roupas.length})</span>
                <CaretDown
                  weight="light"
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Roupas" ? "rotate-180 text-text-optic" : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Roupas" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Roupas.map((item) => (
                    <Link
                      key={item}
                      href={`/produtos?category=Roupas&subcategory=${encodeURIComponent(item)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Acessórios Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Acessórios" ? null : "Acessórios")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Acessórios ({TAXONOMY_SUBCATEGORIES.Acessórios.length})</span>
                <CaretDown
                  weight="light"
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Acessórios"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Acessórios" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Acessórios.map((item) => (
                    <Link
                      key={item}
                      href={`/produtos?category=${encodeURIComponent("Acessórios")}&subcategory=${encodeURIComponent(item)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Sneakers Accordion */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Sneakers" ? null : "Sneakers")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Sneakers ({TAXONOMY_SUBCATEGORIES.Sneakers.length})</span>
                <CaretDown
                  weight="light"
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Sneakers"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Sneakers" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base">
                  {TAXONOMY_SUBCATEGORIES.Sneakers.map((item) => (
                    <Link
                      key={item}
                      href={`/produtos?category=Sneakers&brand=${encodeURIComponent(item)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center font-bold"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Marcas Direct */}
            <div className="border border-border-subtle bg-canvas-well">
              <button
                type="button"
                onClick={() =>
                  setMobileExpandedCat(mobileExpandedCat === "Marcas" ? null : "Marcas")
                }
                className="w-full p-3.5 flex items-center justify-between text-left font-bold text-text-optic uppercase tracking-wider cursor-pointer"
              >
                <span>Marcas ({TAXONOMY_BRANDS.length})</span>
                <CaretDown
                  weight="light"
                  className={`w-4 h-4 transition-transform ${
                    mobileExpandedCat === "Marcas"
                      ? "rotate-180 text-text-optic"
                      : "text-text-slate"
                  }`}
                />
              </button>
              {mobileExpandedCat === "Marcas" && (
                <div className="p-3 border-t border-border-subtle grid grid-cols-2 gap-2 bg-canvas-base max-h-56 overflow-y-auto">
                  {TAXONOMY_BRANDS.map((b) => (
                    <Link
                      key={b}
                      href={`/produtos?brand=${encodeURIComponent(b)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 text-text-platinum hover:text-text-optic border border-border-subtle bg-canvas-well text-center"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
            <Link
              href="/entrar"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-canvas-well border border-border-subtle text-text-optic flex items-center justify-between"
            >
              <span className="font-bold">Minha Conta // Entrar</span>
              <User weight="light" className="w-4 h-4 text-text-platinum" />
            </Link>
            <Link
              href="/carrinho"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-canvas-well border border-border-subtle text-text-optic flex items-center justify-between"
            >
              <span className="font-bold">Sacola de Compras ({mounted ? itemCount : 0})</span>
              <Bag weight="light" className="w-4 h-4 text-text-platinum" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
